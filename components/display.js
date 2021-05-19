import React from 'react'

import { useProjects } from '../resources/projects'
import { Select } from '@carbonplan/components'
import Chart from './chart'

const colors = {
  dac: 'purple',
  forests: 'green',
  mineralization: 'grey',
  biomass: 'yellow',
  ocean: 'teal',
  soil: 'orange',
}

const Display = () => {
  const projects = useProjects()
  const [metric, setMetric] = React.useState('permanence')

  return projects ? (
    <>
      <Select
        onChange={(e) => setMetric(e.target.value)}
        value={metric}
        size='md'
        sx={{ mt: [-2, 0, 0] }}
      >
        <option value='mechanism'>Mechanism</option>
        <option value='volume'>Volume</option>
        <option value='negativity'>Negativity</option>
        <option value='permanence'>Permanence</option>
        <option value='additionality'>Additionality</option>
        <option value='cost'>Cost</option>
        <option value='specificity'>Specificity</option>
      </Select>
      <Chart metric={metric} />
    </>
  ) : (
    'Loading...'
  )
}

export default Display
