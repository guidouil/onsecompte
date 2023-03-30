import { Participants } from '../participants.js';
import { Happenings } from '../../happenings/happenings.js';

Participants.after.insert((userId, participant) => {
  const { happeningId, isLike } = participant;
  if (isLike) {
    Happenings.update({ _id: happeningId }, { $inc: { likes: 1, total: 1 } });
  } else {
    Happenings.update({ _id: happeningId }, { $inc: { count: 1, total: 1 } });
  }
});

Participants.after.update((userId, participant) => {
  const { happeningId, rating } = participant;
  if (rating) {
    Happenings.update({ _id: happeningId }, { $inc: { ratersCount: 1, ratingTotal: rating } });
  }
});

Participants.after.remove((userId, participant) => {
  const { happeningId, isLike, rating } = participant;
  if (isLike) {
    Happenings.update({ _id: happeningId }, { $inc: { likes: -1, total: -1 } });
  } else {
    Happenings.update({ _id: happeningId }, { $inc: { count: -1, total: -1 } });
  }
  if (rating) {
    Happenings.update({ _id: happeningId }, { $inc: { ratersCount: -1, ratingTotal: -rating } });
  }
});
