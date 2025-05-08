import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"

const Events = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'upcoming-event') {
    return null
  }

  return (
    <SubCategoryOptions />
  )


}

export default Events