import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"

const ShopsPromo = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'shops-promotion') {
    return null
  }

  return (
    <SubCategoryOptions />
  )


}

export default ShopsPromo