import ShowAllPosts from "./PostFeed"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { setSubCategory } from "../reducer/subCategoryReducer"

const Posts = () => {

  const { community, mainCategory, subCategory } = useParams()
  const dispatch = useDispatch()
  const user =  useSelector(state => state.user)

  useEffect(() => {
    if (user) {
    if (community) {
      dispatch(setCommunityId(community))
    }
    if (mainCategory) {
      dispatch(setMainCategory(mainCategory))
    }
    if (subCategory) {
      dispatch(setSubCategory(subCategory))
    }
  }
  }, [user, community, mainCategory, subCategory])


return (
    <div>
      <ShowAllPosts />

    </div>
    )
}

export default Posts