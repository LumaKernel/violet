import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { useRouter } from 'next/dist/client/router'
import type { ChangeEvent, Dispatch, FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  text-align: left;
`

interface Props {
  onConfirmName?: () => void
  projectId: ProjectId
  setNewProjectName: Dispatch<string>
}

export const ProjectNameUpdate: React.FC<Props> = ({
  onConfirmName,
  projectId,
  setNewProjectName,
}: Props) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
      setNewProjectName(e.target.value)
    },
    [setNewProjectName]
  )
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApiContext()
  const { projects, updateProject } = useBrowserContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const { asPath, replace } = useRouter()
  const currentProjectName = asPath.split('/')[2]
  const iconName =
    projects
      .find((d) => d.id === projectId)
      ?.iconUrl?.split('/')
      .slice(-1)[0] ?? null
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsUpdating(true)
    const projectUrl = asPath.replace(currentProjectName, label)
    const projectRes = await api.browser.projects
      ._projectId(projectId)
      .$put({ body: { name: label, iconName } })
      .catch(onErr)
    setIsUpdating(false)
    onConfirmName?.()
    if (projectRes) {
      updateProject(projectRes)
      await replace(projectUrl)
    }
  }

  return (
    <InputFormProject onSubmit={updateName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isUpdating && <Loading />}
    </InputFormProject>
  )
}
