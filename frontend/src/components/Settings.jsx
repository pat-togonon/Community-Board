import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { deleteAccount, updateSavedName } from "../service/user"
import { logout, setName } from "../reducer/userReducer"
import { clearMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { clearPosts } from "../reducer/postReducer"
import { clearFavoritePosts } from "../reducer/favoriteReducer"
import { clearComments } from "../reducer/commentsReducer"
import { useNavigate } from "react-router-dom"
import { updatePassword } from "../service/auth"
import Error from './Notifications/Error'
import Confirmation from './Notifications/Confirmation'
import { notifyConfirmation } from "../reducer/confirmationReducer"
import { notifyError } from "../reducer/errorReducer"

const Settings = () => {

  const [userName, setUserName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [hideName, setHideName] = useState(false)
  const [deleteUsername, setDeleteUsername] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name)
    }
  }, [user])

  const reset = ()  => {
    dispatch(logout())
    localStorage.removeItem('isLoggedIn')
    dispatch(clearMainCategory)
    dispatch(resetSubCategory())
    dispatch(clearCommunityId())
    dispatch(clearPosts())
    dispatch(clearFavoritePosts())
    dispatch(clearComments())
    }

  const updateName = () => {
    // use edit icon beside the info which user can click to edit

    const nameStyle = {
      display: hideName ? 'none' : ''
    }

    const userNameStyle = {
      display: showForm ? '' : 'none'
    }

    const handleUpdateName = async () => {
      if (user.name) {
        setHideName(!hideName)
        setShowForm(!showForm)
      }

      const name = userName
      console.log('userName', userName)

      try {
        const savedName = await updateSavedName(user.id, name)
        dispatch(setName(savedName))
        dispatch(notifyConfirmation('Updated your name successfully!', 3))
      } catch (error) {
        console.log('error saving name', error)
        dispatch(notifyError("Oops! Can't update your name right now. Please try again later.", 7))
      }
    }

    const handleForm = () => {
      setHideName(!hideName)
      setShowForm(!showForm)

    }
    
    if (user.name) {
      return (
        <div>
          <div style={nameStyle}>
            <p>Name: {user.name} <button onClick={handleForm}>🖋️</button></p> 
          </div>
          <div style={userNameStyle}>
            Name: <input value={userName} autoComplete="name" type="text" onChange={({ target }) => setUserName(target.value)} /><br />
            <button onClick={handleUpdateName}>save</button>
            <button onClick={handleForm}>cancel</button>
          </div>
          
        </div>
      )
    }

    return (
      <div>
        Add your name: <input value={userName} autoComplete="name" type="text" onChange={({ target }) => setUserName(target.value)} />
        <button onClick={handleUpdateName}>Save</button>
      </div>
    )
  }

  const handleDeleteAccount = async () => {

    console.log('username', user.username, 'user input', deleteUsername)

    if (user.username !== deleteUsername) {
      dispatch(notifyError('Wrong username. Please try again.', 5)) // add a notification for this
      setDeleteUsername('')
      return
    }

    try {
      await deleteAccount(user.id)
      reset()
      navigate('/')

    } catch (error) {
      dispatch(notifyError(`Oops! Can't delete your account right now: ${error.response.data.error}.`, 7))
      
    }    
    setDeleteUsername('')
  }

  const deleteStyle = {
    display: showDelete ? 'none' : ''
  }

  const deleteFormStyle = {
    display: showDelete ? '' : 'none'
  }

  const passwordUpdateStyle = {
    display: showPasswordForm ? 'none' : ''
  }

  const passwordFormStyle = {
    display: showPasswordForm ? '' : 'none'
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()

    if (!oldPassword || !newPassword) {
      dispatch(notifyError('Please enter your passwords.', 5))
      return
    }

    const passwords = {
      oldPassword,
      newPassword
    }

    try {
      await updatePassword(user.id, passwords)
      reset()
      setShowPasswordForm(!showPasswordForm)
      navigate('/login')

    } catch (error) {
      dispatch(notifyError(`Oops! Can't update your password right now. ${error.response.data.error}.`, 6))

    
    }

    setOldPassword('')
    setNewPassword('')
  
  }

  return (
    <div>
      <h2>Your information</h2>
      <Error />
      <Confirmation />
      {updateName()}
      <p>Username: {user.username}</p>
      <div style={passwordUpdateStyle}>Update password <button onClick={() => setShowPasswordForm(!showPasswordForm)}>🖋️</button></div>
      <div style={passwordFormStyle}>
        <form onSubmit={handleUpdatePassword}>
          <h3>Enter your old password and new password to proceed: </h3>
          <p>Take note: You'll be logged out right after updating your password. Please log in again.</p>
          Enter your old password: <input value={oldPassword} type="password" name="oldPassword" autoComplete="current-password" onChange={({ target }) => setOldPassword(target.value)} /><br />
          Enter your new password: <input value={newPassword} type="password" autoComplete="newPassword" name="new-password" onChange={({ target }) => setNewPassword(target.value)} /><br />
          <button type="submit">update password</button>
        </form>
        <button onClick={() => setShowPasswordForm(!showPasswordForm)}>cancel</button>
      </div><br />
      <div style={deleteStyle} onClick={() => setShowDelete(!showDelete)}>Delete account</div>
      <div>
        <div style={deleteFormStyle}>
          <h3>Type in your username to confirm and delete your account:</h3>
          <p>Take note: You'll be logged out automatically upon deleting your account.</p>
          <input type="text" value={deleteUsername} autoComplete="username" onChange={({ target }) => setDeleteUsername(target.value)} />
          <button onClick={handleDeleteAccount}>Delete account</button>
          <button onClick={() => setShowDelete(!showDelete)}>Cancel</button>

        </div>
      </div>
    </div>
  )
}

export default Settings