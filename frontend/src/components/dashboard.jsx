import { setMainCategory } from "../reducer/mainCategoryReducer"
import { useDispatch, useSelector } from "react-redux"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import { useNavigate, Outlet} from "react-router-dom"
import SubCategoryOptions from "./SubCategory"
import Confirmation from "./Notifications/Confirmation"
import { mainCategories } from "../helper/helpers"
import { useEffect } from "react"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const user = useSelector(state => state.user.accessToken)
  const loggedInUser = useSelector(state => state.user)
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])
  
  if (!user) {
    return null
  }

  const handleCategory = (event) => {
    dispatch(resetSubCategory())
    const mainCategorySelected = event.target.value
    dispatch(setMainCategory(mainCategorySelected))

    if (mainCategorySelected === 'home') {
      return navigate('/')
    }

    const path = `/posts/${communityId}/${mainCategorySelected}`
    navigate(path)
  }

  const handleCreatePost = () => {

    if (mainCategory === 'home') {
      return null
    }
  
    const isUserAnAdmin = loggedInUser.managedCommunity.map(c => c.id).includes(communityId)

    if (!isUserAnAdmin && mainCategory === 'announcement') {
      return null
    }
    const handleNewPost = () => {
      const path = `/posts/${communityId}/${mainCategory}/new-post`
      navigate(path)
    }

    return <button onClick={handleNewPost} className="newPostButton button" id="new-post-button">Create a new post</button>

  }

  return (
    <div>
      <header>
        <Confirmation />
      <div className="categoryNav">
        <h3>Navigate to: </h3>
        <select value={mainCategory} onChange={handleCategory} id='mainCategory' name='mainCategory'>
          {mainCategories.map((mainCategory) => (
            <option key={mainCategory.category} value={mainCategory.category}>
              {mainCategory.name}
            </option>
          ))}
        </select>
      </div>
      <SubCategoryOptions />
      {handleCreatePost()}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard