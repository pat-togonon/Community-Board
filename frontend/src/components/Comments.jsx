import { useEffect, useState } from "react"
import { viewAllComments, postComment, updateComment, deleteComment} from "../service/comments"
import { useSelector, useDispatch } from "react-redux"
import { setComments } from "../reducer/commentsReducer"
import { notifyError } from "../reducer/errorReducer"


const CommentList = ({ comment, user, fetchComments }) => {
  const [hideComment, setHideComment] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editComment, setEditComment] = useState('')  
  const [hideButtons, setHideButtons] = useState(false)
  const [notDeleted, setNotDeleted] = useState(false)
  const [notEdited, setNotEdited] = useState(false)

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
    const updatedComment = {
      comment: editComment
    }

    try {
      await updateComment(comment.id, updatedComment)
      fetchComments()
      setHideComment(!hideComment)
      setShowEdit(!showEdit)
    } catch (_error) {
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
    } catch (_error) {
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

  const dateCommented = new Date(comment.createdAt).toLocaleString()

  //wait ah
  return (
    <div>
      <div style={commentStyle}>
        <span className="commentContent">{comment.comment}
        <p className="commentContent commenterAndDate">{comment.commenter ? comment.commenter.username : 'deletedAccount'} {dateCommented}</p>
        </span>
        {isUserTheCommenter
          ? <div className="editDeleteCommentButtons" style={editDeleteStyle}>
              <div role="button" onClick={() => handleEdit(comment)} id={`edit-comment-button-${comment.id}`}>Edit</div>
              <div role="button" onClick={() => setHideButtons(!hideButtons)} id={`delete-comment-button-${comment.id}`}>Delete</div>
            </div>
          : ''}
      </div>
      <div style={editStyle} className="editCommentDiv">
          <textarea value={editComment} onChange={({ target }) => setEditComment(target.value)} id={`edit-comment-textarea-${comment.id}`}/>
          <div>
            <button onClick={() => handleSaveUpdate(comment)} className="loginButton button" id={`save-edited-comment-button-${comment.id}`}>save</button>
            <button onClick={handleCancel} className="secondaryButton button">cancel</button>
          </div>
      </div>     
        <div className="deletePostDiv" style={deleteConfirmationStyle}>
          <h3>Are you sure you want to delete this comment?</h3>
          <div className="deletePostButtons">
            <button className="loginButton button" onClick={() => handleDelete(comment)} id={`confirm-comment-delete-button-${comment.id}`}>Yes</button>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id, updateComment, posts])

  const fetchComments = async () => {
    try {
      const allComments = await viewAllComments(communityId, mainCategory, subCategory, id)
      dispatch(setComments([...allComments]))
    } catch (_error) {
      dispatch(notifyError("Oops! Error loading comments. Please try again later.", 5))
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

    } catch (_error) {
      dispatch(notifyError("Oops! Couldn't post your comments right now. Please try again later.", 7))
    }

    setNewComment('')
  }
    
  const commentErrorStyle = {
    display: showCommentError ? '' : 'none'
  }

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