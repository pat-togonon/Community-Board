import { getCommunities } from '../service/community'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCommunityId } from '../reducer/communityIdReducer'

const CommunityOption = () => {
  const [communityList, setCommunityList] = useState([])
  
  const dispatch = useDispatch()
  const communityId = useSelector(state => state.communityId)

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    const list = await getCommunities()
    //const approvedList = list.filter(c => c.isApproved)
    setCommunityList(list)
  }
    
  const handleSelected = (event) => {
    const commId = event.target.value
    dispatch(setCommunityId(commId))
  }

  return (
    <div>
      local community: 
      <select value={communityId} onChange={handleSelected} id="community" name="community">
        <option value="">Select a local community</option>
        {communityList.map((community) => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))}
      </select>
    </div>
    )
    
}

export default CommunityOption