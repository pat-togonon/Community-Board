import { useSelector } from "react-redux"

const Confirmation = () => {

  const confirmationMessage = useSelector(state => state.confirmation)
  
  if (!confirmationMessage) {
    return null
  }

  return (
    <div className="confirmStyle">
      {confirmationMessage}
    </div>
  )
}

export default Confirmation