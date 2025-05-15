import { useSelector, useDispatch } from "react-redux"
import { setSubCategory } from '../reducer/subCategoryReducer'
import { useNavigate } from "react-router"

export const validSubcategories = {
    'upcoming-event': [
        {
          name: 'Festivals and Celebrations',
          subCat: 'festivals-and-celebrations'
        },
        {
          name: 'Arts and Entertainment',
          subCat:  'arts-and-entertainment'
        }, 
        {
          name: 'Community and Social Events',
          subCat: 'community-and-social-events', 
        },
        {
          name: 'Sports and Outdoor Activities',
          subCat: 'sports-and-outdoor-activities', 
        },
        {
          name: 'Educational and Workshops',
          subCat: 'educational-and-workshops'
        },
        {
          name: 'Others',
          subCat: 'others'
        }],
    'announcement': [
      {
        name: 'Public Services and Utilities',
        subCat: 'public-services-and-utilities'
      }, 
      {
        name: 'Safety and Security',
        subCat: 'safety-and-security'
      },
      {
        name: 'Government and Civic Affairs',
        subCat: 'government-and-civic-affairs'
      },
      {
        name: 'Health and Social Services',
        subCat: 'health-and-social-services'
      },
      {
        name: 'Arts, Culture and Recreation',
        subCat: 'arts-culture-and-recreation'
      },
      {
        name: 'Business and Economy',
        subCat: 'business-and-economy'
      }, 
      {
        name: 'Others',
        subCat: 'others'
      }],
    'lost-and-found': [
      {
        name: 'Lost',
        subCat: 'lost'
      },
      {
        name: 'Found',
        subCat: 'found'
      }],
    'shops-promotion': [
      {
        name: 'Food',
        subCat: 'food'
      },
      {
        name: 'Clothing',
        subCat: 'clothing'
      },
      {
        name: 'Home Goods',
        subCat: 'home-goods'
      },
      {
        name: 'Services',
        subCat: 'services'
      },
      {
        name: 'Others',
        subCat: 'others'
      }],
    'garage-sale-and-giveaways': [
      {
        name: 'Sale',
        subCat: 'sale'
      },
      {
        name: 'Giveaways',
        subCat: 'giveaway' 
      }]
  }

  const SubCategoryOptions = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const communityId = useSelector(state => state.communityId)
    const mainCategory = useSelector(state => state.mainCategory)
    const subCategory = useSelector(state => state.subCategory)

    const subCategoryOptions = validSubcategories[mainCategory]

    console.log(subCategoryOptions) 

    const handleSubCategory = (event) => {
      const subCategorySelected = event.target.value
      dispatch(setSubCategory(subCategorySelected))
      
      if (subCategorySelected === 'All') {
        const path = `/posts/${communityId}/${mainCategory}`
        return navigate(path)
      }

      const path = `/posts/${communityId}/${mainCategory}/${subCategorySelected}`
      return navigate(path)
      
    }

    
    
    return (
      <div>
        Sub Category:
        <select value={subCategory} onChange={handleSubCategory} id="subCategory" name="subCategory">
          <option key='All' value='All'>All</option>
          {subCategoryOptions.map(subCategory => (
            <option key={subCategory.subCat} value={subCategory.subCat}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </div>
    )


  }

  export default SubCategoryOptions