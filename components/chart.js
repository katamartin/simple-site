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

const Chart = ({ metric, selected, setSelected, hovered, setHovered }) => {
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
    <>
      <Box
        as='figure'
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
            selected={selected}
            setSelected={setSelected}
            hovered={hovered}
            setHovered={setHovered}
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
      <Box
        as='figcaption'
        sx={{
          color: 'secondary',
          mt: [3, 3, 3, 4],
          mb: [6, 6, 6, 7],
          fontSize: [2, 2, 2, 3],
        }}
      >
        Metric distributions across six project categories:{' '}
        <Box as='span' sx={{ color: 'green' }}>
          forests
        </Box>
        {', '}
        <Box as='span' sx={{ color: 'orange' }}>
          soil
        </Box>
        {', '}
        <Box as='span' sx={{ color: 'yellow' }}>
          biomass
        </Box>
        {', '}
        <Box as='span' sx={{ color: 'teal' }}>
          ocean
        </Box>
        {', '}
        <Box as='span' sx={{ color: 'grey' }}>
          mineralization
        </Box>
        {', '}
        <Box as='span' sx={{ color: 'purple' }}>
          direct air capture
        </Box>
        . Each circle represents a project, and curves show the distribution
        using a kernel density estimate. Values reflect project proposals and
        may not necessarily be accurate or realistic.
      </Box>
    </>
  )
}

export default Chart
