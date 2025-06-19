import { useSelector } from "react-redux"
import ShowAllPosts from "./PostFeed"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"


const HomeFeed = () => {
  const mainCategorySelected = useSelector(state => state.mainCategory)

  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
      if (!isLoggedIn) {
        navigate('/')
      }  
    }, [isLoggedIn])

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