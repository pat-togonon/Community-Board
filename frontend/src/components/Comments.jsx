import { useEffect, useState } from "react"
import { viewAllComments } from "../service/comments"

const Comment = ({ id, communityId, mainCategory, subCategory }) => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    fetchComments()
  }, [id])

  const fetchComments = async () => {
    try {
      const allComments = await viewAllComments(communityId, mainCategory, subCategory, id)
      console.log('all comments', allComments)
      const allCommentsContent = allComments.map(c => c.comment)
      //setComments(allCommentsContent)
      console.log(allCommentsContent)
      setComments([...allComments])
    } catch (error) {
      console.log('error fetching comments', error)
    }
    
  }
  
  const handlePostComment = () => {
    console.log('wait ah pati onchange on textarea')
  }

  return (
    <div>
      <textarea></textarea>
      <button onClick={handlePostComment}>add comment</button>
      <p>----</p>
      {comments.map(c => <li>{c.comment}</li>)}
    </div>
  )
}

export default Comment