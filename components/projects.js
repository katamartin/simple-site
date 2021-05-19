import React from 'react'

const DATA_URL =
  'https://carbonplan.blob.core.windows.net/carbonplan-forests/offsets/database/forest-offsets-database-v1.0.json'

const getData = async () => {
  const result = await fetch(DATA_URL)
  const parsed = await result.json()
  return parsed
}

export const Projects = () => {
  const [data, setData] = React.useState(null)

  React.useEffect(async () => {
    const result = await fetch(DATA_URL)
    // Manually parse result text instead of calling .json() to
    // handle NaN in JSON response

    const text = await result.text()
    const parsedResult = JSON.parse(text.replace(/\bNaN\b/g, 'null'))

    setData(parsedResult)
  }, [])

  return data ? 'Got data!' : 'Loading...'
}

export default Projects
