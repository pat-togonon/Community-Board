import { useEffect, useState } from "react"
import { viewAllComments, postComment, updateComment, deleteComment} from "../service/comments"
import { useSelector, useDispatch } from "react-redux"
import { setComments } from "../reducer/commentsReducer"

const CommentList = ({ comment, user, fetchComments }) => {
  const [hideComment, setHideComment] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editComment, setEditComment] = useState('')  

  const isUserTheCommenter = comment.commenter?.id === user.id


  const commentStyle = {
    display: hideComment ? 'none' : ''
  }

  const editStyle = {
    display: showEdit ? '' : 'none'
  }

  const handleEdit = (comment) => {
    setHideComment(!hideComment)
    setShowEdit(!showEdit)
    setEditComment(comment.comment)
  }

  const handleCancel = () => {
    setEditComment('')
    setHideComment(!hideComment)
    setShowEdit(!showEdit)
  }

  const handleSaveUpdate = async (comment) => {
    console.log('edited', editComment)
    const updatedComment = {
      comment: editComment
    }

    try {
      await updateComment(comment.id, updatedComment)
      fetchComments()
      setHideComment(!hideComment)
      setShowEdit(!showEdit)
    } catch (error) {
      console.log('error updating comment', error.response.data.error)
    }
  }

  const handleDelete = async (comment) => {

    //notification = are you use you want to delete?
    
    try {
      await deleteComment(comment.id)
      fetchComments()
    } catch (error) {
      console.log('error deleting comment', error.response.data.error)
    }
  }

  console.log('comment', comment)
  return (
    <div>
      <div style={commentStyle}>
        {comment.comment} - {comment.commenter ? comment.commenter.username : 'deletedAccount'}
        {isUserTheCommenter
          ? <div>
              <button onClick={() => handleEdit(comment)}>Edit</button>
              <button onClick={() => handleDelete(comment)}>Delete</button>
            </div>
          : ''}
      </div>
      <div style={editStyle}>
          <input value={editComment} onChange={({ target }) => setEditComment(target.value)} />
          <button onClick={() => handleSaveUpdate(comment)}>save</button>
          <button onClick={handleCancel}>cancel</button>
      </div>

    </div>
  )
}


const Comment = ({ id, communityId, mainCategory, subCategory }) => {
  
  const [newComment, setNewComment] = useState('')

  const user = useSelector(state => state.user)
  const posts = useSelector(state => state.posts)
  const comments = useSelector(state => state.comments)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      fetchComments()
    }
  }, [user, id, updateComment, posts])

  const fetchComments = async () => {
    try {
      const allComments = await viewAllComments(communityId, mainCategory, subCategory, id)
      dispatch(setComments([...allComments]))
    } catch (error) {
      console.log('error fetching comments', error)
    }
    
  }
  
  const handlePostComment = async () => {
  
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
    
  console.log('all comments', comments)
  return (
    <div>
      <textarea value={newComment} onChange={({ target }) => setNewComment(target.value)}></textarea>
      <button onClick={handlePostComment}>add comment</button>
      <h3>Comments</h3>
      {comments.map(comment => 
        <div key={comment.id}>
          {<CommentList comment={comment} user={user} fetchComments={() => fetchComments()}/>}
        </div>
      )}
      
    </div>
  )
}

export default Comment