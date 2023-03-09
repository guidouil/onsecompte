import { Participants } from '../participants.js';
import { Happenings } from '../../happenings/happenings.js';

Participants.after.insert((userId, participant) => {
  const { happeningId } = participant;
  Happenings.update({ _id: happeningId }, { $inc: { count: 1 } });
});
