import { defineController } from './$relay'

// WARNING: これはデモです。このような実装はしないでください
const comments: Array<{ comment: string; picture?: string | undefined | null }> = [
  {
    picture: 'https://raw.githubusercontent.com/icons8/flat-color-icons/master/svg/assistant.svg',
    comment: 'first comment',
  },
]

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: comments,
  }),
  post: async ({ body, ensureUserClaims }) => {
    const user = await ensureUserClaims()
    comments.push({
      picture: user.picture,
      comment: body,
    })
    return {
      status: 201,
    }
  },
}))
