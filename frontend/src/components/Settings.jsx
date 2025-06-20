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
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])
  
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name)
    }
  }, [user])

  const reset = ()  => {
    dispatch(logout())
    dispatch(clearMainCategory)
    dispatch(resetSubCategory())
    dispatch(clearCommunityId())
    dispatch(clearPosts())
    dispatch(clearFavoritePosts())
    dispatch(clearComments())
    }

  const updateName = () => {

    if(!user.id) {
      return null
    }

    const nameStyle = {
      display: hideName ? 'none' : ''
    }

    const userNameStyle = {
      display: showForm ? '' : 'none'
    }

    const handleUpdateName = async () => {

      if (!userName) {
        dispatch(notifyError("Please enter your name.", 3))
        return
      }
      
      if (user.name) {
        setHideName(!hideName)
        setShowForm(!showForm)
      }

      const name = userName
    
      try {
        const savedName = await updateSavedName(user.id, name)
        dispatch(setName(savedName))
        dispatch(notifyConfirmation('Updated your name successfully!', 3))
        setUserName('')
      } catch (error) {
        dispatch(notifyError(`Oops! Can't update your name right now. ${error.response.data.error}`, 7))
      }
    
  }

    const handleForm = () => {
      setHideName(!hideName)
      setShowForm(!showForm)
      setUserName(user.name)
    }
    
    if (user.name) {
      return (
        <div>
          <div style={nameStyle} className="fieldEdit">
            <p><span className="settingsFieldLabel">Name:</span> {user.name} <button onClick={handleForm} id="update-name-button">🖋️</button></p> 
          </div>
          <div style={userNameStyle} className="settingsUpdateName">
          <span className="settingsFieldLabel">Name: </span><input name="name" value={userName} autoComplete="name" type="text" onChange={({ target }) => setUserName(target.value)} id="update-name-field"/>
          <div className="settingsNameSaveCancelButtonDiv">
            <button type="button" onClick={handleUpdateName} className="saveButton saveName" id="update-name-save-button">save</button>
            <button type="button" onClick={handleForm}>cancel</button>
          </div>
          </div>
          
        </div>
      )
    }

    return (
      <div>
        <span className="settingsFieldLabel">Add your name: </span><input value={userName} autoComplete="name" type="text" onChange={({ target }) => setUserName(target.value)} name="name" id="add-name-field"/>
        <div className="settingsSaveNameButtonDiv">
          <button type="button" onClick={handleUpdateName} className="saveButton saveName" id="add-name-save-button">Save</button>
        </div>
      </div>
    )
  }

  const handleDeleteAccount = async (event) => {
    event.preventDefault()

    if (user.username !== deleteUsername) {
      dispatch(notifyError('Please enter your correct username.', 3))
      setDeleteUsername('')
      return
    }

    try {
      await deleteAccount(user.id)
      reset()
      navigate('/')
      localStorage.removeItem('isLoggedIn')
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
      dispatch(notifyError('Please enter your passwords.', 2))
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
     // navigate('/login')
      localStorage.removeItem('isLoggedIn')
    } catch (error) {
      dispatch(notifyError(`Oops! Can't update your password right now. ${error.response.data.error}.`, 6))    
    }

    setOldPassword('')
    setNewPassword('')
  
  }

  const handleCancelPasswordUpdate = () => {
    setShowPasswordForm(!showPasswordForm)
    setOldPassword('')
    setNewPassword('')
  }

  return (
    <div className="settings">
      <h2>Your information</h2>
      <Error />
      <Confirmation />
      {updateName()}
      <p><span className="settingsFieldLabel">Username: </span>{user.username}</p>
      <div style={passwordUpdateStyle}>
      <span onClick={() => setShowPasswordForm(!showPasswordForm)}className="settingsFieldLabel updatePassword" id="update-password">Update password</span>
      </div>
      <div style={passwordFormStyle} className="settingsUpdatePasswordDiv">
        <form onSubmit={handleUpdatePassword}>
          <h3>Enter your old password and new password to proceed: </h3>
          <p>Take note: You'll be logged out right after updating your password. Please log in again.</p>
          <input type="text" name="username" autoComplete="username" hidden />
          <span className="settingsEnterNewPassword">Enter your old password: <input value={oldPassword} type="password" name="oldPassword" autoComplete="current-password" onChange={({ target }) => setOldPassword(target.value)} id="update-password-old"/>
          </span>
          <span className="settingsEnterNewPassword">Enter your new password: <input value={newPassword} type="password" autoComplete="newPassword" name="new-password" onChange={({ target }) => setNewPassword(target.value)} id="update-password-new"/>
          </span>
          <button type="submit" className="updateButton" id="update-password-save-button">update password</button>
          <button type="button" onClick={handleCancelPasswordUpdate}>cancel</button>
        </form>
      </div>
      <div style={deleteStyle} onClick={() => setShowDelete(!showDelete)} className="settingsFieldLabel deleteAccount"><span id="delete-account">Delete account</span></div>
      <div>
        <div style={deleteFormStyle} className="settingsUpdatePasswordDiv">
          <h3>Type in your username to confirm and delete your account:</h3>
          <p>Take note: You'll be logged out automatically upon deleting your account.</p>
          <input type="text" name="username" value={deleteUsername} autoComplete="username" onChange={({ target }) => setDeleteUsername(target.value)} className="deleteInputUsername" id="username-for-account-deletion"/>
          <div className="settingsDeleteDiv">
            <button type="submit" onClick={handleDeleteAccount} className="updateButton" id="delete-account-submit-button">Delete account</button>
            <button type="button" onClick={() => setShowDelete(!showDelete)}>cancel</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Settings