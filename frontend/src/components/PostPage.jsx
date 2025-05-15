import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { setSubCategory } from "../reducer/subCategoryReducer"
import { useEffect } from "react"
import { getAllPosts } from "../service/posts"
import { setPosts } from "../reducer/postReducer"


const PostPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const posts = useSelector(state => state.posts)
  const user = useSelector(state => state.user)
  console.log('user is', user)

  const { community, mainCategory, subCategory, id } = useParams()
    //hydrate redux so it persists upon browser refresh

  console.log('post id is', id, community, mainCategory, subCategory)

  useEffect(() =>{
    if (community) {
      dispatch(setCommunityId(community))
    }

    if (mainCategory) {
      dispatch(setMainCategory(mainCategory))
    }

    if (subCategory) {
      dispatch(setSubCategory(subCategory))
    }

}, [community, mainCategory, subCategory])

useEffect(() => {
    fetchPosts()
  }, [mainCategory])

  const fetchPosts = async () => {
    try {
      const allPosts = await getAllPosts(community, mainCategory)
      dispatch(setPosts(allPosts))
    } catch(error) {
      console.log('posts showing error', error)
    }
  }
  
console.log('post id after useEffect is', id, community, mainCategory, subCategory)

console.log('posts from state after useEffect', posts)

  const post = posts.find(post => 
    post.community === community &&
    post.mainCategory === mainCategory &&
    post.subCategory === subCategory &&
    post.id === id)
  
  console.log('post is', post)
  
  if (!post) {
    //add return home?
    return <div>Post not found...</div>
  }
  const handleReturn = (event) => {
    navigate(`/posts/${community}/${mainCategory}/${subCategory}`)
  }

  const editDelete = (event) => {

    return (
      <div>
        <button>Edit Post</button>
        <button>Delete</button>
      </div>
    )

  }

  return (
    <div>
      <button onClick={handleReturn}>Go back</button>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      tags: {post.mainCategory} {post.subCategory}
      {post.author === user.id ? editDelete() : ''}
      
    </div>
  )

    
}

export default PostPage

 