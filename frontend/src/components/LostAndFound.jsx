import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"
import ShowAllPosts from "./PostFeed"


const LostAndFound = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'lost-and-found') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />
      <ShowAllPosts />

    </div>
  )


}

export default LostAndFound