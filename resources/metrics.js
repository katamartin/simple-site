import { scaleLog } from 'd3-scale'

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

export const useMetric = (metric) => {
  if (!metrics[metric]) {
    throw `unexpected metric: ${metric}`
  }

  const { domain, bandwidth, log, ticks } = metrics[metric]
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

  return { domain, bandwidth, log, ticks, x, xTicks }
}
