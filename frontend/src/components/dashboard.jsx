import { setMainCategory } from "../reducer/mainCategoryReducer"
import { useDispatch, useSelector } from "react-redux"

// Just shows the first 10 posts in all categories and subcategories - sorted by date posted
const Dashboard = () => {
  const dispatch = useDispatch()
  
  const mainCategory = useSelector(state => state.mainCategory)

  const mainCategories = [
    {
      name: 'Home',
      enum: 'home'
    },
    { 
      name: 'Announcement',
      enum: 'announcement'
    }, 
    {
      name: 'Events',
      enum: 'upcoming_event'
    }, 
    {
      name: 'Garage Sale & Giveaways',
      enum: 'garage_sale_and_giveaways'
    }, 
    { 
      name: 'Shops Promo',
      enum: 'shops_promotion' 
    },
    {
      name: 'Lost and Found',
      enum: 'lost_and_found'
    }
  ]

  const handleCategory = (event) => {
    const mainCategorySelected = event.target.value
    dispatch(setMainCategory(mainCategorySelected))
  }

  const cat = useSelector(state => state.mainCategory)
  console.log('category is', cat)

  return (
    <div>
      Navigate to: 
      <select value={mainCategory} onChange={handleCategory} id='mainCategory' name='mainCategory'>
        {mainCategories.map((mainCategory) => (
          <option key={mainCategory.enum} value={mainCategory.enum}>
            {mainCategory.name}
          </option>
        ))}
      </select>
    </div>
  )




}

export default Dashboard