import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { clearMainCategory } from "../reducer/mainCategoryReducer"
import { setSubCategory, resetSubCategory } from "../reducer/subCategoryReducer"
import { useEffect } from "react"
import { getAllPosts, viewFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import { viewAllCommunityComments } from "../service/comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"
import { setComments } from "../reducer/commentsReducer"
import { notifyError } from "../reducer/errorReducer"


const UserPosts = ({ postsByUser, dispatch, navigate }) => {
  
  const handleMainCategory = (post) => {
      dispatch(resetSubCategory())
      const path = `/posts/${post.community}/${post.mainCategory}/${post.subCategory}`
      navigate(path)
    }
  
    const handleSubCategory = (post) => {
      dispatch(setSubCategory(post.subCategory))
      const path = `/posts/${post.community}/${post.mainCategory}/${post.subCategory}`
      navigate(path)
    }

  return (
    <div>
      <h3>Your posts</h3>
      <div className="profileDivider"></div>
      {postsByUser.map(post => 
      <div key={post.id} className="postCard">
        <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
         <h3>{post.title.slice(0, 60)}</h3>
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
      )}
    </div>
  )

}

const UserComments = ({ comments, communityId, accessToken }) => {

  if (!accessToken) {
    return null
  }

  const commentsInExistingPosts = comments.filter(comment => comment.post)
  
  console.log('comment', comments)
  
  return (
    <div>
      <h3>Your comments</h3>
      <div className="profileDivider"></div>
      {commentsInExistingPosts.map(comment => 
      <div key={comment.id} className="postCard">
      <Link to={`/posts/${communityId}/${comment.post.mainCategory}/${comment.post.subCategory}/${comment.post.id}`}>
      <h3>{comment.comment.slice(0, 60)}...</h3>
      <p className="postCardContent"><span className="title">{comment.post.title}</span> | {comment.post.description?.slice(0, 50)}</p>
      </Link>
      </div>
      )}
    </div>
  )
}

const UserFavorites = ({ favorites, communityId }) => {
 
  return  (
    <div>
      <h3>Your favorite posts</h3>
      <div className="profileDivider"></div>
      {favorites.map(fave => 
        <div key={fave.id} className="postCard communityTab">
          <Link to={`/posts/${communityId}/${fave.mainCategory}/${fave.subCategory}/${fave.id}`}>
          <h3>{fave.title.slice(0,60)}...</h3>
          <p className="postCardContent">{fave.description.slice(0,100)}...</p>
          </Link>
        </div>
      )}
    </div>
  )
    
}

const AdminSection = ({ communityId, user}) => {

  const isUserAnAdmin = user.managedCommunity?.map(c => c.id).includes(communityId)
  
  if (!isUserAnAdmin) {
    return null
  }

  return (
    <div>
      <h3>Your communities</h3>
      <div className="profileDivider"></div>
      {user.managedCommunity.map(community => 
        <div key={community.id} className="postCard communityDiv"> 
          <h2>{community.name}</h2>
          <h3 className="postCardContent">{community.description}</h3>
          <p className="postCardContent">Community users: {community.communityUsers.length}</p>
          <p className="postCardContent">Community admins: {community.additionalAdmins.length}</p>        
        </div>        
      )}
    </div>
  )
}

const Profile = () => {
  
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  const userId = user.id
  const accessToken = user.accessToken
  const posts = useSelector(state => state.posts)  
  const postsByUser = posts.filter(post => post.author === userId)
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const isUserAnAdmin = user.managedCommunity?.map(c => c.id).includes(communityId)
  const favoritePosts = useSelector(state => state.favorites)
  const comments = useSelector(state => state.comments)
  const subCategory = useSelector(state => state.subCategory)
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }  
  }, [!isLoggedIn])
  
  useEffect(() => {
  
    if (accessToken && (location.pathname === '/user/profile' || location.pathname === '/user/profile/comments' || location.pathname === '/user/profile/favorites' || location.pathname === '/user/profile/communities')) {
      reset()
    }
  }, [communityId, accessToken, location.pathname, dispatch])


  useEffect(() => {
    
    if (accessToken && (location.pathname === '/user/profile' || location.pathname === '/user/profile/favorites') && mainCategory === 'home') {
        fetchPosts()      
      }
    if (accessToken && (location.pathname === '/user/profile/comments' || '/user/profile')) {
      fetchComments()
    }
  }, [communityId, accessToken, mainCategory, subCategory, dispatch, location.pathname])

  useEffect(() => {
    console.log('user in fetchFavorites', user)
    if (accessToken && posts) {
      if (location.pathname === '/user/profile' || location.pathname === '/user/profile/favorites') {
        fetchFavorites()
      }
    }
  
  }, [communityId, accessToken, mainCategory, dispatch, posts, location.pathname])
      
  const fetchPosts = async () => {

    console.log('MAIN cate', mainCategory)
    
    try {
      const allPosts = await getAllPosts(communityId, mainCategory)
      console.log('all posts', allPosts)

      dispatch(setPosts(allPosts))
    } catch(error) {
        console.log('posts showing error', error.response.data.error)
        dispatch(notifyError('Loading...'))
      }
    }

  const fetchComments = async () => {
    try {
      const allComments = await viewAllCommunityComments(communityId)
          
      const comments = allComments.filter(c => c.commenter?.id?.toString() === userId.toString())

      console.log('all comments', allComments)
      
      dispatch(setComments(comments))
      
    } catch (error) {
        console.log('error comments', error.response.data.error)
        dispatch(notifyError('Loading...'))
     }

  }
  
  const fetchFavorites = async () => {
    try {
     const allfavorites = await viewFavorites(communityId)
      const allfavoritesInString = allfavorites.map(fave => fave.toString())
      const favoritePosts = posts.filter(post => allfavoritesInString.includes(post.id.toString()))
      dispatch(setFavoritePosts(favoritePosts))
      dispatch(notifyError('Loading...'))
            
   } catch (error) {
      console.log('error showing favorites', error.response.data.error)
    }  
 }

  const reset = () => {
    dispatch(clearMainCategory())
    dispatch(resetSubCategory())
  }

  return (
    <div>
      <div className="greetings">
        <h3>Hi {user.name ? user.name : user.username}!</h3>
      </div>
      <nav className="profileNav">
        <h3><NavLink to="/user/profile">Posts</NavLink></h3>
        <h3><NavLink to="/user/profile/comments">Comments</NavLink></h3>
        <h3><NavLink to="/user/profile/favorites">Favorites</NavLink></h3>
        <h3>{isUserAnAdmin ? <NavLink to="/user/profile/communities">Communities</NavLink> : '' }</h3>
      </nav>
      <Routes>
        <Route index element={<UserPosts postsByUser={postsByUser} dispatch={dispatch} navigate={navigate}/>} />     
        <Route path="/comments" element={<UserComments comments={comments} communityId={communityId} accessToken={accessToken} />} />
        <Route path="/favorites" element={<UserFavorites favorites={favoritePosts} communityId={communityId} />} />
        <Route path="/communities" element={<AdminSection communityId={communityId} user={user} />} />
      </Routes>
    </div>
  )



}

export default Profile