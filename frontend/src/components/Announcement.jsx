import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"

const Announcement = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'announcement') {
    return null
  }

  return (
    <SubCategoryOptions />
  )


}

export default Announcement