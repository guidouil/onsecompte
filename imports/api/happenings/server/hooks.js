import { Happenings } from '../happenings.js';
import { Participants } from '../../participants/participants.js';

Happenings.after.remove((userId, happening) => {
  const { _id } = happening;
  const participants = Participants.find({ happeningId: _id }).fetch();
  if (participants && participants.length) {
    participants.forEach(({ _id }) => {
      Participants.remove({ _id });
    });
  }
});
