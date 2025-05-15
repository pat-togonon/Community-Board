import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"
import ShowAllPosts from "./PostFeed"

const ShopsPromo = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'shops-promotion') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />
      <ShowAllPosts />
    </div>
  )


}

export default ShopsPromo