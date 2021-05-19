import React from 'react'

const DATA_URL = 'https://carbonplan.org/research/cdr-database/projects.json'

const ProjectsContext = React.createContext(null)

export const ProjectsContextProvider = ({ projects, children }) => {
  const [data, setData] = React.useState(null)

  React.useEffect(async () => {
    const result = await fetch(DATA_URL)

    const { projects } = await result.json()
    const parsedProjects = projects.map(
      ({ id, applicant, metrics, tags, rating, description }) => ({
        id,
        applicant,
        rating,
        description,
        tags,
        metrics: metrics.map(({ name, value, units, rating }) => ({
          name,
          value,
          units,
          rating,
        })),
      })
    )

    setData(parsedProjects)
  }, [])

  return (
    <ProjectsContext.Provider value={data}>{children}</ProjectsContext.Provider>
  )
}

export const useProjects = () => {
  const projects = React.useContext(ProjectsContext)

  return projects
}
