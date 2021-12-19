import type { ApiProject } from '@violet/lib/types/api'

export type Methods = {
  get: {
    resBody: ApiProject
  }
  put: {
    reqFormat: FormData
    reqBody: { name: string; iconName?: string; imageFile?: Blob }
    resBody: ApiProject
  }
}
