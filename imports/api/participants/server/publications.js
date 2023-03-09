// All participants-related publications
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Participants } from '../participants.js';

Meteor.publish('participants.by_hnuuid', (happeningId, uuid) => {
  check(happeningId, String);
  check(uuid, String);
  return Participants.find({ happeningId, uuid });
});
