//libraries/css
import "./participant.css";
import { Icon, Form } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';

//shared states
import { selectedIds } from '../data/selectedIds'; //Array of IDs for pinned participants
import { liveParticipants } from "../data/liveParticipants"; //Array of all participants, never filtered
import { selectedParticipants } from '../data/selectedParticipants'; //Array of pinned participant objs

//components/ functions
import { muteIndiv, accessParticipants } from './Zoom';

export const Participant = ({ idx, id, originalName, muted, isHost, editMode, newName, setNewName, saveNewName, cf }) => {
    const [selected, setSelected] = useRecoilState(selectedIds);
    const [liveP,] = useRecoilState(liveParticipants);
    const [selectedAllState,] = useRecoilState(selectedParticipants);


    function simulateMouseover(index) {
        //const num = index+1        
        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(" + index + ") > div > div > span")
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.
        }
    }
    // first document.querySelector("#wc-container-left > div.main-layout > div > div > div > div:nth-child(2) > div")
    // second document.querySelector("#wc-container-left > div.main-layout > div > div > div > div:nth-child(3) > div")
    
    function simulateMouseoverUnpin(bool,idx) {

        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        let cb
        if (bool) {
            //if there are non-pinned elements       
              
            cb = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child("+idx+") > div")
            //document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div > div")
           // document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(1) > div")
            //document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2) > div")
        }                               
        if (!bool) {
            //if there are no non-pinned elements
            cb = document.querySelector("#wc-container-left > div.main-layout > div > div > div > div:nth-child("+idx+") > div")
        }


        console.log('cb', cb)
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.
        }

    }

    const handlePin = (id, idx) => {

        if (selected.includes(id)) { //if id is currently pinned

            setSelected([...selected.filter(item => item !== id)]); //update selectedids
            let pinButton
          
            if (selected.length > 1) {// if there are more than one participant pinned
                let bool = (liveP.length - selected.length) > 0 ? true : false
                let newidx

                if (bool){   
                    //if there are non-pinned elements   

                    let allIds = liveP.map(each=> each.userId) //all ids for all participants
                    const selectedOrdered = allIds.filter(value => selected.includes(value)); // all ids that have been selected in the correct index order
                    newidx = selectedOrdered.findIndex((element) => element === id)+1 // index of the current id in ids that have been selected, in order
                    simulateMouseoverUnpin(bool,newidx)
                    pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child("+newidx+") > div > div:nth-child(4) > div > div > ul > li:nth-child(5) > a")
                }
                if (!bool){
                    //if there are no non-pinned elements
                    newidx = idx+2
                    simulateMouseoverUnpin(bool,newidx)
                    pinButton = document.querySelector("#wc-container-left > div.main-layout > div > div > div > div:nth-child("+newidx+") > div > div:nth-child(4) > div > div > ul > li:nth-child(5) > a")
                }
            }
            else { //if there is only one pinned participant
                //unpin the only one pinned participant
                pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div.video-avatar__group > button")
            }
            console.log('pinbutton',pinButton)
            pinButton.click() //issues with the 
        }
        if (!selected.includes(id)) { //if id is not pinned
            setSelected([...selected, id])

            let notSelected = liveP.filter(x => !selectedAllState.includes(x));
            let removalIndex = (notSelected.findIndex(each => each.userId === id))
            let finalIndex = notSelected.length - removalIndex
  

            simulateMouseover(finalIndex)
            let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(" + finalIndex + ") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
            pinButton.click()
        }
      
    }

 

    return (
        <div className='participant'>
            <div className='left'>
                {
                    (editMode) ?
                        <div className='edit-form'>

                            <p><b>Name: </b> {originalName} </p>

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
                        <p className='name'><b>Name: </b> {originalName} </p>

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

                {
                    cf && accessParticipants().length > 2 ?
                        <Icon
                            name={'map pin'}
                            onClick={() => handlePin(id, idx)}
                            size='large'
                            color={selected.find(x => x === id) ? 'red' : 'green'}
                        ></Icon>
                        : ''
                }
            </div>
        </div>
    )
}