import { useRef } from 'react'
import { updatePassword } from '../auth/auth'
import classes from './profile-form.module.css'

function ProfileForm() {
  const oldPasswordRef = useRef()
  const newPasswordRef = useRef()
  const submitHandler = async (e) => {
    const oldPassword = oldPasswordRef.current.value
    const newPassword = newPasswordRef.current.value
    e.preventDefault()
    try {
      const response = await updatePassword(oldPassword, newPassword)
      console.log(response)
    } catch (error) {
      console.error(error.message)
    }
    newPasswordRef.current.value = ''
    oldPassword.current.value = ''
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input ref={oldPasswordRef} type='password' id='old-password' />
      </div>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
