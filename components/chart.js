import React from 'react'

import { useProjects } from '../resources/projects'
import CategoryChart from './category-chart'

const categories = [
  { name: 'dac', color: 'purple' },
  { name: 'forests', color: 'green' },
  { name: 'mineralization', color: 'grey' },
  { name: 'biomass', color: 'yellow' },
  { name: 'ocean', color: 'teal' },
  { name: 'soil', color: 'orange' },
]

const Chart = ({ metric }) => {
  const projects = useProjects()

  const partitionedData = React.useMemo(() => {
    return projects.reduce((result, project) => {
      project.tags.forEach((tag) => {
        if (!result[tag]) result[tag] = []
        result[tag].push(project)
      })

      return result
    }, {})
  }, [projects])

  return categories.map(({ name, color }) => (
    <CategoryChart
      color={color}
      projects={partitionedData[name]}
      metric={metric}
      key={name}
    />
  ))
}

export default Chart
