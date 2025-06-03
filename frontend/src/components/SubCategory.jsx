import { useSelector, useDispatch } from "react-redux"
import { setSubCategory } from '../reducer/subCategoryReducer'
import { useNavigate } from "react-router"
import { validSubcategories } from "../helper/helpers"

const SubCategoryOptions = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const subCategory = useSelector(state => state.subCategory)

  const subCategoryOptions = validSubcategories[mainCategory]

  if (mainCategory === 'home') {
    return null
  }
    
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
    <div className="categoryNav">
      <h3>Filter posts:</h3>
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