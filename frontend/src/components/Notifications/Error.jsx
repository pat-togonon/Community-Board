import { useSelector } from "react-redux"

const Error = () => {

  const errorMessage = useSelector(state => state.error)
  
  if (!errorMessage) {
    return null
  }

  return (
    <div className="errorStyle">
      {errorMessage}
    </div>
  )
}

export default Error