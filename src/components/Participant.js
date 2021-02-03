import "./participant.css";
import { Icon,  Form } from 'semantic-ui-react'
import { muteIndiv } from './Zoom'

export const Participant = ({ id, originalName, muted, isHost, editMode, newName, setNewName, saveNewName }) => {
    return (
        <div className='participant'>
            <div className='left'>
                {
                    (editMode) ?
                        <div className='edit-form'>

                            <p><b>Name: </b> {originalName}</p>

                            <Form onSubmit={() => saveNewName()}>
                                <Form.Group>
                                    <Form.Input
                                        placeholder={originalName}
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                    <Form.Button content='Submit' />
                                </Form.Group>
                            </Form>
                        </div>
                        :
                        <p className='name'><b>Name: </b> {originalName}</p>
                }
            </div>
            <div className='right'>
                {
                    (isHost) ? <b>Host</b> : 'Guest'
                }
                <Icon
                    name={muted ? 'mute' : 'unmute'}
                    color={muted ? 'red' : 'green'}
                    onClick={() => muteIndiv(id, muted ? false : true)}
                    size='large'
                ></Icon>
            </div>
        </div>
    )
}