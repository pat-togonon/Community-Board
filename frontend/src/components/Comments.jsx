import { useEffect, useState } from "react"
import { viewAllComments, postComment} from "../service/comments"
import { useSelector, useDispatch } from "react-redux"
import { setComments } from "../reducer/commentsReducer"


const Comment = ({ id, communityId, mainCategory, subCategory }) => {
  //const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const comments = useSelector(state => state.comments)
  const dispatch = useDispatch()

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
      dispatch(setComments([...allComments]))
    } catch (error) {
      console.log('error fetching comments', error)
    }
    
  }
  
  const handlePostComment = async () => {
    console.log('wait ah pati onchange on textarea')
    const newCommentToPost = {
      parentComment: null,
      comment: newComment
    }
    try {
      await postComment(communityId, mainCategory, subCategory, id, newCommentToPost)
      fetchComments()

    } catch (error) {
      console.log('error posting your comment', error)
    }

    setNewComment('')
  }

  return (
    <div>
      <textarea value={newComment} onChange={({ target }) => setNewComment(target.value)}></textarea>
      <button onClick={handlePostComment}>add comment</button>
      <h3>Comments</h3>
      {comments.map(c => <li key={c.id}>{c.comment} -{c.commenter.username}</li>)}
    </div>
  )
}

export default Comment