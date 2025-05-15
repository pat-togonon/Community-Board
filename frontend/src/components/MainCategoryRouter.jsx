import { useParams } from "react-router-dom"
import { mainCategories } from "./dashboard"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { setSubCategory } from "../reducer/subCategoryReducer"

const MainCategoryRouter = () => {

  const { community, mainCategory, subCategory } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (community) {
      dispatch(setCommunityId(community))
    }
    if (mainCategory) {
      dispatch(setMainCategory(mainCategory))
    }
    if (subCategory) {
      dispatch(setSubCategory(subCategory))
    }
  }, [community, mainCategory, subCategory])
  
  const componentToRender = mainCategories.find(mainCat => mainCat.category === mainCategory).renderComponent

  return componentToRender  

}

export default MainCategoryRouter