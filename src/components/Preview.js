//libraries/css
import { Grid, Icon } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from 'react';

//shared states
import { selectedIds } from '../data/selectedIds'; //Array of IDs for pinned participants
import { config } from '../data/config'; //bool - true for pinned, false for grid
import { liveParticipants } from '../data/liveParticipants'; //Array of all participants, never filtered
import { selectedParticipants } from '../data/selectedParticipants'; //Array of pinned participant objs

//components/ functions
import { muteIndiv } from './Zoom';

export const Preview = () => {
  const [selectedState, setSelected] = useRecoilState(selectedIds);
  const [wh, setwh] = useState(0);
  const [cf,] = useRecoilState(config);
  const [participantsData,] = useRecoilState(liveParticipants);
  const [selectedAllState, setSelectedAllState] = useRecoilState(selectedParticipants);

  useEffect(() => { // recalculate number of rows/ columns when selections change
    if (cf) {
      setwh((Math.ceil(Math.sqrt(selectedState?.length)) ? Math.ceil(Math.sqrt(selectedState?.length)) : 1))

      let fullSelectedArray = selectedState.map(sel => participantsData?.filter(x => x.userId === sel)[0])
      setSelectedAllState(fullSelectedArray)
      //console.log('selected', fullSelectedArray)
    }
    //let h:number = (Math.ceil(selectedState.length / w) ? Math.ceil(selectedState.length / w) : 1)
  }, [selectedState, cf])

  useEffect(() => { // recalculate number of rows/ columns when selections change
    if (!cf) {
      setwh((Math.ceil(Math.sqrt(participantsData?.length)) ? Math.ceil(Math.sqrt(participantsData?.length)) : 1))
    }

    //let h:number = (Math.ceil(selectedState.length / w) ? Math.ceil(selectedState.length / w) : 1)
  }, [participantsData,cf])


  // const removeFromState = (obj) => { //filter out removed item
  //   setSelected(selectedState.filter((item) => item.userId !== obj.userId))
  // }

  const pin = (id) => {
    setSelected([...selectedState, id])
    // const ap = accessParticipants()
    // //console.log('aplen',ap.length,'index',index, 'selectedlen',selected.length)

    // const num = ap.length - index 
    // simulateMouseover(num)
    // let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child("+num+") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
    // pinButton.click()        
}

const unpin = (id) => {
    setSelected([...selectedState.filter(item => item !== id)])
    // const ap = accessParticipants()
    // const num = ap?.length - index
    // simulateMouseover(num)
    // let pinButton = document.querySelector("#wc-container-left > div:nth-child(3) > div > div.speaker-bar-container__horizontal-view-wrap > div:nth-child("+num+") > div > div:nth-child(3) > div > div > ul > li:nth-child(5) > a")
    // pinButton.click()
}

  return (
    <>
      <div className='left'>
        <Grid columns={wh}>

          {cf ?
            selectedAllState?.map((sel,idx) =>
              <>
                <Grid.Column padded="false" >
                  <div className='PreviewFooter' key={sel?.userId}>
                    <div className='PreviewFooterContents'>
                      <p className='left'>{sel?.userName} </p>
                      <Icon
                        className='right'
                        name={'map pin'}
                        onClick={selectedState?.find(x => x === sel?.userId) ? () => unpin(sel?.userId) : () => pin(sel?.userId)}
                        size='large'
                        color={selectedState?.find(x => x === sel?.userId) ? 'red' : 'green'}
                      ></Icon>
                      <Icon
                        className='right'
                        name={sel?.muted ? 'mute' : 'unmute'}
                        color={sel?.muted ? 'red' : 'green'}
                        onClick={() => muteIndiv(sel?.userId, sel?.muted ? false : true)}
                        size='large'
                      ></Icon>
                    </div>
                  </div>

                </Grid.Column>
              </>
            )
            :
            participantsData?.map((sel) =>
              <>

                <Grid.Column padded="false" >
                  <div className='PreviewFooter' key={sel.userId}>
                    <div className='PreviewFooterContents'>
                      <p className='left'>{sel.userName} </p>
                      <Icon
                        className='right'
                        name={sel.muted ? 'mute' : 'unmute'}
                        color={sel.muted ? 'red' : 'green'}
                        onClick={() => muteIndiv(sel.userId, sel.muted ? false : true)}
                        size='large'
                      ></Icon>
                    </div>
                  </div>
                </Grid.Column>
              </>
            )}
        </Grid>
      </div>
    </>
  )
}