import React from 'react'
import { Box, useThemeUI } from 'theme-ui'
import { Column, Row, Select } from '@carbonplan/components'

import { useProjects } from '../resources/projects'
import Chart from './chart'
import { useMetric } from '../resources/metrics'
import Project from './project'

const Display = () => {
  const projects = useProjects()
  const [metric, setMetric] = React.useState('permanence')
  const [hoveredProjectId, setHoveredProjectId] = React.useState(null)
  const [selectedProjectId, selectProjectId] = React.useState(null)
  const visibleProjectId = hoveredProjectId || selectedProjectId
  const visibleProject = React.useMemo(
    () => projects?.find(({ id }) => id === visibleProjectId),
    [projects, visibleProjectId]
  )
  const { units } = useMetric(metric)
  const { theme } = useThemeUI()

  return projects ? (
    <Row columns={[6, 10]}>
      <Column start={[1]} width={[6, 6]}>
        <Select
          onChange={(e) => setMetric(e.target.value)}
          value={metric}
          size='md'
        >
          <option value='permanence'>Permanence</option>
          <option value='volume'>Volume</option>
          <option value='cost'>Cost</option>
        </Select>

        {units && (
          <Box
            sx={{
              display: 'inline-block',
              fontFamily: 'body',
              fontSize: theme.fontSizes[2],
              letterSpacing: 'body',
              color: 'secondary',
              textTransform: 'none',
              ml: [4],
            }}
          >
            {units}
          </Box>
        )}
        <Chart
          metric={metric}
          selected={selectedProjectId}
          setSelected={selectProjectId}
          hovered={hoveredProjectId}
          setHovered={setHoveredProjectId}
        />
      </Column>
      <Column start={[1, 7]} width={[6, 4]} sx={{ mt: [0, 6] }}>
        <Project
          project={visibleProject}
          metric={metric}
          onClose={() => selectProjectId(null)}
        />
      </Column>
    </Row>
  ) : (
    'Loading...'
  )
}

export default Display
