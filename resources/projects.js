import React from 'react'

const DATA_URL =
  'https://carbonplan.blob.core.windows.net/carbonplan-forests/offsets/database/forest-offsets-database-v1.0.json'

const ProjectsContext = React.createContext(null)

export const ProjectsContextProvider = ({ projects, children }) => {
  const [data, setData] = React.useState(null)

  React.useEffect(async () => {
    const result = await fetch(DATA_URL)
    // Manually parse result text instead of calling .json() to
    // handle NaN in JSON response

    const text = await result.text()
    const projects = JSON.parse(text.replace(/\bNaN\b/g, 'null'))
    const parsedProjects = projects
      // .filter((project) => project.over_crediting)
      .map((project) => ({
        id: project.id,
        name: project.name,
        coordinates: project.shape_centroid[0],
        // over_crediting: project.over_crediting.
      }))

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
