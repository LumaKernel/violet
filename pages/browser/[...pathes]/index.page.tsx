import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { Fetching } from '~/components/organisms/Fetching'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { ProjectBar } from './components/ProjectBar'
import { Revision } from './components/Revision'
import { StreamBar } from './components/StreamBar'
import { TabBar } from './components/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
`
const WorksView = styled.div`
  width: 100%;
`

const MainColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: right;
`

const RevisionContent = styled.div`
  flex: 1;
  height: 100%;
`

const StreamBarColumn = styled.div`
  width: 300px;
  height: 100%;
`

const ProjectPage = () => {
  const { error, projectApiData, projects, currentProject } = usePage()

  if (!projectApiData || !currentProject) return <Fetching error={error} />

  return (
    <Container>
      <ProjectBar projects={projects} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={currentProject} />
      </LeftColumn>
      <WorksView>
        {projectApiData.revisions ? (
          projectApiData.revisions.length ? (
            <MainColumn>
              <TabBar project={currentProject} projectApiData={projectApiData} />
              <MainContent>
                <RevisionContent>
                  <Revision />
                </RevisionContent>
                <Spacer axis="x" size={16} />
                <StreamBarColumn>
                  <StreamBar project={currentProject} projectApiData={projectApiData} />
                </StreamBarColumn>
              </MainContent>
            </MainColumn>
          ) : (
            <EmptyWork project={currentProject} />
          )
        ) : (
          <div>Choose work</div>
        )}
      </WorksView>
    </Container>
  )
}

export default ProjectPage
