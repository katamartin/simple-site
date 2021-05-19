import React from 'react'

import { useProjects } from '../resources/projects'
import CategoryChart from './category-chart'
import { format } from 'd3-format'
import { useThemeUI, Box } from 'theme-ui'
import { useMetric } from '../resources/metrics'

const categories = [
  { name: 'forests', color: 'green' },
  { name: 'soil', color: 'orange' },
  { name: 'biomass', color: 'yellow' },
  { name: 'ocean', color: 'teal' },
  { name: 'mineralization', color: 'grey' },
  { name: 'dac', color: 'purple' },
]

const Chart = ({ metric }) => {
  const projects = useProjects()
  const { theme } = useThemeUI()
  const { ticks, xTicks } = useMetric(metric)

  const partitionedData = React.useMemo(() => {
    return projects.reduce((result, project) => {
      project.tags.forEach((tag) => {
        if (!result[tag]) result[tag] = []
        result[tag].push(project)
      })

      return result
    }, {})
  }, [projects])

  return (
    <Box
      sx={{
        width: '104.9%',
        display: 'block',
        ml: ['-1.6%'],
      }}
    >
      {categories.map(({ name, color }) => (
        <CategoryChart
          color={color}
          projects={partitionedData[name]}
          metric={metric}
          name={name}
          key={name}
        />
      ))}
      <svg width={'100%'} height={11}>
        {ticks.map((d, i) => {
          return (
            <text
              key={'tick-' + i}
              x={xTicks(d) + '%'}
              y={11}
              textAnchor={'middle'}
              fontFamily={theme.fonts.mono}
              fill={theme.colors.secondary}
              fontSize={theme.fontSizes[2]}
              style={{ userSelect: 'none' }}
            >
              {d === 1000 && name === 'permanence'
                ? '1k+'
                : d === 1000000 && name === 'volume'
                ? '1M+'
                : format('~s')(d)}
            </text>
          )
        })}
      </svg>
    </Box>
  )
}

export default Chart
