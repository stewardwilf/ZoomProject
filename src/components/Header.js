import { Button } from 'semantic-ui-react';

export const Head = () => {
    const zoomMeeting = document.getElementById("zmmtg-root")
    
    const turnItOn = (e) => {
        e.preventDefault()
        zoomMeeting.style.marginTop = '200px'
        zoomMeeting.style.display = 'flex'
        zoomMeeting.style.height = '90%'
        zoomMeeting.style.width = '100%'
        zoomMeeting.style.position = 'fixed'
        zoomMeeting.style.zIndex = '1'
        zoomMeeting.style.backgroundColor = 'black'
    }

    const turnItOff = (e) => {
        e.preventDefault()
        zoomMeeting.style.display = 'none'
        zoomMeeting.style.height = '0px'
        zoomMeeting.style.width = '0px'
        zoomMeeting.style.position = 'relative'
        zoomMeeting.style.backgroundColor = 'black'
        zoomMeeting.style.zIndex = '1'
    }
    return (
        <header className='Header'>
        <div className='center'>         <h1 >Zoom Project</h1>
</div>
        <div className='left'>
        <Button onClick={turnItOff}>
                    Hide Zoom Window
        </Button>
                <Button onClick={turnItOn}>
                    Show Zoom Window
        </Button>
</div>
           
        </header>
    );
};
