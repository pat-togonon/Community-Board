import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createPost } from "../service/posts"
import { addPost } from "../reducer/postReducer"
import { getCurrentCommunity } from "../service/community"
import { useNavigate } from "react-router"
import { validSubcategories } from "../helper/helpers"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"
import { useParams } from "react-router-dom"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { mainCategories } from "../helper/helpers"
import { notifyError } from "../reducer/errorReducer"
import Error from "./Notifications/Error"
import { notifyConfirmation } from "../reducer/confirmationReducer"


const SubCategoryDropDown = ({ subCategoryOptions, subCategory }) => {
  
  const dispatch = useDispatch()

  const handleSubCategory = (event) => {
    const subCategorySelected = event.target.value
    dispatch(setSubCategory(subCategorySelected))
  }
  console.log(subCategory, subCategoryOptions)

  return (
    <div className="categoryNav newPostSubCategories">
      <h3>Post to: <span className='required'>*</span></h3><select value={subCategory} onChange={handleSubCategory} id="subCategory" name="subCategory" required>
        <option key='All' value='All'>Select a sub category</option>
        {subCategoryOptions.map(subCategory => (
          <option key={subCategory.subCat} value={subCategory.subCat}>
            {subCategory.name}
          </option>
        ))}
      </select>
    </div>
  )
}

const PostForm = () => {
  const [showAddDate, setShowAddDate] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [userRole, setUserRole] = useState(null)

  const { community, mainCategory } = useParams()
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const communityId = useSelector(state => state.communityId)  
  const mainCategoryStored = useSelector(state => state.mainCategory)
  const subCategory = useSelector(state => state.subCategory)
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const user = useSelector(state => state.user)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }  
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      if (community) {
        dispatch(setCommunityId(community))
      }
      if (mainCategory) {
        dispatch(setMainCategory(mainCategory))
      }
    }
  }, [user, community, mainCategory])

  useEffect(() => {
    if (user) {
      fetchCurrentCommunity()
    }
  }, [user])

  const fetchCurrentCommunity = async () => {
    try {
      const currentCommunity = await getCurrentCommunity(communityId)
      const role = currentCommunity.additionalAdmins.find(id => id === user.id)
  
      if (!role) {
        return setUserRole(null)
      }
      setUserRole('admin')
    } catch(error) {
      dispatch(notifyError('Loading...'), 5)
    }
  }

  if (mainCategoryStored === 'home') {
    return null
  }

  if (mainCategoryStored === 'announcement' && userRole !== 'admin' && subCategory) {
    return null
  }

  const addDateButtonStyle = { display: showAddDate ? '' : 'none'}
  const endDateButtonStyle = { display: showEndDate ? '' : 'none'}

  const handlePostCreation = async (event) => {
    event.preventDefault()

    if (!subCategory || !title || !description) {
      dispatch(notifyError("Please fill in required fields.", 5))
      return
    }
    const newPost = {
      communityId,
      mainCategory: mainCategoryStored,
      subCategory,
      author: user.id,
      title,
      description,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    }
    console.log('new post is', newPost)
    
    try {
      const createdPost = await createPost(newPost, communityId, mainCategoryStored, subCategory)
      dispatch(addPost(createdPost))
      dispatch(notifyConfirmation('Posted successfully!', 3))

      const path = `/posts/${communityId}/${mainCategoryStored}`
      navigate(path)     

    } catch (error) {
      dispatch(notifyError(`Oops! Error posting. ${error.response.data.error}. Try again.`, 6))
    }
    
    reset()
  }

  const reset = () => {
    setTitle('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setShowAddDate(!showAddDate)
    setShowEndDate(!showEndDate)
    dispatch(resetSubCategory())
  }

  const handleCancel = () => {
    reset()
    const path = `/posts/${communityId}/${mainCategoryStored}`
    navigate(path)
  }

  const subCategoryOptions = validSubcategories[mainCategoryStored]
  console.log('sub cat options', subCategoryOptions, 'sub cat is', subCategory)

  const categoryName = mainCategories.find(cat => cat.category === mainCategoryStored).name
  
  return (
    <div className="newPostPage">
      <Error />
        <h2>Create a new {categoryName} post</h2>
        <form onSubmit={handlePostCreation}>
          <SubCategoryDropDown subCategoryOptions={subCategoryOptions} subCategory={subCategory} />
          <h3>Title<span className='required'>*</span></h3>
          <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} id="new-post-title"/>
          <h3>Description<span className='required'>*</span></h3>
          <textarea value={description} onChange={({ target }) => setDescription(target.value)} id="new-post-description"></textarea>
          <div className="newPostDateButtons">
            <button type='button' onClick={() => setShowAddDate(!showAddDate)}>Add start date</button>
            <div style={addDateButtonStyle}>
            <input type='date' value={startDate} onChange={({ target }) => setStartDate(target.value)}></input>
            </div>
            <button type='button' onClick={() => setShowEndDate(!showEndDate)}>Add end date</button>
            <div style={endDateButtonStyle}>
              <input type='date' value={endDate} onChange={({ target }) => setEndDate(target.value)}></input>
            </div>
          </div>
          <button type='submit' className="loginButton button postButton" id="new-post-submit-button">Post</button>
        </form>
        <button type='button' onClick={handleCancel} className="secondaryButton button">cancel</button>        
    </div>
  
  )
}

export default PostForm

// not br, but css please