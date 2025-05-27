import { useSelector } from "react-redux"

const Error = () => {

  const errorMessage = useSelector(state => state.error)
  
  if (!errorMessage) {
    return null
  }

  const errorStyle = {
    color: 'red',
    fontSize: '1.2rem'
  }

  return (
    <div style={errorStyle}>
      {errorMessage}
    </div>
  )
}

export default Error