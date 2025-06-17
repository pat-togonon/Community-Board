import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getAllPosts } from '../service/posts'
import { setPosts } from '../reducer/postReducer'
import { notifyError } from "../reducer/errorReducer"
import Error from "./Notifications/Error"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"



export const ShowStatus = ({ post }) => {

  if (post.mainCategory === 'lost-and-found' && post.isFound == false) {
    return <div className="postCardContent status"><img src='/circle-red.svg' /> Still looking...</div>
  }  
     
  if (!post.startDate && !post.endDate && !post.isFound) {
    return null
  }

  if (post.isFound) {
    return <div className="postCardContent status"><img src='/circle-fill.svg' /> Already found</div>
  }  

  if (post.startDate && !post.endDate) {
    return <div className="postCardContent status"><img src='/circle-fill.svg' /> Ongoing</div>
  }

  const startDate = new Date(post.startDate)
  const endDate = new Date(post.endDate)
  const today = new Date()

  const daysToStart = (startDate - today) / (1000 * 60 * 60 * 24)
  const daysRemaining = (endDate - today ) / (1000 * 60 * 60 * 24)

  if (daysRemaining < 0) {
    return <div className="postCardContent status"><img src='/circle-red.svg' /> Ended on {endDate.toDateString()}</div>
  }

  if (daysRemaining > 1 && daysToStart <= 0) {
    return <div className="postCardContent status"><img src='/circle-fill.svg' /> Ongoing until {endDate.toDateString()}</div>
  }

  if (daysRemaining < 1 && daysRemaining > 0 && daysToStart > 0) {
    return <div className="postCardContent status"><img src='/circle-orange.svg' /> Starts tomorrow</div>
  }

  if (daysRemaining > 0 && daysToStart < 0) {
    return <div className="postCardContent status"><img src='/circle-fill.svg' /> Ends tomorrow</div>
  }

  if (startDate > today) {
    return <div className="postCardContent status"><img src='/circle-orange.svg' /> Starts in {Math.floor(daysToStart)} day/s</div>
  }

}

const ShowAllPosts = () => {

  const posts = useSelector(state => state.posts)
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory) 
  const subCategory = useSelector(state => state.subCategory)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  const handleMainCategory = (post) => {
    dispatch(resetSubCategory())
    const path = `/posts/${post.community}/${post.mainCategory}`
    navigate(path)
  }

  const handleSubCategory = (post) => {
    dispatch(setSubCategory(post.subCategory))
    const path = `/posts/${post.community}/${post.mainCategory}/${post.subCategory}`
    navigate(path)
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
              <h3 className="linked" id="post-card-title">{post.title.slice(0, 60)}</h3>           
              {ShowStatus({post})}
              <p className="postCardContent">{post.description.slice(0, 200)}...</p>
            </Link>
            <div className="postCardContent tagContainer">
              <div className={`tags ${post.mainCategory}`} onClick={() => handleMainCategory(post)}>
                  {post.mainCategory}
              </div> 
              <div className={`tags ${post.subCategory}`} onClick={() => handleSubCategory(post)}>
                {post.subCategory}
              </div>  
            </div>
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
            {ShowStatus({post})}
            <p className="postCardContent">{post.description.slice(0, 200)}...</p>
          </Link>
          <div className="postCardContent tagContainer">
            <div className={`tags ${post.mainCategory}`} onClick={() => handleMainCategory(post)}>
              {post.mainCategory}
            </div> 
            <div className={`tags ${post.subCategory}`} onClick={() => handleSubCategory(post)}>
              {post.subCategory}
            </div>
          </div>
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