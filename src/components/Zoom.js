
import { Form } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil'
import { liveParticipants } from '../data/liveParticipants'
import { Button } from 'semantic-ui-react'
import Heartbeat from 'react-heartbeat';

declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.6/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

var meetingNumber = ''
var password = ''
var userName = ''
var signatureEndpoint = 'http://localhost:4000'
var apiKey = 'IEocUyyPQXCyN1Mnn6ztzg'
var role = 0
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
    console.log('renaming: ', oldname, ' as: ', newname)
    ZoomMtg.rename({
        userId: id,
        oldName: oldname,
        newName: newname
    });
}
export const Zoom = () => {
    const [settings, setSettings] = useState({ 'meetingNumber': '', 'password': '', 'userName': '' });
    const [liveP, setLiveP] = useRecoilState(liveParticipants);

    const accessParticipants = () => {
        console.log('hb')
        ZoomMtg.getAttendeeslist({


            success: function (res) {
                if (JSON.stringify(liveP) === JSON.stringify(res.result.attendeesList)) {
                    console.log('no change')
                }
                else {
                    console.log(res.result.attendeesList, liveP)

                    setLiveP(res.result.attendeesList)
                    console.log('change')
                }
            }
        })
    }
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
        document.getElementById('zmmtg-root').style.display = 'block'

        ZoomMtg.init({
            leaveUrl: leaveUrl,
            isSupportAV: true,
            success: (success) => {
                console.log(success)

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
        <div className="App">
            <main>
                <h1>Sky Video Conferencing</h1>
                <Form onSubmit={getSignature}>
                    <Form.Group>
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
                    </Form.Group>
                </Form>

                <Heartbeat heartbeatFunction={accessParticipants} heartbeatInterval={1000} />

            </main>
        </div>
    );
}
