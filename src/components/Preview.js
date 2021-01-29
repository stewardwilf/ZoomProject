import { Grid, Icon, Button } from 'semantic-ui-react'
import { useRecoilState } from 'recoil'
import React, { useEffect, useState } from 'react'
import { selected } from '../data/selected'

export const Preview = () => {
  const [selectedState, setSelected] = useRecoilState(selected);
  const [wh, setwh] = useState(1);

  useEffect(() => { // recalculate number of rows/ columns when selections change
    setwh((Math.ceil(Math.sqrt(selectedState.length)) ? Math.ceil(Math.sqrt(selectedState.length)) : 1))
    //let h:number = (Math.ceil(selectedState.length / w) ? Math.ceil(selectedState.length / w) : 1)
  }, [selectedState]);

  const removeFromState = (obj) => { //filter out removed item
    setSelected(selectedState.filter((item) => item.userId !== obj.userId))
  }

  return (
    <>
      <div className='left'>
        <Grid columns={wh}>
          {selectedState.map((sel) =>
            <>
              <Grid.Column padded="false" key={sel.userId}>
                <Button icon className='right' onClick={() => removeFromState(sel)}>
                  <Icon name='close' />
                </Button>
                <Icon name='bars' size='big' className='left' />
                <div className='VideoStream'></div>
                <div className='PreviewFooter'>
                  <h5 className='left'>{sel.userName} </h5>
                  <Icon className='right' name={sel.muted ? 'mute' : 'unmute'} />
                </div>
              </Grid.Column>
            </>
          )}
        </Grid>
      </div>
    </>
  )
}
