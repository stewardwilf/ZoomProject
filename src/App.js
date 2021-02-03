import './App.css';
import { Zoom, Head, Preview, SearchBar, ParticipantList } from './components/index'
import { useRecoilState } from 'recoil'
import { meetingStarted as ms } from './data/meetingStarted'

function App() {
  const [meetingStarted] = useRecoilState(ms)
  return (
    <div className="App">
    {meetingStarted ? <div>
        <Head></Head>
        <Preview></Preview>

        <div className="ParticipantContainer">
          <SearchBar></SearchBar>
          <div className="Participants">
            <ParticipantList></ParticipantList>
          </div>
        </div>
      </div> : <Zoom></Zoom>}
      
      
      
    </div>
  )
}

export default App;


