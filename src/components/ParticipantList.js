import { displayed } from '../data/displayedParticipants';
import { Participant } from './Participant';
import './participant.css';
import React, { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useRecoilState } from 'recoil'
import { Container, Draggable } from 'react-smooth-dnd';
import { selected as selectedp } from '../data/selected'
import { rename } from './Zoom'

export const ParticipantList = () => {
    const [editingId, setEditingId] = useState(-1);
    const [participantsData] = useRecoilState(displayed);
    const [newName, setNewName] = useState('');

    const [selected, setSelected] = useRecoilState(selectedp);
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

    const select = (name) => { //select individuals from list
        if ((selected.filter((item) => item.userId === name.userId)).length < 1) {
            setSelected([...selected, name])
        }
        else {
            setSelected(selected.filter((item) => item.userId !== name.userId))
        }
    }

    const reorderSelection = (event) => { //reorder selection on drag
        let copy = [...selected]
        copy.splice(event.removedIndex, 1); //remove one item where we pick element from
        copy.splice(event.addedIndex, 0, selected[event.removedIndex]); //add removed item to new position
        setSelected(copy)
    }
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
    }
    const Selected = () => {
        return (
            <Container dragHandleSelector=".column-drag-handle" onDrop={e => reorderSelection(e)}>
                {selected?.map((person) => {
                    return (
                        <Draggable key={person.userId}>
                                <span className="column-drag-handle">
                                    <div className='participant-container' key={person.userId} >
                                        <Icon
                                            name='edit'
                                            onClick={() => handleSetEditId(person.userId)}>
                                        </Icon>
                                        <Participant
                                            id={person.userId}
                                            originalName={person.userName}
                                            muted={person.muted}
                                            isHost={person.isHost}
                                            editMode={(editingId === person.userId)}
                                            newName={newName}
                                            setNewName={setNewName}
                                            saveNewName={renamePerson}
                                        />


                                        <Icon
                                            name={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'remove circle' : 'add circle'} //set to change dynamically
                                            color={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'red' : 'green'}
                                            onClick={() => { select(person) }}>
                                        </Icon>
                                        <div className='right'>
                                        &#x2630;
                                    </div>
                                    </div>

                                </span>
                        </Draggable>
                    );
                })}
            </Container>
        )
    }


    return (
        <>
            <Button onClick={() => show()}>{showSelected ? 'Show All' : 'Show Selected'}</Button>
            {selected.length > 0 ? <Button color='red' onClick={() => clearSelected()}>Clear Selection</Button> : <></>}
            { showSelected ? <Selected /> :
                participantsData?.map((person) =>
                    <div className='participant-container' key={person.userId} >
                        <Icon
                            name='edit'
                            onClick={() => handleSetEditId(person.userId)}>
                        </Icon>
                        <Participant
                            id={person.userId}
                            originalName={person.userName}
                            muted={person.muted}
                            isHost={person.isHost}
                            editMode={(editingId === person.userId)}
                            newName={newName}
                            setNewName={setNewName}
                            saveNewName={renamePerson}
                        />


                        <Icon
                            name={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'remove circle' : 'add circle'} //set to change dynamically
                            color={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'red' : 'green'}
                            onClick={() => { select(person) }}>
                        </Icon>
                    </div>
                )}
        </>)

}


