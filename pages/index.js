import { Layout, Row, Column } from '@carbonplan/components'
import Display from '../components/display'
import { ProjectsContextProvider } from '../resources/projects'

const Index = () => {
  return (
    <Layout title={'dynamic category comparison'}>
      <Row sx={{ fontSize: [4, 5, 6, 7], my: [5, 6, 7, 8] }} columns={[6, 12]}>
        <Column start={[1, 2, 2, 2]} width={[6, 10]}>
          <ProjectsContextProvider>
            <Display />
          </ProjectsContextProvider>
        </Column>
      </Row>
    </Layout>
  )
}

export default Index
