import './App.css';
import { Zoom, Head, Preview, SearchBar, ParticipantList } from './components/index'

function App() {
  return (
    <div className="App">
    
      <Zoom></Zoom>
      
      <div>
        <Head></Head>
        <Preview></Preview>

        <div className="ParticipantContainer">
          <SearchBar></SearchBar>
          <div className="Participants">
            <ParticipantList></ParticipantList>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;


