import { scaleLog, scaleLinear } from 'd3-scale'

const metrics = {
  permanence: {
    domain: [1, 1000],
    ticks: [1, 10, 100, 1000],
    log: true,
    bandwidth: 0.1,
    units: 'years',
  },
  volume: {
    domain: [10, 1000000],
    ticks: [10, 100, 1000, 10000, 100000, 1000000],
    log: true,
    bandwidth: 0.2,
    units: 'tCO₂',
  },
  cost: {
    domain: [1, 2000],
    ticks: [1, 20, 200, 2000],
    log: true,
    bandwidth: 0.1,
    units: '$/tCO₂',
  },
  negativity: {
    domain: [0, 1],
    ticks: [0, 0.2, 0.4, 0.6, 0.8, 1],
    log: false,
    // TODO: understand bandwidth, pick better value
    bandwidth: 0.000001,
  },
}

export const useMetric = (metric) => {
  if (!metrics[metric]) {
    throw `unexpected metric: ${metric}`
  }

  const { domain, bandwidth, log, ticks, units } = metrics[metric]
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

  return { domain, bandwidth, log, ticks, units, x, xTicks }
}
