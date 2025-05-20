import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, Routes, Route } from "react-router-dom"
import { clearMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import { useEffect, useState } from "react"
import { getAllPosts, viewFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import { viewAllCommunityComments } from "../service/comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"
import { setComments } from "../reducer/commentsReducer"


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

const UserComments = ({ comments, communityId }) => {
// or upon clicking on the comment title, create own comment page? With view all comments feature too

console.log('user comments', comments)

  return (
    <div>
      {comments.map(comment => 
      <div key={comment.id}>
      <Link to={`/posts/${communityId}/${comment.post.mainCategory}/${comment.post.subCategory}/${comment.post.id}`}>
      <h4>{comment.comment.slice(0, 60)}...</h4>
      </Link>
      <p><strong>{comment.post.title}</strong> | {comment.post.description.slice(0,50)}</p>
      </div>
      )}
    </div>
  )
}

const UserFavorites = ({ favorites, communityId }) => {
 console.log('user favorites', favorites)

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

  console.log('user', user)
  console.log('community id', communityId)

  const isUserAnAdmin = user.managedCommunity?.map(c => c.id).includes(communityId)
  console.log('user is admin?', isUserAnAdmin)
  if (!isUserAnAdmin) {
    return null
  }

  return (
    <div>
      {user.managedCommunity.map(community => 
        <li key={community.id}>{community.name}</li>
      )}
    </div>
  )
}

const Profile = () => {

  const [resetDone, setResetDone] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const userId = user.id
  const posts = useSelector(state => state.posts)  
  const postsByUser = posts.filter(post => post.author === userId)
  const communityId = useSelector(state => state.communityId)
  const mainCategory = useSelector(state => state.mainCategory)
  const isUserAnAdmin = user.managedCommunity?.map(c => c.id).includes(communityId)
  const favoritePosts = useSelector(state => state.favorites)
  const comments = useSelector(state => state.comments)

  useEffect(() => {
    reset()
    setResetDone(!resetDone)
  }, [])

  useEffect(() => {
    if (!resetDone) {
      return
    }
    fetchPosts()
    fetchComments()
  }, [communityId, mainCategory, dispatch])

  useEffect(() => {
    if (!resetDone) {
      return
    }

    const fetchFavorites = async () => {
      try {
       const allfavorites = await viewFavorites(communityId)
        const allfavoritesInString = allfavorites.map(fave => fave.toString())
        const favoritePosts = posts.filter(post => allfavoritesInString.includes(post.id.toString()))
        dispatch(setFavoritePosts(favoritePosts))
              
     } catch (error) {
        console.log('error showing favorites', error)
      }  
   }
    
   fetchFavorites()
   console.log('favorite posts', favoritePosts)
  
  }, [communityId, posts])
      
  const fetchPosts = async () => {
    try {
      const allPosts = await getAllPosts(communityId, mainCategory)
      dispatch(setPosts(allPosts))
    } catch(error) {
        console.log('posts showing error', error)
      }
    }

  const fetchComments = async () => {
    try {
      const allComments = await viewAllCommunityComments(communityId)
      const comments = allComments.filter(comment => comment.commenter === userId)
      dispatch(setComments(comments))
    } catch (error) {
        console.log('error comments', error)
     }

     console.log('user comments', comments)
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
      <nav>
        <NavLink style={menuStyle} to="/user/profile">Your Posts</NavLink>
        <NavLink style={menuStyle} to="/user/profile/comments">Your Comments</NavLink>
        <NavLink style={menuStyle} to="/user/profile/favorites">Your Favorites</NavLink>
        {isUserAnAdmin ? <NavLink style={menuStyle} to="/user/profile/communities">Your Communities</NavLink> : '' }
      </nav>
      <Routes>
        <Route index element={<UserPosts postsByUser={postsByUser} />} />     
        <Route path="/comments" element={<UserComments comments={comments} communityId={communityId} />} />
        <Route path="/favorites" element={<UserFavorites favorites={favoritePosts} communityId={communityId} />} />
        <Route path="/communities" element={<AdminSection communityId={communityId} user={user} />} />
      </Routes>
    </div>
  )



}

export default Profile