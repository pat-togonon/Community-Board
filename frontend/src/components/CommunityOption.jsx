import { getCommunities } from '../service/community'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCommunityId } from '../reducer/communityIdReducer'
import { Link } from 'react-router-dom'

const CommunityOption = () => {
  const [communityList, setCommunityList] = useState([])
  
  const dispatch = useDispatch()
  const communityId = useSelector(state => state.communityId)

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    const list = await getCommunities()
    const approvedList = list.filter(c => c.isApproved)
    setCommunityList(approvedList)
  }
    
  const handleSelected = (event) => {
    const commId = event.target.value
    dispatch(setCommunityId(commId))
  }

  return (
    <div className="loginContainerChild communityOptionDiv">
      <label htmlFor="localCommunity" className="loginContainerChild localCommHeader">local community:<span className='required'>*</span> </label>      
      <select value={communityId} onChange={handleSelected} id="localCommunity" name="community" className="loginContainerChild">
        <option value="">Select your local community</option>
        {communityList.map((community) => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))}
      </select>
      <span className='registerCommunity'><Link to='/register-a-community'>Register a community →</Link></span>
    </div>
    )
    
}

export default CommunityOption