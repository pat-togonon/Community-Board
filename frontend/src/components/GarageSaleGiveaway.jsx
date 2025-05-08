import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"

const GarageSaleGiveaways = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'garage-sale-and-giveaways') {
    return null
  }

  return (
    <SubCategoryOptions />
  )


}

export default GarageSaleGiveaways