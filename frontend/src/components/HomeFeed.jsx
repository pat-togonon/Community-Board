import { useSelector } from "react-redux"

const HomeFeed = () => {

  const mainCategorySelected = useSelector(state => state.mainCategory)

  if (mainCategorySelected !== 'home') {
    return null
  }

  return (
    <div>
      yay! Home!!
    </div>
  )

}

export default HomeFeed