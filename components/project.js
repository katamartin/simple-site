import { Box, useThemeUI } from 'theme-ui'
import { FadeIn, Tag } from '@carbonplan/components'
import { Flex } from 'theme-ui'

// todo: consolidate with categories in chart.js
const COLOR_MAPPING = {
  forests: 'green',
  soil: 'orange',
  biomass: 'yellow',
  ocean: 'teal',
  mineralization: 'grey',
  dac: 'purple',
}

const Project = ({ project, metric }) => {
  const { theme } = useThemeUI()
  if (!project) return null

  const selectedMetric = project.metrics.find(({ name }) => name === metric)

  return (
    <FadeIn>
      <Box
        sx={{
          borderStyle: 'solid',
          borderColor: 'muted',
          borderWidth: '1px',
          display: 'block',
          fontFamily: 'body',
          fontSize: theme.fontSizes[2],
          letterSpacing: 'body',
          color: 'primary',
          textTransform: 'none',
          ml: [4],
          p: [4],
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column'],
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '150px',
          }}
        >
          <Flex
            sx={{
              flexDirection: ['row'],
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Flex
              sx={{
                flexDirection: ['column'],
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box sx={{ fontSize: theme.fontSizes[4] }}>
                {project.applicant}
              </Box>
              {project.location && <Box>{project.location}</Box>}
            </Flex>

            <Box>
              <Tag
                id='tag'
                variant='primary'
                sx={{
                  transition: 'color 0.15s, border 0.15s',
                  color: COLOR_MAPPING[project.tags[0]],
                }}
              >
                {project.id}
              </Tag>
            </Box>
          </Flex>
          <Box>
            {selectedMetric.value} {selectedMetric.units}
          </Box>
          <Box>{project.description}</Box>
          {project.methods && <Box>{project.methods}</Box>}
        </Flex>
      </Box>
    </FadeIn>
  )
}

export default Project
