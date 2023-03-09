// Methods related to participants

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Participants } from './participants.js';

Meteor.methods({
  'participants.insert'({ happeningId, uuid }) {
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
    return Participants.insert(participant);
  },
});
