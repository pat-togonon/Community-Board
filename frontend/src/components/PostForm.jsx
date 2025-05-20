import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createPost } from "../service/posts"
import { addPost } from "../reducer/postReducer"
import { getCurrentCommunity } from "../service/community"
import { useNavigate } from "react-router"
import { validSubcategories } from "./SubCategory"
import { resetSubCategory, setSubCategory } from "../reducer/subCategoryReducer"
import { useParams } from "react-router-dom"
import { setCommunityId } from "../reducer/communityIdReducer"
import { setMainCategory } from "../reducer/mainCategoryReducer"
import { mainCategories } from "./dashboard"

// when create a post button is clicked, browser navigates to post form. So not toggle anymore because the subcategory gets pushed down

const SubCategoryDropDown = ({ subCategoryOptions, subCategory }) => {
  
  const dispatch = useDispatch()

  const handleSubCategory = (event) => {
    const subCategorySelected = event.target.value
    dispatch(setSubCategory(subCategorySelected))
  }
  console.log(subCategory, subCategoryOptions)

  return (
    <div>
      Post to a sub category:
      <select value={subCategory} onChange={handleSubCategory} id="subCategory" name="subCategory" required>
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

  useEffect(() => {
      if (community) {
        dispatch(setCommunityId(community))
      }
      if (mainCategory) {
        dispatch(setMainCategory(mainCategory))
      }
    }, [community, mainCategory])

  const communityId = useSelector(state => state.communityId)  

  const mainCategoryStored = useSelector(state => state.mainCategory)
  const subCategory = useSelector(state => state.subCategory)
  const user = useSelector(state => state.user)
  console.log('user id is', user.id)

  useEffect(() => {
    fetchCurrentCommunity()
  }, [user.id])

  const fetchCurrentCommunity = async () => {
    try {
      const currentCommunity = await getCurrentCommunity(communityId)
      const role = currentCommunity.additionalAdmins.find(id => id === user.id)
      console.log('current community is', currentCommunity, 'role is', role)
      if (!role) {
        return setUserRole(null)
      }
      setUserRole('admin')
    } catch(error) {
      console.log('error is', error)
    }

    console.log('user role is', userRole)
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
      const path = `/posts/${communityId}/${mainCategoryStored}`
      navigate(path)     

    } catch (error) {
      console.log('error posting is', error)
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
    <div>
        <h2>Create a new {categoryName} post</h2>
        <form onSubmit={handlePostCreation}>
          <SubCategoryDropDown subCategoryOptions={subCategoryOptions} subCategory={subCategory} />
          <h3>Title</h3>
          <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} />
          <h3>Description</h3>
          <textarea value={description} onChange={({ target }) => setDescription(target.value)}></textarea><br />
          <button type='button' onClick={() => setShowAddDate(!showAddDate)}>Add start date</button>
          <div style={addDateButtonStyle}>
            <input type='date' value={startDate} onChange={({ target }) => setStartDate(target.value)}></input>
          </div>
          <button type='button' onClick={() => setShowEndDate(!showEndDate)}>Add end date</button>
          <div style={endDateButtonStyle}>
            <input type='date' value={endDate} onChange={({ target }) => setEndDate(target.value)}></input>
          </div><br />
          <button type='submit'>Post</button>
        </form>
        <button type='button' onClick={handleCancel}>cancel</button>        
    </div>
  
  )
}

export default PostForm

// not br, but css please