import { Button } from 'semantic-ui-react';
import { leave, accessParticipants } from './Zoom'
import { liveParticipants } from '../data/liveParticipants'
import { useRecoilState } from 'recoil'
import { useRef, useEffect, useState } from 'react'

export const Head = () => {
    const [pinAllToggle, setPinAllToggle] = useState(false);
    const [numPinned, setNumPinned] = useState(0)
    const [liveP, setLiveP] = useRecoilState(liveParticipants);

    useEffect(() => {
        // Update the document title using the browser API
        console.log('change in liveP')
    }, [liveP]);

    function HeartBeat() {
        useInterval(() => {
            // Your custom logic here
            const ap = accessParticipants()
            setLiveP(ap);

            if ((liveP.length < ap.length) && pinAllToggle === true) {
                pin(ap.length-liveP.length)        
                console.log('participant joined')
            }
            if ((liveP.length > ap.length) && pinAllToggle === true) {
                setNumPinned(ap.length-1)      //set num of pins to number of people left - host
                console.log('person left, new num pinned: ', ap.length-1)
            }

        }, 5000);
        return ('')
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
        zoomMeeting.style.marginTop = '50px'
        zoomMeeting.style.display = 'flex'
        zoomMeeting.style.height = '90%'
        zoomMeeting.style.width = '100%'
        zoomMeeting.style.position = 'fixed'
        zoomMeeting.style.zIndex = '1'
        zoomMeeting.style.backgroundColor = 'black'
    }


    const gallery = () => {
        let galleryButton = document.querySelector("#wc-container-left > div.full-screen-icon > div > ul > li:nth-child(2) > a")
        galleryButton.click()
        let participantsButton = document.querySelector("#wc-footer > div > div:nth-child(2) > button:nth-child(2)")
        participantsButton.click()
    }

    function simulateMouseover() {
        console.log('herererere', document.querySelector("#participants-list-0"))
        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.querySelector("#participants-list-0");
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.

        }
    }

    const spotlight = (index) => {

        console.log('Sim Mouse El:', document.getElementById("participants-list-" + index), "participants-list-" + index)
        const event = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.getElementById("participants-list-" + index);
        const cancelled = !cb.dispatchEvent(event);

        if (cancelled) {
            // A handler called preventDefault.
            alert("cancelled");
        } else {
            // None of the handlers called preventDefault.

        }
    }

    const pinAll = () => {
        if (pinAllToggle === false) {
            setPinAllToggle(true)
            pin(0)
        }
        else {
            setPinAllToggle(false)
            setNumPinned(0)
            const viewButton = document.querySelector("#wc-container-left > div.full-screen-icon > div > button")
            viewButton.click()
            const removePinsButton = document.querySelector("#wc-container-left > div.full-screen-icon > div > ul > li:nth-child(4) > a")
            removePinsButton.click()
        }
    }

    const pin = (newUser) => {
        let numberParticipants = 0
        newUser===0 ? numberParticipants = (liveP.length ) - (1 - numPinned) : numberParticipants = newUser

        console.log('num to be pinned',numberParticipants)

        for (var i = 0; i < numberParticipants; i++) {
            setNumPinned(numPinned + 1)
            console.log(i)
            console.log('mouseover for pin', document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(2) > div"))
            const event = new MouseEvent('mouseover', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            const cb = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(2) > div");
            const cancelled = !cb.dispatchEvent(event);

            if (cancelled) {
                // A handler called preventDefault.
                alert("cancelled");
            } else {
                // None of the handlers called preventDefault.

            }
            let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child(2) > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
            pinButton.click()
        }
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

                <Button color='green' onClick={() => gallery()}>
                    gallery
                </Button>

                <Button color='green' onClick={() => simulateMouseover()}>
                    simulate hover
                </Button>

                <Button color='green' onClick={() => spotlight()}>
                    spotlight (Only works with video)
                </Button>

                <Button color='olive' onClick={() => pinAll()}>
                    {pinAllToggle ? 'UNPIN ALL GUESTS' : 'PIN ALL GUESTS'}
                </Button>
            </div>
            <div className='center'>         <h1 >Zoom App</h1>
            </div>
        </header>
    );
};
