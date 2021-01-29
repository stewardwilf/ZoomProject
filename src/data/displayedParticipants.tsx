import {atom} from 'recoil'
import {liveParticipants} from './liveParticipants'
export const displayed = atom({
    key: "displayed",
    default: liveParticipants
  });