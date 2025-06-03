import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { clearMainCategory, setMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"
import { useEffect } from "react"
import { getAllPosts, deletePost, editPost, addToFavorites, viewFavorites, removeFromFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import { useState } from "react"
import Comment from "./Comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"
import { ShowStatus } from "./PostFeed"
import { notifyError } from "../reducer/errorReducer"
import { notifyConfirmation } from "../reducer/confirmationReducer"
import Confirmation from "./Notifications/Confirmation"
import Error from "./Notifications/Error"


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
  const isLoggedIn = localStorage.getItem('isLoggedIn')

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

}, [accessToken, community, mainCategory, subCategory])

useEffect(() => {
  
  if (!accessToken) {
    return
  }

  if (user && community && mainCategory && subCategory && id) {
    fetchPosts()
  }
  
  }, [accessToken, community, mainCategory, subCategory, id])

  const fetchPosts = async () => {
    try {
      const allPosts = await getAllPosts(community, mainCategory)
      dispatch(setPosts(allPosts))
    } catch(error) {
      console.log('posts showing error', error.response.data.error)
    } // ADD notifyErrors!!
  }

  useEffect(() => {
    if (!accessToken) {
      return
    }

    fetchFavorites()
  }, [dispatch, accessToken])

  const fetchFavorites = async () => {
      try {
        const allfavorites = await viewFavorites(community)
        const allfavoritesInString = allfavorites.map(fave => fave.toString())
        const favoritePosts = posts.filter(post => allfavoritesInString.includes(post.id.toString()))
        dispatch(setFavoritePosts(favoritePosts))
      } catch (error) {
        console.log('error showing favorites', error.response.data.error)
      } // ADD notifyErrors!!
    }

  const post = posts.find(post => 
    post.community === community &&
    post.mainCategory === mainCategory &&
    post.subCategory === subCategory &&
    post.id === id)
  
  const handleReturn = (event) => {
    dispatch(clearMainCategory())
    dispatch(resetSubCategory())
    navigate('/')
  }

  if (!post) {
    //add return home?
    return (
      <div className="postCard">
        <h3>Loading or post not found...</h3>
        <button onClick={handleReturn} className="loginButton button returnHomeButton">Return home</button>      
      </div>
    )
  }  

  const editDelete = (event) => {

    const handleEditPost = async (event) => {
      setUpdateDescription(post.description)
      setHide(!hide)
      setShowEditor(!showEditor)
    }

    const handleDeleteConfirmation = (event) => {
      setClickDelete(!clickDelete)
      
    }

    return (
      <div className="postButtons">
        <button onClick={handleEditPost}>Edit</button>
        <button onClick={handleDeleteConfirmation}>Delete</button>
      </div>
    )

  }

  const handleDelete = async (event) => {

      try {
        await deletePost(community, mainCategory, subCategory, id)
        fetchPosts()
        fetchFavorites()
        dispatch(resetSubCategory())
        dispatch(notifyConfirmation('Post is successfully deleted!', 5))
        navigate(`/posts/${community}/${mainCategory}`)
      } catch(error) {
        dispatch(notifyError("Oops! Trouble deleting post. Please try again.", 5))
      }
  }


  const descriptionStyle = {
    display: hide ? 'none' : ''
  }

  const editorStyle = {
    display: showEditor ? '' : 'none'
  }
  console.log('show editor', showEditor, 'clicked delete', clickDelete)

  const handleCancelEdit = (event) => {
    const path = `/posts/${community}/${mainCategory}/${subCategory}/${id}`
    navigate(path)
    setHide(!hide)
    setShowEditor(!showEditor)
  }

  const handlePostUpdate = async (event) => {

    const editedPost = {
      ...post,
      description: updateDescription
    }

    console.log('edited post is', editedPost)

    try {
      await editPost(community, mainCategory, subCategory, id, editedPost)
      fetchPosts()
      const path = `/posts/${community}/${mainCategory}/${subCategory}/${id}`
      navigate(path)
      setHide(!hide)
      setShowEditor(!showEditor)
      dispatch(notifyConfirmation('Post updated successfully!', 4))

    } catch (error) {
      console.log('error editing post', error)
      dispatch(notifyError("Couldn't update your post. Please try again", 5))
    }
  }
  
  const handleAddToFavorites = async (id) => {

    console.log('favorited id', id)
    try {
      await addToFavorites(id)
      setFavorited(!favorited)
      fetchFavorites()
      dispatch(notifyConfirmation('Added to your favorites!', 3))
    } catch (error) {
      console.log('error adding to favorites', error.response.data.error)
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
      
    } catch (error) {
      console.log('error removing from favorites', error.response.data.error)
      dispatch(notifyError("Oops! Can't remove from your favorites right now. Try again later.", 6))
    }
  }

  const fave = (id) => {
    const isPostAFave = favoritePosts.map(fave => fave.id.toString()).includes(id.toString()) 

    if (isPostAFave) {
      return (
        <div>
          <img src='/bookmarked.svg' onClick={() => handleRemoveFavorites(id)} alt="Remove from favorites" className="favoriteIcon"/>         
        </div>
      )
    }

    const style = {
      display: favorited ? 'none' : ''
    }
    
    return (
      <div style={style}>
        <img onClick={() => handleAddToFavorites(id)} src="/bookmark.svg" className="favoriteIcon" alt="Add to favorites"/>
      </div>
    )
  }

  /*const contentStyle = {
    display: clickDelete ? 'none' : ''
  }*/

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

  return (
    <div className="postPage">
      <Error />
      <Confirmation />
      <div className="postTitle">
        <h2>{post.title}</h2>
        {fave(post.id)}
      </div>
      <p>Posted by: {post.author ? post.author.username : 'deletedAccount'}</p>
      <ShowStatus post={post} />
      <div style={descriptionStyle}>
      <p>{post.description}</p>
      </div>
        <div style={editorStyle} className="postEditor">
          <textarea value={updateDescription} name='updatedDescription' onChange={({ target }) => setUpdateDescription(target.value)}></textarea>
          <div>
            <button onClick={handlePostUpdate} className="loginButton button">update</button>
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
            <button onClick={() => handleDelete()} className="loginButton button">Yes</button>
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

 