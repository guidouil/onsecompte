import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Participants = new Mongo.Collection('participants');

Participants.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const locationSchema = new SimpleSchema({
  longitude: {
    type: Number,
    optional: true,
  },
  latitude: {
    type: Number,
    optional: true,
  },
});

const participantSchema = new SimpleSchema({
  happeningId: {
    type: String,
  },
  uuid: {
    type: String,
  },
  isLike: {
    type: Boolean,
    optional: true,
  },
  rating: {
    type: Number,
    optional: true,
  },
  location: {
    type: locationSchema,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
});

Participants.attachSchema(participantSchema);
