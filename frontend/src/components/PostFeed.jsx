import { useSelector, useDispatch } from "react-redux"
import { getAllPosts,  } from "../service/posts"
import { useEffect } from "react"
import { setPosts } from "../reducer/postReducer"
import { Link } from "react-router-dom"
import PostPage from "./PostPage"

const ShowAllPosts = () => {
  const dispatch = useDispatch()

  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const posts = useSelector(state => state.posts)
  const subCategory = useSelector(state => state.subCategory)
  console.log('sub cat', subCategory)

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

  console.log('all posts', posts)

  const allPostFeed = () => {
    return (
      <div>
        {posts.map(post => (
          <div key={post.id}>
          <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
            <h3>{post.title.slice(0, 60)}</h3>
          </Link>
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