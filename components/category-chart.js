import React from 'react'
import { Box } from 'theme-ui'

const CategoryChart = ({ color, metric, projects }) => {
  const metricsData = React.useMemo(
    () =>
      projects.map(({ metrics, ...rest }) => ({
        ...rest,
        metric: metrics.find((m) => m.name === metric),
      })),
    [projects, metric]
  )

  return <Box sx={{ color }}>{JSON.stringify(metricsData)}</Box>
}

export default CategoryChart
