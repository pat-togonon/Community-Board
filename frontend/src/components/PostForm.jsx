import { useState } from "react"
import { useSelector } from "react-redux"

// when create a post button is clicked, browser navigates to post form. So not toggle anymore because the subcategory gets pushed down

const PostForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [showAddDate, setShowAddDate] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)

  const mainCategory = useSelector(state => state.mainCategory)
  const subCategory = useSelector(state => state.subCategory)

  if (mainCategory === 'home' || subCategory === 'All') {
    return null
  }

  const style = { display: showForm ? '' : 'none' }
  const buttonStyle = { display: showForm ? 'none' : '' }

  const addDateButtonStyle = { display: showAddDate ? '' : 'none'}
  const endDateButtonStyle = { display: showEndDate ? '' : 'none'}

  return (
    <div>
      <button style={buttonStyle} onClick={() => setShowForm(!showForm)}>Create a post</button>
      <div style={style}>
        <h2>Heyoo Pat!</h2>
        <form>
          <h3>Title</h3>
          <textarea name='post-title' maxlength='60' required></textarea>
          <h3>Description</h3>
          <textarea name='post-description' maxlength='200' required></textarea><br />
          <button onClick={() => setShowAddDate(!showAddDate)}>Add start date</button>
          <div style={addDateButtonStyle}>
            <input type='date'></input>
          </div>
          <button onClick={() => setShowEndDate(!showEndDate)}>Add end date</button>
          <div style={endDateButtonStyle}>
            <input type='date'></input>
          </div>
          <button type='submit'>Post</button>
          <button onClick={() => setShowForm(!showForm)}>cancel</button>
        </form>
        
      </div>
    </div>
  )
}

export default PostForm

// not br, but css please