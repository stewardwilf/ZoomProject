import { displayed } from '../data/displayedParticipants';
import { Participant } from './Participant';
import './participant.css';
import React, { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useRecoilState } from 'recoil'
import { selectedAll } from '../data/selectedAll'
import { selected as selectedids } from '../data/selected'

import { rename } from './Zoom'
import { config } from '../data/config'
//participants-items__buttons

export const ParticipantList = () => {
    const [editingId, setEditingId] = useState(-1);
    const [participantsData] = useRecoilState(displayed);
    const [newName, setNewName] = useState('');
    const [cf,] = useRecoilState(config);
    const [,setSelectedIds ] = useRecoilState(selectedids);

    const [selected, setSelected] = useRecoilState(selectedAll);
    const [showSelected, setShowSelected] = useState(false);

    const renamePerson = () => {
        //Goes off the assumption editingId is selected at the point of running. You could pass in ID as param.
        var userObj = participantsData.find(x => x.userId === editingId);
        (userObj)
            ?

            rename(userObj.userId, userObj.userName, newName)
            :
            console.log("User not found. Handle error. Maybe they're clicking save when somehow when editingId is -1 or something or maybe even the person has left the call and is no longer in participantsData")

        setEditingId(-1);
        setNewName('');
    }

    const handleSetEditId = (newId) => {
        (editingId !== newId) ? setEditingId(newId) : setEditingId(-1);
        //So it doesnt carry over from previous incomplete edit
        setNewName('');
    }

    // const select = (name) => { //select individuals from list
    //     if ((selected.filter((item) => item.userId === name.userId)).length < 1) {
    //         setSelected([...selected, name])
    //     }
    //     else {
    //         setSelected(selected.filter((item) => item.userId !== name.userId))
    //     }
    // }


    const show = () => {
        if (showSelected) {
            setShowSelected(false)
        }
        else {
            setShowSelected(true)
        }
    }
    const clearSelected = () => {
        setSelected([])
        setSelectedIds([])
    }


    const Selected = () => {
        return (
            <>
                {selected?.map((person,index) => { 
                   
                    return (
                        <div className='participant-container' key={person.userId} >
                        <Icon
                            name='edit'
                            onClick={() => handleSetEditId(person.userId)}>
                        </Icon>
                        <Participant
                            idx = {index}
                            id={person.userId}
                            originalName={person.userName}
                            muted={person.muted}
                            isHost={person.isHost}
                            editMode={(editingId === person.userId)}
                            newName={newName}
                            setNewName={setNewName}
                            saveNewName={renamePerson}
                            cf={cf}
                        />

                    </div>
                    );
                })}
            </>
        )
    }


    return (
        <>
            {cf?<Button onClick={() => show()}>{showSelected ? 'Show All' : 'Show Selected'}</Button>:''}
            {selected.length > 0 ? <Button color='red' onClick={() => clearSelected()}>Clear Selection</Button> : <></>}
            { showSelected ? <Selected /> :
                participantsData?.map((person, index) =>
                    <div className='participant-container' key={person.userId} >
                        <Icon
                            name='edit'
                            onClick={() => handleSetEditId(person.userId)}>
                        </Icon>
                        <Participant
                            idx = {index}
                            id={person.userId}
                            originalName={person.userName}
                            muted={person.muted}
                            isHost={person.isHost}
                            editMode={(editingId === person.userId)}
                            newName={newName}
                            setNewName={setNewName}
                            saveNewName={renamePerson}
                            cf={cf}
                        />

                    </div>
                )}
        </>)

}


