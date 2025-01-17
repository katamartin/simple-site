import React from 'react'
import { Box, useThemeUI } from 'theme-ui'
import { mean, max, range } from 'd3-array'
import { line, curveBasis } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { motion } from 'framer-motion'
import { useMetric } from '../resources/metrics'

const CategoryChart = ({
  color,
  metric,
  name,
  projects,
  selected,
  setSelected,
  hovered,
  setHovered,
}) => {
  const metricData = React.useMemo(
    () =>
      projects
        // Scope down to relevant metric
        .map(({ metrics, ...rest }) => ({
          ...rest,
          metric: metrics.find((m) => m.name === metric),
        }))
        // Only display projects where value for metric is defined
        .filter(({ metric }) => typeof metric.value === 'number'),
    [projects, metric]
  )
  const { domain, bandwidth, x } = useMetric(metric)
  const { theme } = useThemeUI()

  const height = 42
  const offset = 12

  const points = metricData.map((p) => ({
    id: p.id,
    value: Math.min(Math.max(p.metric.value, domain[0]), domain[1]),
  }))

  const thresholds = range(
    Math.log10(domain[0]),
    Math.log10(domain[1]) + 0.1,
    0.1
  )
  let density = kde(
    epanechnikov(bandwidth),
    thresholds,
    points.map(({ value }) => Math.log10(value))
  ).map((d) => [Math.pow(10, d[0]), d[1]])

  const mx = max(density, (d) => d[1])
  density = density.map((d) => [d[0], d[1] / mx])

  const generator = line()
    .curve(curveBasis)
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))

  const y = scaleLinear()
    .domain([0, 0.7])
    .range([height - offset, height - offset - 20])

  const { selectedPoints, unselectedPoints } = points.reduce(
    (accum, point) => {
      if (point.id === selected) {
        accum.selectedPoints.push(point)
      } else {
        accum.unselectedPoints.push(point)
      }

      return accum
    },
    { selectedPoints: [], unselectedPoints: [] }
  )
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: height,
      }}
    >
      <Box
        as='svg'
        sx={{ position: 'absolute', top: '0px' }}
        width='100%'
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio='none'
      >
        <g key={`${name}-path`}>
          <path
            d={generator(density)}
            stroke={theme.colors[color]}
            strokeWidth={2.75}
            fill={'none'}
            vectorEffect='non-scaling-stroke'
          />
        </g>
      </Box>
      <Box
        as='svg'
        sx={{ position: 'absolute', top: 0 }}
        width='100%'
        height={height}
        preserveAspectRatio='none'
      >
        <g key={`${name}-points`}>
          {unselectedPoints.map(({ id, value }) => (
            <motion.circle
              style={{ cursor: 'pointer' }}
              key={`${name}-${id}`}
              r={5.5}
              animate={{ cx: x(value) + '%', cy: height - offset }}
              fill={id === hovered ? theme.colors.muted : theme.colors[color]}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(id)}
            />
          ))}
          {selectedPoints.map(({ id, value }) => (
            <motion.circle
              style={{ cursor: 'pointer' }}
              key={`${name}-${id}`}
              r={5.5}
              animate={{ cx: x(value) + '%', cy: height - offset }}
              fill={theme.colors.primary}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(id)}
            />
          ))}
        </g>
      </Box>
    </Box>
  )
}

function kde(kernel, thresholds, data) {
  return thresholds.map((t) => [t, mean(data, (d) => kernel(t - d))])
}

function epanechnikov(bandwidth) {
  return (x) =>
    Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0
}
export default CategoryChart
