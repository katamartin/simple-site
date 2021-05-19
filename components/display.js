import { useProjects } from '../resources/projects'

const Display = () => {
  const projects = useProjects()

  return projects ? (
    <>
      Displaying data:
      {JSON.stringify(projects)}
    </>
  ) : (
    'Loading...'
  )
}

export default Display
