import { Layout, Row, Column } from '@carbonplan/components'
import Display from '../components/display'
import { ProjectsContextProvider } from '../resources/projects'

const Index = () => {
  return (
    <Layout>
      <Row sx={{ fontSize: [4, 5, 6, 7], my: [5, 6, 7, 8] }}>
        <Column start={[1, 2, 2, 2]} width={[6]}>
          <ProjectsContextProvider>
            <Display />
          </ProjectsContextProvider>
        </Column>
      </Row>
    </Layout>
  )
}

export default Index
