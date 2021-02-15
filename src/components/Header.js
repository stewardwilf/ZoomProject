//libraries/ css
import { Button } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { useRef, useEffect, useState } from 'react';

//shared states
import { selectedIds } from '../data/selectedIds'; //Array of IDs for pinned participants
import { config } from '../data/config'; //bool - true for pinned, false for grid
import { selectedParticipants } from '../data/selectedParticipants'; //Array of pinned participant objs
import { liveParticipants } from '../data/liveParticipants'; //Array of all participants, never filtered

//components/ functions
import { leave, accessParticipants } from './Zoom';

export const Head = () => {
    const [, setLiveP] = useRecoilState(liveParticipants);
    const [hideSpeakerView, setHideSpeakerView] = useState(false);
    //const [gridViewToggle, setGridViewToggle] = useState(false);
    const [, setSelectedAllArray] = useRecoilState(selectedParticipants);
    const [selected, ] = useRecoilState(selectedIds);
    const [cf,] = useRecoilState(config);
    //const [displayedP,setDisplayedP] = useRecoilState(displayed);

    function HeartBeat() {
        useInterval(() => {
            // Your custom logic here
            const ap = accessParticipants()
            
            ap?.splice(ap.findIndex(i=>i.isHost),1) //remove host from participants

            setLiveP(ap);

            //const userIdsForDisplayed = displayedP.map(each=>{return each.userId})
            //console.log(userIdsForDisplayed.map(id=>ap.filter(eachAP=>{return eachAP.userId===id})))
            //setDisplayedP(ap);

            setSelectedAllArray(selected.map((sel) => ap.find(x => x.userId === sel)))
            if (!hideSpeakerView && ap?.length > 0) {

                try {
                    hideSpeaker()
                    setHideSpeakerView(true)

                } catch (error) {
                    console.log('failed, will retry next heartbeat')
                    setHideSpeakerView(false)
                }
                if (!cf) {
                    gallery()
                    hideBottomFurniture()                
                }
                if (cf){
                    hideBottomFurniture()
                }
            }

        }, 5000);
        return ('')
    }
    const hideBottomFurniture = () => {
        const joinSettings = document.querySelector("#zmmtg-root > div > div > div > div > div > div.join-dialog")
        const footer = document.querySelector("#wc-footer")
        const greenTick = document.querySelector("#wc-content > div.meeting-info-container")
        const viewButton = document.querySelector("#wc-container-left > div.full-screen-icon")
        hideElement(joinSettings)
        hideElement(footer)
        hideElement(greenTick)
        hideElement(viewButton)
    }

    const hideElement=(el)=>{
        el.style.display = 'none'
        el.style.display = 'none'
        el.style.height = '0px'
        el.style.width = '0px'
        el.style.position = 'relative'
        el.style.backgroundColor = 'black'
        el.style.zIndex = '1'
    }
    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    const zoomMeeting = document.getElementById("zmmtg-root")
    const turnItOff = (e) => {
        e.preventDefault()
        zoomMeeting.style.display = 'none'
        zoomMeeting.style.height = '0px'
        zoomMeeting.style.width = '0px'
        zoomMeeting.style.position = 'relative'
        zoomMeeting.style.backgroundColor = 'black'
        zoomMeeting.style.zIndex = '1'
    }
    const turnItOn = (e) => {
        e.preventDefault()
        zoomMeeting.style.marginTop = '85px !important'
        zoomMeeting.style.display = 'flex'
        zoomMeeting.style.height = '80%'
        zoomMeeting.style.width = '100%'
        zoomMeeting.style.position = 'fixed'
        zoomMeeting.style.zIndex = '1'
        zoomMeeting.style.backgroundColor = 'black'
    }

    const hideSpeaker = () => {
        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(1) > div > div")
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.
            const hideSelfViewButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(1) > div > div:nth-child(3) > div > div > ul > li:nth-child(8) > a")
            hideSelfViewButton.click()
        }
    }

    const gallery = () => {
        let galleryButton = document.querySelector("#wc-container-left > div.full-screen-icon > div > ul > li:nth-child(2) > a")
        galleryButton.click()
    }


    return (
        <header className='Header'>
            <HeartBeat></HeartBeat>


            <div className='left'>

                <Button onClick={turnItOff}>
                    Hide Zoom Window
                </Button>

                <Button onClick={turnItOn}>
                    Show Zoom Window
                </Button>

                <Button color='red' onClick={() => leave()}>
                    Leave Meeting
                </Button>

            </div>
            <div className='center'>         <h1 >Zoom App</h1>
            </div>
        </header>
    );
};
