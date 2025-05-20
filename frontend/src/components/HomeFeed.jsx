import { useSelector } from "react-redux"
import ShowAllPosts from "./PostFeed"

const HomeFeed = () => {
  const mainCategorySelected = useSelector(state => state.mainCategory)

  if (mainCategorySelected !== 'home') {
    return null
  }

  return (
    <div>
      <ShowAllPosts />
    </div>
  )

}

export default HomeFeed