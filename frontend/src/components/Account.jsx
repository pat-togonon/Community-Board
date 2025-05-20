import { clearMainCategory } from "../reducer/mainCategoryReducer";
import { logoutUser } from "../service/auth"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../reducer/userReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { useNavigate } from "react-router";
import { useState } from "react";
import { resetSubCategory } from "../reducer/subCategoryReducer";
import { clearComments } from "../reducer/commentsReducer";
import { clearFavoritePosts } from "../reducer/favoriteReducer";
import { clearPosts } from "../reducer/postReducer";


const Account = () => {
  const [showAccount, setShowAccount] = useState(true)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.accessToken)
  const navigate = useNavigate()
  
  if (!user) {
    return null
  }

  const handleLogout = async (event) => {   
    setShowAccount(!showAccount)
    await logoutUser()
    // clear the redux store
    dispatch(logout())
    dispatch(clearCommunityId())
    dispatch(clearMainCategory())
    dispatch(resetSubCategory())
    dispatch(clearComments())
    dispatch(clearFavoritePosts())
    dispatch(clearPosts())
    navigate('/')
    setShowAccount(!showAccount)
  }

  const accountStyle = {
    display: showAccount ? '' : 'none'
  }

  const selectionStyle = {
    display: showAccount ? '' : 'none'
  }

  const handleProfile = () => {
    setShowAccount(!showAccount)
    navigate('/user/profile')
    
  }

  const handleClose = () => {
    setShowAccount(!showAccount)
    
  }
  return (
    <div style={accountStyle}>
      <div style={selectionStyle}>
      <ul>
          <li><div role="button" onClick={handleProfile}>Profile</div></li>
          <li><div role="button" onClick={() => setShowAccount(!showAccount)}>Account Settings</div></li>
          <li><div onClick={handleLogout} role="button">Logout</div></li>
          <li><div role="button" onClick={() => setShowAccount(!showAccount)}>Theme: Dark Mode Light Mode</div></li>
        </ul>
      </div>
      <div onClick={handleClose} role="button">Close</div>
    </div>
    
  )
}

export default Account
