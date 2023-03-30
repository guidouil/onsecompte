// Methods related to participants

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Participants } from './participants.js';

Meteor.methods({
  'participants.insert'({ happeningId, uuid, isLike }) {
    check(happeningId, String);
    check(uuid, String);
    if (Participants.find({ happeningId, uuid }).count() === 1) {
      throw new Meteor.Error(403, 'Vous avez déjà été compté.');
    }
    const participant = {
      happeningId,
      uuid,
      createdAt: new Date(),
    };
    if (isLike !== undefined) {
      check(isLike, Boolean);
      participant.isLike = isLike;
    }
    return Participants.insert(participant);
  },
  'participants.remove'(_id) {
    check(_id, String);
    if (Participants.find({ _id }).count() !== 1) {
      throw new Meteor.Error(404, 'Participation non trouvée.');
    }
    return Participants.remove({ _id });
  },
  'participants.setRating'({ _id, rating }) {
    check(_id, String);
    check(rating, Number);
    if (Participants.find({ _id }).count() !== 1) {
      throw new Meteor.Error(404, 'Participation non trouvée.');
    }
    return Participants.update({ _id }, { $set: { rating } });
  },
});
