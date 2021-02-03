import { Button } from 'semantic-ui-react';
import { leave, accessParticipants } from './Zoom'
import { meetingStarted as ms } from '../data/meetingStarted'
import { liveParticipants } from '../data/liveParticipants'
import { useRecoilState } from 'recoil'
import {useRef, useEffect, useState} from 'react'

export const Head = () => {
   
    const [, setLiveP] = useRecoilState(liveParticipants);

    function Counter() {

        useInterval(() => {
            // Your custom logic here
            setLiveP(accessParticipants());
        }, 1000);
        return('')
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



    return (
        <header className='Header'>
            <Counter></Counter>
            <div className='center'>         <h1 >Zoom App</h1>
            </div>
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

        </header>
    );
};
