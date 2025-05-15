import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"
import ShowAllPosts from "./PostFeed"

const Announcement = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'announcement') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />
      <ShowAllPosts />
    </div>
  )


}

export default Announcement