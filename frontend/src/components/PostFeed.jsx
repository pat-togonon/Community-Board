import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { getAllPosts } from '../service/posts'
import { setPosts } from '../reducer/postReducer'

const ShowAllPosts = () => {

  const posts = useSelector(state => state.posts)
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory) 
  const subCategory = useSelector(state => state.subCategory)
  const dispatch = useDispatch()
  
  useEffect(() => {
        fetchPosts()
      }, [communityId])
    
      const fetchPosts = async () => {
        try {
          const allPosts = await getAllPosts(communityId, mainCategory)
          console.log('all posts', allPosts)
          console.log('comm Id is', communityId)
          dispatch(setPosts(allPosts))
        } catch(error) {
          console.log('posts showing error', error)
        }
      }

  const showStatus = ({ post }) => {
   
    if (!post.startDate && !post.endDate) {
      return null
    }

    if (post.startDate && !post.endDate) {
      return <div>Ongoing</div>
    }

    const startDate = new Date(post.startDate)
    const endDate = new Date(post.endDate)
    const today = new Date()

    const daysToStart = (startDate - today) / (1000 * 60 * 60 * 24)
    const daysRemaining = (endDate - today ) / (1000 * 60 * 60 * 24)

    if (daysRemaining < 0) {
      return <div>Ended</div>
    }

    if (daysRemaining > 1 && daysToStart <= 0) {
      return <div>Ongoing</div>
    }

    if (daysRemaining < 1 && daysRemaining > 0 && daysToStart > 0) {
      return <div>Starts tomorrow</div>
    }

    if (daysRemaining > 0 && daysToStart < 0) {
      return <div>Ends tomorrow</div>
    }

  }

  const allPostFeed = () => {
    return (
      <div>
        {posts.map(post => (
          <div key={post.id}>
          <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
            <h3>{post.title.slice(0, 60)}</h3>
          </Link>
          {showStatus({post})}
          <p>{post.description.slice(0, 200)}...</p>
          <p>Tags: {post.mainCategory} {post.subCategory}</p>
          </div>
        ))}
      </div>
    )
  }
  const allSubCategoryPosts = () => {
    return (
      <div>
        {posts.filter(post => post.subCategory === subCategory).map(post => (
          <div key={post.id}>
          <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
            <h3>{post.title.slice(0, 60)}</h3>
          </Link>
          {showStatus({post})}
          <p>{post.description.slice(0, 200)}...</p>
          <p>Tags: {post.mainCategory} {post.subCategory}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {subCategory === 'All' ? allPostFeed(): allSubCategoryPosts()}
    </div>
  )
}


export default ShowAllPosts

// show first 10 posts and auto load next 10 when reached the 10th?