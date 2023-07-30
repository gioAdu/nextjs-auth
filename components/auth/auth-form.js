import { useRef, useState } from 'react'
import classes from './auth-form.module.css'
import { createUser } from './auth'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const emailRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState)
  }

  async function submitHandler(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const email = emailRef.current.value
      const password = passwordRef.current.value

      if (isLogin) {
        await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
      } else {
        await createUser(email, password)
      }
      router.replace('/')
    } catch (err) {
      console.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          <button disabled={isLoading}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
