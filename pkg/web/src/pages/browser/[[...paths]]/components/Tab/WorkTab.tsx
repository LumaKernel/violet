import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { Cross } from '@violet/web/src/components/atoms/Cross'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { OperationData, Tab, WorksDict } from '@violet/web/src/types/browser'
import { getWorkFullName } from '@violet/web/src/utils'
import { alphaLevel, colors, scrollbarSize, tabHeight } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { ExtIcon } from '../ExtIcon'
import { ActiveStyle } from '../Styles/ActiveStyle'
import { Draggable } from './Dragable'
import { HoverItem } from './TabBar'

const Container = styled.div`
  display: flex;
  height: ${tabHeight};
  overflow-x: scroll;
  overflow-y: hidden;

  ::-webkit-scrollbar {
    height: ${scrollbarSize};
    background-color: ${colors.transparent};
  }

  :hover {
    ::-webkit-scrollbar-thumb {
      height: ${scrollbarSize};
      background: ${colors.gray}${alphaLevel[5]};
      border-radius: 4px;
    }
  }
`

const TabItem = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  height: ${tabHeight};
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
  ${ActiveStyle};
`

const CrossButton = styled.button`
  width: 18px;
  height: 18px;
  cursor: pointer;
  border: none;
  opacity: 0;

  :hover {
    background-color: ${colors.transparent};
    outline: none;
    opacity: 1;
  }
`

type ComponentPoprs = PropsWithChildren<{
  projectId: ProjectId
  operationData: OperationData
  worksDict: WorksDict
  hoverItem: WorkId | 'EmptyArea' | null
  onMove: (dragIndex: number, hoverIndex: number) => void
  setHoverItem: (value: React.SetStateAction<WorkId | 'EmptyArea' | null>) => void
  createUrl: (tab: Tab) => {
    pathname: '/browser/[[...paths]]'
    query: {
      paths: string[] | undefined
    }
    hash: string | undefined
  }
}>

export const WorkTabs = ({
  children,
  projectId,
  operationData,
  worksDict,
  hoverItem,
  onMove,
  setHoverItem,
  createUrl,
}: ComponentPoprs) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()

  const onClickCrossWorkTab = async (event: React.MouseEvent, workId: WorkId) => {
    event.preventDefault()
    const remainTabs = operationData.tabs.filter((t) => t.id !== workId)
    updateOperationData(projectId, { ...operationData, tabs: remainTabs })
    if (operationData.activeTab?.id === workId) {
      await push(createUrl(remainTabs.slice(-1)[0]))
    }
  }

  return (
    <Container>
      {children}
      {operationData.tabs.map(
        (t, index) =>
          t.type === 'work' && (
            <Link key={t.id} href={createUrl(t)} passHref>
              <Draggable onMove={onMove} setHoverItem={setHoverItem} workId={t.id} index={index}>
                <HoverItem move={hoverItem === t.id}>
                  <TabItem active={operationData.activeTab?.id === t.id}>
                    <Spacer axis="x" size={4} />
                    <ExtIcon name={getWorkFullName(worksDict[t.id])} />
                    <span>{getWorkFullName(worksDict[t.id])}</span>
                    <CrossButton onClick={(e) => onClickCrossWorkTab(e, t.id)}>
                      <Cross size={12} />
                    </CrossButton>
                  </TabItem>
                </HoverItem>
              </Draggable>
            </Link>
          )
      )}
    </Container>
  )
}
