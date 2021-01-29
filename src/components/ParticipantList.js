import React, { useState, useEffect } from 'react'
import { Button, Icon, Input, Form, List } from 'semantic-ui-react'
import { useRecoilState } from 'recoil'
import { Container, Draggable } from 'react-smooth-dnd';
import { selected as selectedp } from '../data/selected'
import { muteIndiv, rename } from './Zoom'
import { displayed } from '../data/displayedParticipants'

export const ParticipantList = () => {
    const [selected, setSelected] = useRecoilState(selectedp);
    const [participantsData] = useRecoilState(displayed);
    const [showSelected, setShowSelected] = useState(false);

    const [editingId, setEditingId] = useState(0)
    const [oldName, setOldName] = useState('')
    const [newName, setNewName] = useState('')


    useEffect(() => {
        console.log('editingId Change', editingId, oldName, newName)
    }, [editingId]
    );

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

    const Selected = () => {
        return (
            <Button.Group fluid basic vertical className='ParticipantButtons'>
                <Container dragHandleSelector=".column-drag-handle" onDrop={e => reorderSelection(e)}>
                    {selected.map((p) => {
                        return (
                            <Draggable key={p.userId}>
                                <Button className="draggable-item" active={true}>
                                    <span className="column-drag-handle">
                                        <div className='left'>
                                            <Icon name='edit' />
                                            {p.userName}
                                        </div>
                                        <div className='right'>
                                            <Icon name={p.muted ? 'mute' : 'unmute'} />
                                        &#x2630;
                                    </div>
                                    </span>
                                </Button>
                            </Draggable>
                        );
                    })}
                </Container>
            </Button.Group>
        )
    }

    const resetEditingFields = () => {
        setEditingId(0);
        setNewName('');
        setOldName('');
    }
    const sendDataOffToZoom = () => {
        rename(editingId, oldName, newName);
        resetEditingFields();
    }

    const setData = (person) => {
        resetEditingFields()
        setEditingId(person.userId)
        setOldName(person.userName)
    }

    const InputForm = (person) => {
        return (
            <Form onSubmit={() => sendDataOffToZoom()}>
                <Form.Group>
                    <Form.Input
                        key={'key' + person.userId}
                        onChange={(e) => setNewName(e.target.value)}
                        value={newName}
                    />
                    <Form.Button content='Submit' />
                </Form.Group>
            </Form>)
    }
    const Selector = () => {
        return (
            <List divided>
                {participantsData.map((person) =>

                    <List.Item key={person.userId}>
                        <div className='left'>

                            <Button icon='edit' onClick={() => setData(person)}></Button>
                            {parseInt(editingId) === parseInt(person.userId) ?
                                <InputForm person={person}></InputForm>
                                : ''
                            }
                            {person.userName}
                        </div>
                        <div className='right'>
                            <Button.Group>
                                <Button
                                    icon
                                    onClick={() => { select(person) }}
                                //active={selected.filter((item) => item.userId === person.userId).length != 0 ? true : false}
                                >
                                    <Icon
                                        name={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'remove circle' : 'add circle'} //set to change dynamically
                                        color={selected?.filter((sel) => sel.userId === person.userId).length > 0 ? 'red' : 'green'}>
                                    </Icon>
                                </Button>
                                <Button icon>
                                    <Icon
                                        name={person.muted ? 'mute' : 'unmute'} onClick={() => muteIndiv(person.userId, person.muted ? false : true)}
                                        color={person.muted ? 'red' : 'green'} onClick={() => muteIndiv(person.userId, person.muted ? false : true)}
                                    ></Icon>
                                </Button>
                            </Button.Group>
                        </div>
                    </List.Item>


                )}
            </List>
        )
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

    return (
        <>
            <Button onClick={() => show()}>{showSelected ? 'Show All' : 'Show Selected'}</Button>
            {selected.length > 0 ? <Button color='red' onClick={() => clearSelected()}>Clear Selection</Button> : <></>}
            { showSelected ? <Selected /> : <Selector />}
        </>)
}
