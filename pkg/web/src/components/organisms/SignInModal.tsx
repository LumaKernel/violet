import { useApi, useAuth } from '@violet/web/src/hooks'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { CardModal } from 'src/components/organisms/CardModal'
import { firebase } from 'src/utils/firebase'
import styled from 'styled-components'

const Message = styled.div`
  font-size: ${fontSizes.large};
`

const Note = styled.div`
  font-size: ${fontSizes.medium};
  color: ${colors.red};
`

const Right = styled.div`
  display: flex;
  justify-content: end;
`

const AlreadyLoggedIn = () => <Note>すでにログインしています</Note>
const LoadingIcon = () => <span>loading...</span>

interface Props {
  open?: boolean
  onClose?: () => void
  onAuthSuccess?: () => void
}

export const SignInModal: React.FC<Props> = ({ open, onClose, onAuthSuccess }: Props) => {
  const { api } = useApi()
  const { currentUser, refresh: refreshAuth, initialized } = useAuth()
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      // 表示・非表示を設定するのみ。実際にその方法が成功するかは GCIP 側で設定する
      ...(process.env.NEXT_PUBLIC_SHOW_EMAIL_AUTH === '1'
        ? [firebase.auth.EmailAuthProvider.PROVIDER_ID]
        : []),
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        const { currentUser } = firebase.auth()
        if (!currentUser) throw new Error('Failed to get current user.')
        currentUser.getIdToken().then(async (idToken) => {
          try {
            onAuthSuccess?.()
          } finally {
            await firebase.auth().signOut()
            await api.auth.session.$post({
              body: {
                idToken,
              },
            })
            await refreshAuth()
          }
        })
        return false
      },
    },
  }

  const Main = () =>
    currentUser ? (
      <AlreadyLoggedIn />
    ) : (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    )

  return (
    <CardModal open={open} onClose={onClose}>
      <Message>ログイン</Message>
      {initialized ? <Main /> : <LoadingIcon />}
      <Right>
        <button onClick={onClose}>閉じる</button>
      </Right>
    </CardModal>
  )
}
