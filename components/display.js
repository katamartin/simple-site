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
  const [selectedProjectId, selectProjectId] = React.useState(null)
  const selectedProject = React.useMemo(
    () => projects?.find(({ id }) => id === selectedProjectId),
    [projects, selectedProjectId]
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
          <option value='negativity'>Negativity</option>
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
        />
      </Column>
      <Column start={[1, 7]} width={[6, 4]} sx={{ mt: [0, 6] }}>
        <Project project={selectedProject} metric={metric} />
      </Column>
    </Row>
  ) : (
    'Loading...'
  )
}

export default Display
