import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"
import { useEffect } from "react"
import { getAllPosts, deletePost, editPost, addToFavorites, viewFavorites, removeFromFavorites } from "../service/posts"
import { setPosts } from "../reducer/postReducer"
import { useState } from "react"
import Comment from "./Comments"
import { setFavoritePosts } from "../reducer/favoriteReducer"



const PostPage = () => {
  const [hide, setHide] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [updateDescription, setUpdateDescription] = useState('')
  const [favorited, setFavorited] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const posts = useSelector(state => state.posts)
  const user = useSelector(state => state.user)
  const favoritePosts = useSelector(state => state.favorites)

  const { community, mainCategory, subCategory, id } = useParams()
    //hydrate redux so it persists upon browser refresh

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

  useEffect(() => {
    fetchFavorites()
  }, [favoritePosts])

  const fetchFavorites = async () => {
      try {
        const allfavorites = await viewFavorites(community)
        const allfavoritesInString = allfavorites.map(fave => fave.toString())
        const favoritePosts = posts.filter(post => allfavoritesInString.includes(post.id.toString()))
        dispatch(setFavoritePosts(favoritePosts))
      } catch (error) {
        console.log('error showing favorites', error)
      }
    }

  const post = posts.find(post => 
    post.community === community &&
    post.mainCategory === mainCategory &&
    post.subCategory === subCategory &&
    post.id === id)
  
  const handleReturn = (event) => {
    dispatch(resetSubCategory())
    navigate(`/posts/${community}/${mainCategory}`)
  }

  if (!post) {
    //add return home?
    return (
      <div>
        <h3>Post not found...</h3>
        <button onClick={handleReturn}>Go to posts</button>      
      </div>
    )
  }  

  const editDelete = (event) => {

    const handleDelete = async (event) => {

      // need confirmation first if push through deletion

      try {
        await deletePost(community, mainCategory, subCategory, id)
        fetchPosts()
        fetchFavorites()
        dispatch(resetSubCategory())
        navigate(`/posts/${community}/${mainCategory}`)
      } catch(error) {
        console.log('error deleting post', error)
      }
    }

    const handleEditPost = async (event) => {
      setUpdateDescription(post.description)
      setHide(!hide)
      setShowEditor(!showEditor)
    }

    return (
      <div>
        <button onClick={handleEditPost}>Edit description</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    )

  }

  const descriptionStyle = {
    display: hide ? 'none' : ''
  }

  const editorStyle = {
    display: showEditor ? '' : 'none'
  }

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

    } catch (error) {
      console.log('error editing post', error)
    }
  }

  // for add to favorites, maybe can be dynamic. If not favorited yet, can be favorited. If already favorited, then clicking one more time will remove the post from favoritePosts array. Add to Favorites or Remove from Favorites for button? 
  
  const handleAddToFavorites = async (id) => {

    console.log('favorited id', id)
    try {
      await addToFavorites(id)
//      fetchPosts()
      setFavorited(!favorited)
      fetchFavorites()
      // add notification telling user successfully added into favorites
    } catch (error) {
      console.log('error adding to favorites', error)
    }
  }

  const handleRemoveFavorites = async (id) => {
    try {
      await removeFromFavorites(id)
      fetchFavorites()
      
    } catch (error) {
      console.log('error removing from favorites', error)
    }
  }

  const fave = (id) => {
    const isPostAFave = favoritePosts.map(fave => fave.id.toString()).includes(id.toString()) 

    if (isPostAFave) {
      return (
        <div>
          <button onClick={() => handleRemoveFavorites(id)}>Remove from favorites</button>
        </div>
      )
    }

    const style = {
      display: favorited ? 'none' : ''
    }
    
    return (
      <div style={style}>
        <button onClick={() => handleAddToFavorites(id)}>Add to favorites</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleReturn}>Go to posts</button>
      <h2>{post.title}</h2>
      {fave(post.id)}
      <div style={descriptionStyle}>
      <p>{post.description}</p>
      </div>
      <div style={editorStyle}>
        <textarea value={updateDescription} name='updatedDescription' onChange={({ target }) => setUpdateDescription(target.value)}></textarea>
        <button onClick={handlePostUpdate}>update description</button>
        <button onClick={handleCancelEdit}>cancel</button>
      
      </div>
        tags: {post.mainCategory} {post.subCategory}
      <div style={descriptionStyle}>
        {post.author === user.id ? editDelete() : ''}
      </div>
      <Comment communityId={community} mainCategory={mainCategory} subCategory={subCategory} id={id} />
    </div>
  )

    
}

export default PostPage

 