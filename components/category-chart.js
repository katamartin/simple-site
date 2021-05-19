import React from 'react'
import { Box } from 'theme-ui'
import { mean, max, range, subset } from 'd3-array'
import { line, curveBasis } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'

const metrics = {
  permanence: {
    domain: [1, 1000],
    ticks: [1, 10, 100, 1000],
    log: true,
    bandwidth: 0.1,
  },
  volume: {
    domain: [10, 1000000],
    ticks: [10, 100, 1000, 10000, 100000, 1000000],
    log: true,
    bandwidth: 0.2,
  },
}

const CategoryChart = ({ color, metric, name, projects }) => {
  const { domain, bandwidth, log } = metrics[metric]
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

  const totalProjects = metricData.length
  const averageRating =
    metricData.reduce((sum, project) => sum + project.metric.rating, 0) /
    totalProjects
  const averageValue =
    metricData.reduce((sum, project) => sum + project.metric.value, 0) /
    totalProjects

  // return (
  //   <Box sx={{ color }}>
  //     Average rating: {averageRating} Average value: {averageValue}{' '}
  //     {metricData[0].metric.units}
  //   </Box>
  // )
  const height = 42
  const offset = 12

  const points = metricData.map((p) => ({
    id: p.id,
    value: Math.min(Math.max(p.metric.value, domain[0]), domain[1]),
  }))

  const margin = 1.65
  const width = 100
  let x, xTicks
  if (log) {
    x = scaleLog()
      .domain(domain)
      .range([margin, width - margin - margin])
      .clamp(true)
    xTicks = scaleLog()
      .domain(domain)
      .range([
        (margin / width) * 100,
        ((width - margin) / width) * 100 - margin,
      ])
      .clamp(true)
  } else {
    x = scaleLinear()
      .domain(domain)
      .range([margin, width - margin - 1])
      .clamp(true)
    xTicks = scaleLinear()
      .domain(domain)
      .range([
        (margin / width) * 100,
        ((width - margin) / width) * 100 - margin,
      ])
      .clamp(true)
  }

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
            stroke={color}
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
          {points.map(({ id, value }) => (
            <circle
              key={id}
              r={5.5}
              cx={x(value) + '%'}
              cy={height - offset}
              fill={color}
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
