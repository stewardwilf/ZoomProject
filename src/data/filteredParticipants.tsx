import {atom} from 'recoil'
import {liveParticipants} from './liveParticipants'
export const filteredParticipants = atom({
    key: "filteredParticipants",
    default: liveParticipants
  });