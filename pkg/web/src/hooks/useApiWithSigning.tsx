import { ApiWithSigningContext } from '@violet/web/src/contexts/ApiWithSigning'
import { useContext } from 'react'

export const useApiWithSigning = () => ({
  api: useContext(ApiWithSigningContext).api,
  onErr: () => undefined,
})
