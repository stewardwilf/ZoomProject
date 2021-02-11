//imports
import { Form, Radio } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil'
import { meetingStarted as ms } from '../data/meetingStarted'
import { config } from '../data/config'

// declare zoommtg inst and config
declare var ZoomMtg
ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

//set zmmtg-root as hidden by default
const zoomMeeting = document.getElementById("zmmtg-root")
const turnItOff = () => {
    zoomMeeting.style.display = 'none'
    zoomMeeting.style.height = '0px'
    zoomMeeting.style.width = '0px'
    zoomMeeting.style.position = 'relative'
    zoomMeeting.style.backgroundColor = 'black'
    zoomMeeting.style.zIndex = '1'
}

//meeting config
var meetingNumber = ''
var password = ''
var userName = ''
var signatureEndpoint = 'http://localhost:4000'
var apiKey = 'IEocUyyPQXCyN1Mnn6ztzg'
var role = 1
var leaveUrl = 'http://localhost:3000'
var userEmail = ''

//export zoom specific functions
export const muteIndiv = (id, bool) => {
    console.log('Muting', id)
    ZoomMtg.mute({
        userId: id,
        mute: bool
    });
}

export const rename = (id, oldname, newname) => {
    console.log('renaming: ', oldname, ' as: ', newname, 'id', id)
    ZoomMtg.rename({
        userId: id,
        oldName: oldname,
        newName: newname
    });
}

export const leave = () => {

    ZoomMtg.leaveMeeting({
        leaveUrl: leaveUrl,
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
export const accessParticipants = () => {
    let results = null
    ZoomMtg.getAttendeeslist({
        success: function (res) {
            results = res.result.attendeesList
        }
    })
    return (results)
}

//zoom component
export const Zoom = () => {
    const [settings, setSettings] = useState({ 'meetingNumber': '', 'password': '', 'userName': '' });
    const [, setMeetingStarted] = useRecoilState(ms)
    const [cf, setCF] = useRecoilState(config)

    useEffect(() => {
        meetingNumber = settings.meetingNumber
        password = settings.password
        userName = settings.userName
    }, [settings]
    );

    //get signature from localhost4000
    function getSignature(e) {
        e.preventDefault();

        fetch(signatureEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meetingNumber: meetingNumber,
                role: role
            })
        }).then(res => res.json())
            .then(response => {
                startMeeting(response.signature)
            }).catch(error => {
                console.error(error)
            })
    }

    //init and join meeting
    function startMeeting(signature) {
        turnItOff()

        ZoomMtg.init({
            leaveUrl: leaveUrl,
            isSupportAV: true,
            success: (success) => {
                console.log(success)
                setMeetingStarted(true)
                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    userName: userName,
                    apiKey: apiKey,
                    userEmail: userEmail,
                    passWord: password,
                    success: (success) => {
                        console.log(success)
                    },
                    error: (error) => {
                        console.log(error)
                    }
                })
            },
            error: (error) => {
                console.log(error)
            }

        })
    }
    const handleChange = (e, { name, value }) => {
        setSettings({ ...settings, [name]: value })
    }
    const handleChangeR = (bool) => {
        setCF(bool)
    }
    //return JSX to handle meeting number/ password/ username and start meeting
    return (
        <div className="Zoom">
            <main>
                <h1 className='central'>Sky Video Conferencing</h1>
                <Form onSubmit={getSignature} className='central'>
                    <Form.Input
                        placeholder='Meeting Number'
                        name='meetingNumber'
                        onChange={handleChange}
                    />
                    <Form.Input
                        placeholder='Meeting Password'
                        name='password'
                        onChange={handleChange}
                    />
                    <Form.Input
                        placeholder='Username'
                        name='userName'
                        onChange={handleChange}
                    />
                    <Form.Field>
                        <Radio
                            label='Pin Selector'
                            name='radioGroup'
                            value='this'
                            checked={cf}
                            onChange={()=>handleChangeR(true)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Grid View'
                            name='radioGroup'
                            value='that'
                            checked={!cf}
                            onChange={()=>handleChangeR(false)}
                        />
                    </Form.Field>
                    <Form.Button content='Submit' />
                </Form>
            </main>
        </div>
    );
}
