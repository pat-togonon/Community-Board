import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { clearMainCategory, setMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"
import { useEffect, useState } from "react"
import { getAllPosts, deletePost, editPost, addToFavorites, viewFavorites, removeFromFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import Comment from "./Comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"
import { ShowStatus } from "./PostFeed"
import { notifyError } from "../reducer/errorReducer"
import { notifyConfirmation } from "../reducer/confirmationReducer"
import Confirmation from "./Notifications/Confirmation"
import Error from "./Notifications/Error"

const IsFound = ({ post, user, mainCategory, communityId, subCategory, id, fetchPosts, dispatch }) => {

  if (mainCategory.mainCategory !== 'lost-and-found') {
    return null
  }

  if (post.author.id !== user.id) {
    return null
  }

  if (post.isFound) {
    return null
  }

  const handleIsFound = async () => {
  
    const editedPost = {
      isFound: true
    }

    try {
      await editPost(communityId, mainCategory, subCategory, id, editedPost)
      fetchPosts()
    } catch (_error) {
      dispatch(notifyError("Can't update your post right now. Please try again later.", 7))
    }
  }

  return (
      <p role="button" onClick={handleIsFound}>
        Already found the item or owner? Click here.
      </p>
    
  )
}

const PostPage = () => {
  const [hide, setHide] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [updateDescription, setUpdateDescription] = useState('')
  const [favorited, setFavorited] = useState(false)
  const [clickDelete, setClickDelete] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const posts = useSelector(state => state.posts)
  const user = useSelector(state => state.user)
  const accessToken = user.accessToken
  const favoritePosts = useSelector(state => state.favorites)
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const { community, mainCategory, subCategory, id } = useParams()
    //hydrate redux so it persists upon browser refresh

  useEffect(() =>{
   
    if (!accessToken) {
      return
    }
    
    if (community) {
      dispatch(setCommunityId(community))
    }

    if (mainCategory) {
      dispatch(setMainCategory(mainCategory))
    }

    if (subCategory) {
      dispatch(setSubCategory(subCategory))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [accessToken, community, mainCategory, subCategory])

useEffect(() => {
  
  if (!accessToken) {
    return
  }

  if (user && community && mainCategory && subCategory && id) {
    fetchPosts()
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, community, mainCategory, subCategory, id])

  const fetchPosts = async () => {
    try {
      const allPosts = await getAllPosts(community, mainCategory)
      dispatch(setPosts(allPosts))
    } catch(_error) {
      dispatch(notifyError("Can't load posts right now. Please try again later.", 7))
    } 
  }

  useEffect(() => {
    if (!accessToken && !posts) {
      return
    }    

    fetchFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, accessToken, id, community, posts])

  const fetchFavorites = async () => {
      try {
        const allfavorites = await viewFavorites(community)
        const allfavoritesInString = allfavorites.map(fave => fave.toString())
        const favoritePosts = posts.filter(post => allfavoritesInString.includes(post.id.toString()))
        dispatch(setFavoritePosts(favoritePosts))
      } catch (_error) {
        dispatch(notifyError("Can't load favorites right now. Please try again later.", 7))
      } 
    }

  const post = posts.find(post => 
    post.community === community &&
    post.mainCategory === mainCategory &&
    post.subCategory === subCategory &&
    post.id === id)
  
  const handleReturn = (_event) => {
    dispatch(clearMainCategory())
    dispatch(resetSubCategory())
    navigate('/')
  }

  if (!post) {
  
    return (
      <div className="postCard">
        <h3>Loading or post not found...</h3>
        <button onClick={handleReturn} className="loginButton button returnHomeButton">Return home</button>      
      </div>
    )
  }  

  const editDelete = (_event) => {

    const handleEditPost = async (_event) => {
      setUpdateDescription(post.description)
      setHide(!hide)
      setShowEditor(!showEditor)
    }

    const handleDeleteConfirmation = (_event) => {
      setClickDelete(!clickDelete)
      
    }

    return (
      <div className="postButtons">
        <button onClick={handleEditPost} id="edit-post-button">Edit</button>
        <button onClick={handleDeleteConfirmation} id="delete-post-button">Delete</button>
      </div>
    )

  }

  const handleDelete = async (_event) => {

    try {
      await deletePost(community, mainCategory, subCategory, id)
      fetchPosts()
      fetchFavorites()
      dispatch(resetSubCategory())
      dispatch(notifyConfirmation('Post is successfully deleted!', 5))
      navigate(`/posts/${community}/${mainCategory}`)
    } catch(_error) {
      dispatch(notifyError("Oops! Trouble deleting post. Please try again.", 5))
    }
  }

  const descriptionStyle = {
    display: hide ? 'none' : ''
  }

  const editorStyle = {
    display: showEditor ? '' : 'none'
  }
  
  const handleCancelEdit = (_event) => {
    const path = `/posts/${community}/${mainCategory}/${subCategory}/${id}`
    navigate(path)
    setHide(!hide)
    setShowEditor(!showEditor)
  }

  const handlePostUpdate = async (_event) => {

    const editedPost = {
      description: updateDescription
    }

    try {
      await editPost(community, mainCategory, subCategory, id, editedPost)
      fetchPosts()
      const path = `/posts/${community}/${mainCategory}/${subCategory}/${id}`
      navigate(path)
      setHide(!hide)
      setShowEditor(!showEditor)
      dispatch(notifyConfirmation('Post updated successfully!', 4))
    } catch (_error) {
      dispatch(notifyError("Couldn't update your post. Please try again later.", 5))
    }
  }
  
  const handleAddToFavorites = async (id) => {

    try {
      await addToFavorites(id)
      setFavorited(!favorited)
      fetchFavorites()
      dispatch(notifyConfirmation('Added to your favorites!', 3))
    } catch (_error) {
      dispatch(notifyError("Oops! Can't add to your favorites right now. Try again later.", 6))
    }
  }

  const handleRemoveFavorites = async (id) => {
    try {
      await removeFromFavorites(id)
      dispatch(notifyConfirmation('Removed from your favorites!', 3))
      setFavorited(false)
      fetchFavorites()
      dispatch(notifyConfirmation('Removed from your favorites!', 3))      
    } catch (_error) {
      dispatch(notifyError("Oops! Can't remove from your favorites right now. Try again later.", 6))
    }
  }

  const fave = (id) => {
    const isPostAFave = favoritePosts.map(fave => fave.id.toString()).includes(id.toString()) 

    if (isPostAFave) {
      return (
        <div>
          <img src='/bookmarked.svg' onClick={() => handleRemoveFavorites(id)} alt="Remove from favorites" className="favoriteIcon" id="remove-favorite-icon"/>         
        </div>
      )
    }

    const style = {
      display: favorited ? 'none' : ''
    }
    
    return (
      <div style={style}>
        <img onClick={() => handleAddToFavorites(id)} src="/bookmark.svg" className="favoriteIcon" alt="Add to favorites" id="add-favorite-icon"/>
      </div>
    )
  }

  const deleteConfirmStyle = {
    display: clickDelete ? '' : 'none'
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

  const datePosted = new Date(post.createdAt).toLocaleString()

  return (
    <div className="postPage">
      <Error />
      <Confirmation />
      <div className="postTitle">
        <h2>{post.title}</h2>
        {fave(post.id)}
      </div>
      <p className="authorAndDate">Posted by: {post.author ? post.author.username : 'deletedAccount'} on {datePosted}</p>
      <ShowStatus post={post} />
      <div className="isFoundDiv">
        <IsFound post={post} user={user} mainCategory={{mainCategory}} communityId={community} subCategory={subCategory} id={id} fetchPosts={fetchPosts} dispatch={dispatch} /> 
      </div>
      <div style={descriptionStyle}>
      <p>{post.description}</p>
      </div>
        <div style={editorStyle} className="postEditor">
          <textarea value={updateDescription} name='updatedDescription' onChange={({ target }) => setUpdateDescription(target.value)} id="post-edit-textarea"></textarea>
          <div>
            <button onClick={handlePostUpdate} className="loginButton button" id="post-update-submit">update</button>
            <button onClick={handleCancelEdit} className="cancelEdit secondaryButton">cancel</button>
          </div>
        </div>      
        <div className="postCardContent tagContainer">
          <div className={`tags ${post.mainCategory}`} onClick={() => handleMainCategory(post)}>
            {post.mainCategory}
          </div> 
          <div className={`tags ${post.subCategory}`} onClick={() => handleSubCategory(post)}>
            {post.subCategory}
          </div> 
        </div>
        <div style={deleteConfirmStyle} className="deletePostDiv">
          <h3>Are you sure you want to delete this post?</h3>
          <div className="deletePostButtons">
            <button onClick={() => handleDelete()} className="loginButton button" id="delete-post-submit-button">Yes</button>
            <button onClick={() => setClickDelete(!clickDelete)} className="secondaryButton button">cancel</button>
          </div>
        </div>
      {clickDelete ? '' : <div style={descriptionStyle}>
        {post.author ? 
        (post.author.id === user.id ? editDelete() : '')
        : '' }
      </div>}
      <Comment communityId={community} mainCategory={mainCategory} subCategory={subCategory} id={id} />
    </div>
  )    
}

export default PostPage

 