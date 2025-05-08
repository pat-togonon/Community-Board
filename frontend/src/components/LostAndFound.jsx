import { useSelector } from "react-redux"
import SubCategoryOptions from "./SubCategory"


const LostAndFound = () => {
  const mainCategory = useSelector(state => state.mainCategory)

  if (mainCategory !== 'lost-and-found') {
    return null
  }

  return (
    <div>
      <SubCategoryOptions />

    </div>
  )


}

export default LostAndFound