
import { Form } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil'
import { meetingStarted as ms } from '../data/meetingStarted'
import {liveParticipants} from '../data/liveParticipants'
declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.6/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const zoomMeeting = document.getElementById("zmmtg-root")
const turnItOff = () => {
    zoomMeeting.style.display = 'none'
    zoomMeeting.style.height = '0px'
    zoomMeeting.style.width = '0px'
    zoomMeeting.style.position = 'relative'
    zoomMeeting.style.backgroundColor = 'black'
    zoomMeeting.style.zIndex = '1'
}

var meetingNumber = ''
var password = ''
var userName = ''
var signatureEndpoint = 'http://localhost:4000'
var apiKey = 'IEocUyyPQXCyN1Mnn6ztzg'
var role = 1
var leaveUrl = 'http://localhost:3000'
var userEmail = ''

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
    console.log('accessParticipants')
    let results = null
    ZoomMtg.getAttendeeslist({
        success: function (res) {
            results = res.result.attendeesList
        }
    })
    return (results)
}
export const Zoom = () => {
    const [settings, setSettings] = useState({ 'meetingNumber': '', 'password': '', 'userName': '' });
    const [, setLiveP] = useRecoilState(liveParticipants);
    const [, setMeetingStarted] = useRecoilState(ms)

    useEffect(() => {
        meetingNumber = settings.meetingNumber
        password = settings.password
        userName = settings.userName
    }, [settings]
    );

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

    const muteAll = () => {
        console.log('Mute all')
        ZoomMtg.muteAll({
            muteAll: true
        });
    }

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
                    <Form.Button content='Submit' />
                </Form>
            </main>
        </div>
    );
}
