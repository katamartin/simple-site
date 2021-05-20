import React from 'react'
import { Box, useThemeUI } from 'theme-ui'

import { useProjects } from '../resources/projects'
import { Select } from '@carbonplan/components'
import Chart from './chart'
import { useMetric } from '../resources/metrics'

const Display = () => {
  const projects = useProjects()
  const [metric, setMetric] = React.useState('permanence')
  const { units } = useMetric(metric)
  const { theme } = useThemeUI()

  return projects ? (
    <>
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
      <Chart metric={metric} />
    </>
  ) : (
    'Loading...'
  )
}

export default Display
