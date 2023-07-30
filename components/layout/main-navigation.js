import Link from 'next/link'
import classes from './main-navigation.module.css'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function MainNavigation() {
  const { data, status } = useSession()
  const router = useRouter()

  async function logoutHandler() {
    await signOut({ redirect: false })
    router.replace('/auth')
  }

  return (
    <header className={classes.header}>
      <Link href='/'>
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {!data && status && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}

          {data && (
            <li>
              <Link href='/profile'>Profile</Link>
            </li>
          )}
          {data && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
