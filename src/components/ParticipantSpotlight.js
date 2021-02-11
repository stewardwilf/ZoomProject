import "./participant.css";
import { Icon,  Form } from 'semantic-ui-react'
import { muteIndiv } from './Zoom'

export const Participant = ({ idx, id, originalName, muted, isHost, editMode, newName, setNewName, saveNewName }) => {
    function simulateMouseover(index) {

        console.log('Sim Mouse El:',document.getElementById("participants-list-"+index),"participants-list-"+index)
        const event = new MouseEvent('mouseover', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        const cb = document.getElementById("participants-list-"+index);
        const cancelled = !cb.dispatchEvent(event);
      
        if (cancelled) {
          // A handler called preventDefault.
          alert("cancelled");
        } else {
          // None of the handlers called preventDefault.
      
        }
      }
    
    const spotlight = (index) => {
        console.log('spotlightButton',"#participants-list-"+index+" > div.participants-item__buttons > div > div > div > ul > li:nth-child(2) > a",document.querySelector("#participants-list-"+index+" > div.participants-item__buttons > div > div > div > ul > li:nth-child(4) > a"))
        //for host document.querySelector("#participants-list-"+index+" > div.participants-item__buttons > div > div > div > ul > li:nth-child(2) > a")
        //for non host document.querySelector("#participants-list-"+index+" > div.participants-item__buttons > div > div > div > ul > li:nth-child(4) > a")
        let spotlightButton = document.querySelector("#participants-list-"+index+" > div.participants-item__buttons > div > div > div > ul > li:nth-child(4) > a")
        spotlightButton.click()
    }
    
    return (
        <div className='participant'> 
            <div className='left'>
                {
                    (editMode) ?
                        <div className='edit-form'>

                            <p><b>Name: </b> {originalName}</p>

                            <Form onSubmit={() => saveNewName()}>
                                <Form.Group>
                                    <Form.Input
                                        placeholder={originalName}
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                    <Form.Button content='Submit' />
                                </Form.Group>
                            </Form>
                        </div>
                        :
                        <p className='name'><b>Name: </b> {originalName}</p>
                }
            </div>
            <div className='right'>
                {
                    (isHost) ? <b>Host</b> : 'Guest'
                }
                <Icon
                    name={muted ? 'mute' : 'unmute'}
                    color={muted ? 'red' : 'green'}
                    onClick={() => muteIndiv(id, muted ? false : true)}
                    size='large'
                ></Icon>
                <Icon
                    name={'eye'}
                    onClick={() => simulateMouseover(idx)}
                    size='large'
                ></Icon>
                <Icon
                    name={'lightbulb'}
                    onClick={() => spotlight(idx)}
                    size='large'
                ></Icon>
            </div>
        </div>
    )
}