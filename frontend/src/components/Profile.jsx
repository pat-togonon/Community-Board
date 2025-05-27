import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, Routes, Route, useLocation } from "react-router-dom"
import { clearMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import { useEffect } from "react"
import { getAllPosts, viewFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import { viewAllCommunityComments } from "../service/comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"
import { setComments } from "../reducer/commentsReducer"
import { notifyError } from "../reducer/errorReducer"


const UserPosts = ({ postsByUser }) => {
  
  return (
    <div>
      {postsByUser.map(post => 
      <div key={post.id}>
        <Link to={`/posts/${post.community}/${post.mainCategory}/${post.subCategory}/${post.id}`}>
         <h3>{post.title.slice(0, 60)}</h3>
       </Link>
          <p>{post.description.slice(0, 200)}...</p>
         <p>Tags: {post.mainCategory} {post.subCategory}</p>  
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
      {commentsInExistingPosts.map(comment => 
      <div key={comment.id}>
      <Link to={`/posts/${communityId}/${comment.post.mainCategory}/${comment.post.subCategory}/${comment.post.id}`}>
      <h4>{comment.comment.slice(0, 60)}...</h4>
      </Link>
      <p><strong>{comment.post.title}</strong> | {comment.post.description?.slice(0, 50)}</p>
      </div>
      )}
    </div>
  )
}

const UserFavorites = ({ favorites, communityId }) => {
 
  return  (
    <div>
      {favorites.map(fave => 
        <div key={fave.id}>
          <Link to={`/posts/${communityId}/${fave.mainCategory}/${fave.subCategory}/${fave.id}`}>
            <h3>{fave.title.slice(0,60)}...</h3>
          </Link>
          <p>{fave.description.slice(0,100)}...</p>
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
      {user.managedCommunity.map(community => 
        <div key={community.id}> 
          <h3>{community.name}</h3>
          <p>{community.description}</p>
          <p>Total users: {community.communityUsers.length}</p>
          <p>Total community admins: {community.additionalAdmins.length}</p>        
        </div>
        
      )}
    </div>
  )
}

const Profile = () => {
  
  const dispatch = useDispatch()
  const location = useLocation()
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
  
  useEffect(() => {
  
    if (user && (location.pathname === '/user/profile' || location.pathname === '/user/profile/comments' || location.pathname === '/user/profile/favorites' || location.pathname === '/user/profile/communities')) {
      reset()
    }
  }, [communityId, user, location.pathname, dispatch])


  useEffect(() => {
    
    if (user && (location.pathname === '/user/profile' || location.pathname === '/user/profile/favorites') && mainCategory === 'home') {
        fetchPosts()      
      }
    if (user && (location.pathname === '/user/profile/comments' || '/user/profile')) {
      fetchComments()
    }
  }, [communityId, user, mainCategory, subCategory, dispatch, location.pathname])

  useEffect(() => {
    console.log('user in fetchFavorites', user)
    if (user && posts) {
      if (location.pathname === '/user/profile' || location.pathname === '/user/profile/favorites') {
        fetchFavorites()
      }
    }
  
  }, [communityId, user, mainCategory, dispatch, posts, location.pathname])
      
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

  const menuStyle = {
    paddingRight: 20,
    fontSize: 20
  }

  return (
    <div>
      <div>
        <h3>Hi {user.name ? user.name : user.username}!</h3>
      </div>
      <nav>
        <NavLink style={menuStyle} to="/user/profile">Your Posts</NavLink>
        <NavLink style={menuStyle} to="/user/profile/comments">Your Comments</NavLink>
        <NavLink style={menuStyle} to="/user/profile/favorites">Your Favorites</NavLink>
        {isUserAnAdmin ? <NavLink style={menuStyle} to="/user/profile/communities">Your Communities</NavLink> : '' }
      </nav>
      <Routes>
        <Route index element={<UserPosts postsByUser={postsByUser} />} />     
        <Route path="/comments" element={<UserComments comments={comments} communityId={communityId} accessToken={accessToken} />} />
        <Route path="/favorites" element={<UserFavorites favorites={favoritePosts} communityId={communityId} />} />
        <Route path="/communities" element={<AdminSection communityId={communityId} user={user} />} />
      </Routes>
    </div>
  )



}

export default Profile