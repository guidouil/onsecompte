import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Happenings = new Mongo.Collection('happenings');

Happenings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const locationSchema = new SimpleSchema({
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
});

const happeningSchema = new SimpleSchema({
  ownerId: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    optional: true,
  },
  startDate: {
    type: Date,
    optional: true,
  },
  endDate: {
    type: Date,
    optional: true,
  },
  isPublic: {
    type: Boolean,
  },
  count: {
    type: Number,
    optional: true,
  },
  likes: {
    type: Number,
    optional: true,
  },
  locations: {
    type: Array,
    optional: true,
  },
  'locations.$': {
    type: locationSchema,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
});

Happenings.attachSchema(happeningSchema);
