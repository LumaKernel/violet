// 401 エラーの場合に SignInModal を表示して成功したらリトライする

import aspida from '@aspida/fetch'
import $api from '@violet/api/api/$api'
import { SignInModal } from '@violet/web/src/components/organisms/SignInModal'
import { useAuth } from '@violet/web/src/hooks/useAuth'
import { createContext, useCallback, useMemo, useState } from 'react'

export const ApiWithSigningContext = createContext({
  api: $api(
    aspida((() => {
      throw new Error('not injected yet')
    }) as any)
  ),
})

export const ApiWithSigningProvider: React.FC = ({ children }) => {
  const [a, setA] = useState<Array<() => void>>([])
  const [failing, setFailing] = useState(false)
  const { initialized, currentUser } = useAuth()
  const customFetch = useCallback(async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    return await fetch(input, init).then((res) => {
      if (res.status === 401) {
        setFailing(true)
        let resolve: (r: Response) => void
        const prom = new Promise<Response>((innerResolve) => {
          resolve = innerResolve
        })
        setA([...a, () => fetch(input, init).then(resolve)])
        return prom
      }
      return res
    })
  }, [setFailing])
  const api = useMemo(
    () =>
      $api(
        aspida(customFetch, {
          credentials: 'include',
        })
      ),
    [customFetch]
  )

  const cancel = useCallback(() => {
    setA([])
    setFailing(false)
  }, [setA, setFailing])

  const onAuthSuccess = useCallback(() => {
    setA([])
    a.forEach((f) => f())
  }, [a, setA])

  const modalOpen = initialized && !currentUser && failing

  return (
    <ApiWithSigningContext.Provider value={{ api }}>
      {children}
      <SignInModal open={modalOpen} onAuthSuccess={onAuthSuccess} onClose={cancel} />
    </ApiWithSigningContext.Provider>
  )
}
