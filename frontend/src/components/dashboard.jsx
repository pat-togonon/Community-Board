import { setMainCategory } from "../reducer/mainCategoryReducer"
import { useDispatch, useSelector } from "react-redux"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import HomeFeed from "./HomeFeed"
import LostAndFound from "./LostAndFound"
import Announcement from "./Announcement"
import Events from "./Events"
import GarageSaleGiveaways from "./GarageSaleGiveaway"
import ShopsPromo from "./ShopsPromo"
import { useNavigate, Outlet } from "react-router-dom"


// Just shows the first 10 posts in all categories and subcategories - sorted by date posted

export const mainCategories = [
  {
    name: 'Home',
    category: 'home',
    renderComponent: <HomeFeed />
  },
  { 
    name: 'Announcement',
    category: 'announcement',
    renderComponent: <Announcement />
  }, 
  {
    name: 'Events',
    category: 'upcoming-event',
    renderComponent: <Events />
  }, 
  {
    name: 'Garage Sale & Giveaways',
    category: 'garage-sale-and-giveaways',
    renderComponent: <GarageSaleGiveaways />
  }, 
  { 
    name: 'Shops Promo',
    category: 'shops-promotion',
    renderComponent: <ShopsPromo />
  },
  {
    name: 'Lost and Found',
    category: 'lost-and-found',
    renderComponent: <LostAndFound />
  }
]

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const user = useSelector(state => state.user.accessToken)
  const loggedInUser = useSelector(state => state.user)

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

  const handleCreatePost = (event) => {

    if (mainCategory === 'home') {
      return null
    }
  
    const isUserAnAdmin = loggedInUser.managedCommunity.includes(communityId)
  
    console.log('user an admin?', isUserAnAdmin)    

    if (!isUserAnAdmin && mainCategory === 'announcement') {
      return null
    }
    const handleNewPost = () => {
      const path = `/posts/${communityId}/${mainCategory}/new-post`
      navigate(path)
    }

    return <button onClick={handleNewPost}>Create a new post</button>

  }

  return (
    <div>
      <header>
      Navigate to: 
      <select value={mainCategory} onChange={handleCategory} id='mainCategory' name='mainCategory'>
        {mainCategories.map((mainCategory) => (
          <option key={mainCategory.category} value={mainCategory.category}>
            {mainCategory.name}
          </option>
        ))}
      </select><br />
      {handleCreatePost()}
      </header>
      <main>
        <Outlet />
      </main>
      

    </div>
  )




}

export default Dashboard