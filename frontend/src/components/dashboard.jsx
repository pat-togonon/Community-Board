import { setMainCategory } from "../reducer/mainCategoryReducer"
import { useDispatch, useSelector } from "react-redux"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import HomeFeed from "./HomeFeed"
import LostAndFound from "./LostAndFound"
import Announcement from "./Announcement"
import Events from "./Events"
import GarageSaleGiveaways from "./GarageSaleGiveaway"
import ShopsPromo from "./ShopsPromo"
import PostForm from "./PostForm"

// Just shows the first 10 posts in all categories and subcategories - sorted by date posted
const Dashboard = () => {
  const dispatch = useDispatch()
  
  const mainCategory = useSelector(state => state.mainCategory)
  const user = useSelector(state => state.user.accessToken)

  if (!user) {
    return null
  }

  const mainCategories = [
    {
      name: 'Home',
      category: 'home'
    },
    { 
      name: 'Announcement',
      category: 'announcement'
    }, 
    {
      name: 'Events',
      category: 'upcoming-event'
    }, 
    {
      name: 'Garage Sale & Giveaways',
      category: 'garage-sale-and-giveaways'
    }, 
    { 
      name: 'Shops Promo',
      category: 'shops-promotion' 
    },
    {
      name: 'Lost and Found',
      category: 'lost-and-found'
    }
  ]

  const handleCategory = (event) => {
    dispatch(resetSubCategory())
    const mainCategorySelected = event.target.value
    dispatch(setMainCategory(mainCategorySelected))
  }

  return (
    <div>
      Navigate to: 
      <select value={mainCategory} onChange={handleCategory} id='mainCategory' name='mainCategory'>
        {mainCategories.map((mainCategory) => (
          <option key={mainCategory.category} value={mainCategory.category}>
            {mainCategory.name}
          </option>
        ))}
      </select>
      <PostForm />
      <HomeFeed />
      <Announcement />
      <LostAndFound />
      <Events />
      <GarageSaleGiveaways />
      <ShopsPromo />
    </div>
  )




}

export default Dashboard