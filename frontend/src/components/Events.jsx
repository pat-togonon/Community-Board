import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"
import ShowAllPosts from "./PostFeed"

const Events = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'upcoming-event') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />
      <ShowAllPosts />
    </div>
  )


}

export default Events