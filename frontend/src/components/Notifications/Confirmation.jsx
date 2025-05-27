import { useSelector } from "react-redux"

const Confirmation = () => {

  const confirmationMessage = useSelector(state => state.confirmation)
  
  if (!confirmationMessage) {
    return null
  }

  const confirmStyle = {
    color: 'green',
    fontSize: '1.2rem',
    padding: '15px'
  }

  return (
    <div style={confirmStyle}>
      {confirmationMessage}
    </div>
  )
}

export default Confirmation