//libraries/css
import { Input } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';

//shared states
import { liveParticipants } from '../data/liveParticipants'; //Array of all participants, never filtered
import { filteredParticipants } from '../data/filteredParticipants'; //Array of all objects - filtered by text entered


export const SearchBar = () => {
  const [, setDisplayed] = useRecoilState(filteredParticipants);
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