import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { getAllPosts } from '../service/posts'
import { setPosts } from '../reducer/postReducer'
import { notifyError } from "../reducer/errorReducer"
import Error from "./Notifications/Error"

export const ShowStatus = ({ post }) => {
   
  if (!post.startDate && !post.endDate) {
    return null
  }

  if (post.startDate && !post.endDate) {
    return <div className="postCardContent ongoing">Ongoing</div>
  }

  const startDate = new Date(post.startDate)
  const endDate = new Date(post.endDate)
  const today = new Date()

  const daysToStart = (startDate - today) / (1000 * 60 * 60 * 24)
  const daysRemaining = (endDate - today ) / (1000 * 60 * 60 * 24)

  if (daysRemaining < 0) {
    return <div className="postCardContent ended">Ended</div>
  }

  if (daysRemaining > 1 && daysToStart <= 0) {
    return <div className="postCardContent ongoing">Ongoing until {endDate.toDateString()}</div>
  }

  if (daysRemaining < 1 && daysRemaining > 0 && daysToStart > 0) {
    return <div className="postCardContent starts">Starts tomorrow</div>
  }

  if (daysRemaining > 0 && daysToStart < 0) {
    return <div className="postCardContent ongoing">Ends tomorrow</div>
  }

  if (startDate > today) {
    return <div className="postCardContent starts">Starts in {Math.floor(daysToStart)} day/s</div>
  }

}

const ShowAllPosts = () => {

  const posts = useSelector(state => state.posts)
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory) 
  const subCategory = useSelector(state => state.subCategory)
  const dispatch = useDispatch()
  const accessToken = useSelector(state => state.user).accessToken
  
  useEffect(() => {
    if (!accessToken) {
      return
    }
    fetchPosts()
  }, [accessToken, communityId])
    
  const fetchPosts = async () => {
    try {
      const allPosts = await getAllPosts(communityId, mainCategory)
      dispatch(setPosts(allPosts))
    } catch(error) {
      dispatch(notifyError(`Trouble loading posts. ${error.response.data.error}.`))
      }
    }

  const allPostFeed = () => {

    if (mainCategory !== 'home' && subCategory !== 'All') {
      return null
    }

    return (
      <div>
        {posts.map(post => (
          <div key={post.id} className="postCard">
          <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
            <h3>{post.title.slice(0, 60)}</h3>
          </Link>
          {ShowStatus({post})}
          <p className="postCardContent">{post.description.slice(0, 200)}...</p>
          <div className="postCardContent tagContainer">Tags: <div className="tags">{post.mainCategory}</div> <div className="tags">{post.subCategory}</div></div>
          </div>
        ))}
      </div>
    )
  }

  const allSubCategoryPosts = () => {

    if (mainCategory === 'home') {
      return null
    }

    return (
      <div>
        {posts.filter(post => post.mainCategory === mainCategory).filter(post => post.subCategory === subCategory).map(post => (
          <div key={post.id} className="postCard">
          <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
            <h3>{post.title.slice(0, 60)}</h3>
          </Link>
          {ShowStatus({post})}
          <p className="postCardContent">{post.description.slice(0, 200)}...</p>
          <p className="postCardContent">Tags: {post.mainCategory} {post.subCategory}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <Error />
      {allPostFeed()}      
      {allSubCategoryPosts()}
    </div>
  )
}


export default ShowAllPosts

// show first 10 posts and auto load next 10 when reached the 10th?
//{subCategory === 'All' ? allPostFeed(): allSubCategoryPosts()}