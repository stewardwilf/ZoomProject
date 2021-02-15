//libraries/css
import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import './participant.css';

//shared states
import { filteredParticipants } from '../data/filteredParticipants'; //Array of all objects - filtered by text entered
import { selectedParticipants } from '../data/selectedParticipants'; //Array of pinned participant objs
import { selectedIds } from '../data/selectedIds'; //Array of IDs for pinned participants
import { config } from '../data/config'; //bool - true for pinned, false for grid

//components/ functions
import { Participant } from './Participant';
import { rename } from './Zoom';

export const ParticipantList = () => {
    const [editingId, setEditingId] = useState(-1);
    const [participantsData] = useRecoilState(filteredParticipants);
    const [newName, setNewName] = useState('');
    const [cf,] = useRecoilState(config);
    const [selectedIDs,setSelectedIds ] = useRecoilState(selectedIds);

    const [selected, setSelected] = useRecoilState(selectedParticipants);
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
        let removalAllClick
        if (selectedIDs.length>1){
            removalAllClick = document.querySelector("#wc-container-left > div.full-screen-icon > div > ul > li:nth-child(6) > a")
        }
        else {
            removalAllClick = document.querySelector("#wc-container-left > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div.video-avatar__group > button")
        }
        removalAllClick.click()
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


