import "./participant.css";
import { Icon, Form } from 'semantic-ui-react'
import { muteIndiv } from './Zoom'
import { accessParticipants } from './Zoom'
import { selected as selectedp } from '../data/selected'
import { useRecoilState } from 'recoil'
import { liveParticipants } from "../data/liveParticipants";
import { selectedAll } from '../data/selectedAll'

export const Participant = ({ idx, id, originalName, muted, isHost, editMode, newName, setNewName, saveNewName, cf }) => {
    const [selected, setSelected] = useRecoilState(selectedp);
    const [liveP, ] = useRecoilState(liveParticipants);
    const [selectedAllState, ] = useRecoilState(selectedAll);


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

    function simulateMouseoverUnpin(index) {
        //const num = index+1        
        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(" + index + ") > div")
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.
        }
    }

    const handlePin = (id, idx) => {
        //is this in selected?
        //if yes:
        //calculate relevant number = ???
        //unpin relevant number from middle canvas


        if (selected.includes(id)) {
            setSelected([...selected.filter(item => item !== id)]);
            const index = selectedAllState.findIndex(i => i.userId === id) + 1
            simulateMouseoverUnpin(index)
            let pinButton
            if (index > 1) {
                pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(" + index + ") > div > div:nth-child(4) > div > div > ul > li:nth-child(5) > a")
            }
            else {
                pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div.video-avatar__group > button")
            }
            pinButton.click()
        }
        if (!selected.includes(id)) {
            setSelected([...selected, id])

            let notSelected = liveP.filter(x => !selectedAllState.includes(x));
            let removalIndex = (notSelected.findIndex(each => each.userId === id))
            let finalIndex = notSelected.length - removalIndex
            console.log(finalIndex)

            simulateMouseover(finalIndex)
            let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(" + finalIndex + ") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
            pinButton.click()
        }

        //const ap = accessParticipants()
        //console.log('aplen',ap.length,'index',index, 'selectedlen',selected.length)

        // const num = ap.length + 1 - index 
        // simulateMouseover(num)
        // let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child("+num+") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
        // pinButton.click()        
    }

    // const unpin = (index, id) => {
    //     setSelected([...selected.filter(item => item !== id)])
    //     const ap = accessParticipants()
    //     const num = ap?.length + 1 - index
    //     simulateMouseover(num)
    //     let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child("+num+") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
    //     pinButton.click()
    // }

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