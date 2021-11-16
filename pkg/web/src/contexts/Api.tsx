import aspida from '@aspida/fetch'
import $api from '@violet/api/api/$api'
import { createContext, useMemo } from 'react'

export const ApiContext = createContext({
  api: $api(
    aspida((() => {
      throw new Error('not injected yet')
    }) as any)
  ),
})

export const ApiProvider: React.FC = ({ children }) => {
  const api = useMemo(
    () =>
      $api(
        aspida(fetch, {
          credentials: 'include',
        })
      ),
    []
  )

  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>
}
