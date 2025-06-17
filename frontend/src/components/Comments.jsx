import { useEffect, useState } from "react"
import { viewAllComments, postComment, updateComment, deleteComment} from "../service/comments"
import { useSelector, useDispatch } from "react-redux"
import { setComments } from "../reducer/commentsReducer"


const CommentList = ({ comment, user, fetchComments }) => {
  const [hideComment, setHideComment] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editComment, setEditComment] = useState('')  
  const [hideButtons, setHideButtons] = useState(false)
  const [notDeleted, setNotDeleted] = useState(false)
  const [notEdited, setNotEdited] = useState(false)

  const isUserTheCommenter = comment.commenter?.id === user.id

  // Add notifications and errors too please 

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
      setNotEdited(true)
      setTimeout(() => {
        setNotEdited(false)
      }, 3500)
    }
  }

  const handleDelete = async (comment) => {
    
    try {
      await deleteComment(comment.id)
      fetchComments()
    } catch (error) {
      setNotDeleted(true)
      setHideButtons(!hideButtons)
      setTimeout(() => {
        setNotDeleted(false)
      }, 3000)
    }
  }

  const editDeleteStyle = {
    display: hideButtons ? 'none' : ''
  }

  const deleteConfirmationStyle = {
    display: hideButtons ? '' : 'none'
  }

  const deletedCommentNotifStyle = {
    display: notDeleted ? '' : 'none'
  }

  const editCommentErrorStyle = {
    display: notEdited ? '' : 'none'
  }
  console.log('comment', comment)
  const dateCommented = new Date(comment.createdAt).toLocaleString()

  return (
    <div>
      <div style={commentStyle}>
        <span className="commentContent">{comment.comment}
        <p className="commentContent commenterAndDate">{comment.commenter ? comment.commenter.username : 'deletedAccount'} {dateCommented}</p>
        </span>
        {isUserTheCommenter
          ? <div className="editDeleteCommentButtons" style={editDeleteStyle}>
              <div role="button" onClick={() => handleEdit(comment)} id="edit-comment-button">Edit</div>
              <div role="button" onClick={() => setHideButtons(!hideButtons)} id="delete-comment-button">Delete</div>
            </div>
          : ''}
      </div>
      <div style={editStyle} className="editCommentDiv">
          <textarea value={editComment} onChange={({ target }) => setEditComment(target.value)} id="edit-comment-textarea"/>
          <div>
            <button onClick={() => handleSaveUpdate(comment)} className="loginButton button" id="save-edited-comment-button">save</button>
            <button onClick={handleCancel} className="secondaryButton button">cancel</button>
          </div>
      </div>     
        <div className="deletePostDiv" style={deleteConfirmationStyle}>
          <h3>Are you sure you want to delete this comment?</h3>
          <div className="deletePostButtons">
            <button className="loginButton button" onClick={() => handleDelete(comment)} id="confirm-comment-delete-button">Yes</button>
            <button className="secondaryButton button" onClick={() => setHideButtons(!hideButtons)}>cancel</button>
          </div>
      </div>
      <div style={deletedCommentNotifStyle} className="commentErrorDiv deleteCommentError">
        <p>Can't delete comment right now. Please try again later.</p>
      </div>
      <div style={editCommentErrorStyle} className="commentErrorDiv deleteCommentError">
        <p>Can't update your comment right now. Please try again later.</p>
      </div>
    </div>
  )
}


const Comment = ({ id, communityId, mainCategory, subCategory }) => {
  
  const [newComment, setNewComment] = useState('')
  const [showCommentError, setShowCommentError] = useState(false)

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
  
  const handlePostComment = async (event) => {    
    event.preventDefault()

    if (!newComment) {
      setShowCommentError(true)
      setTimeout(() => {
        setShowCommentError(false)
      }, 3000)
      return
    }

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
    
  const commentErrorStyle = {
    display: showCommentError ? '' : 'none'
  }
  console.log('all comments', comments)

  return (
    <div className="commentDiv">
      <textarea value={newComment} onChange={({ target }) => setNewComment(target.value)} id="comment-textarea"></textarea>
      <div>
        <button type="submit" onClick={handlePostComment} className="loginButton button" id="add-comment-button">add comment</button>
        {newComment ? <button type="button" onClick={() => setNewComment('')} className="secondaryButton button">cancel</button> : ''}
      </div>
      <div style={commentErrorStyle} className="commentErrorDiv">
        <p>Oops! Please enter your comment first.</p>
      </div>
      <h3>Comments</h3>
      {[...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => 
        <div key={comment.id} className="eachCommentDiv">
          {<CommentList comment={comment} user={user} fetchComments={() => fetchComments()}/>}
        </div>
      )}
      
    </div>
  )
}

export default Comment