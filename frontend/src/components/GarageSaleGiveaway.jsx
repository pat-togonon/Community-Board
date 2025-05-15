import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"
import ShowAllPosts from "./PostFeed"

const GarageSaleGiveaways = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'garage-sale-and-giveaways') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />
      <ShowAllPosts />
    </div>
  )


}

export default GarageSaleGiveaways