import { Participants } from '../participants.js';
import { Happenings } from '../../happenings/happenings.js';

Participants.after.insert((userId, participant) => {
  const { happeningId, isLike } = participant;
  if (isLike) {
    Happenings.update({ _id: happeningId }, { $inc: { likes: 1 } });
  } else {
    Happenings.update({ _id: happeningId }, { $inc: { count: 1 } });
  }
});

Participants.after.remove((userId, participant) => {
  const { happeningId, isLike } = participant;
  if (isLike) {
    Happenings.update({ _id: happeningId }, { $inc: { likes: -1 } });
  } else {
    Happenings.update({ _id: happeningId }, { $inc: { count: -1 } });
  }
});
