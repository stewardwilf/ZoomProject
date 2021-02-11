import { Input } from 'semantic-ui-react'
import { liveParticipants } from '../data/liveParticipants'
import { displayed } from '../data/displayedParticipants'
import { useRecoilState } from 'recoil'

export const SearchBar = () => {
  const [, setDisplayed] = useRecoilState(displayed);
  const [participantsData] = useRecoilState(liveParticipants);


  const handleChange = (e) => {
    const source = participantsData

    console.log(source)

    console.log('event:',e.target.value)
    console.log('search results',source?.filter(item => (item.userName).toLowerCase().includes((e.target.value).toLowerCase())))
    if (e.target.value.length>0){
      setDisplayed(source.filter(item => (item.userName).toLowerCase().includes((e.target.value).toLowerCase())))
    }
    else {
      setDisplayed(source)
    }
  }
  return (
    <div>
      <Input className='SearchBar' placeholder='Filter...' onChange={e => handleChange(e)}/>
    </div>

  )
}