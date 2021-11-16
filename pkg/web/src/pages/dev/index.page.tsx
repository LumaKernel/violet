import useAspidaSWR from '@aspida/swr'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { Fetching } from '@violet/web/src/components/organisms/Fetching'
import { useApi } from '@violet/web/src/hooks'
import { staticPath } from '@violet/web/src/utils/$path'
import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 0.5rem;
`

const StyledMain = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const Title = styled.h1`
  font-size: 4rem;
  line-height: 1.15;
  text-align: center;

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
`

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Logo = styled.img`
  height: 1em;
  margin-left: 0.5rem;
`

const Home = () => {
  const { api } = useApi()
  const { data: tasks, error } = useAspidaSWR(api.tasks)

  if (!tasks) return <Fetching error={error} />

  return (
    <Container>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href={staticPath.favicon_png} />
      </Head>

      <StyledMain>
        <Title>デモページトップ</Title>
        <Spacer axis="y" size={16} />
      </StyledMain>

      <StyledFooter>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Logo src={staticPath.vercel_svg} alt="Vercel Logo" />
        </a>
      </StyledFooter>
    </Container>
  )
}

export default Home
