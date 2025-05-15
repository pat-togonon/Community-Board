import { clearMainCategory } from "../reducer/mainCategoryReducer";
import { logoutUser } from "../service/auth"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../reducer/userReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { useNavigate } from "react-router";


const LogOut = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.accessToken)
  const navigate = useNavigate()
  
  if (!user) {
    return null
  }

  const handleLogout = async (event) => {   
    await logoutUser()
    dispatch(logout())
    dispatch(clearCommunityId())
    dispatch(clearMainCategory())
    navigate('/')
  }

  return (
    <button onClick={handleLogout}>logout</button>
  )
}

export default LogOut