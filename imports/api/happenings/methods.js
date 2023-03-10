// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Happenings } from './happenings.js';

Meteor.methods({
  'happenings.insert'({ title, description, url, startDate, endDate, isPublic }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(401, 'Vous devez être connecté.');
    }
    check(title, String);
    check(isPublic, Boolean);
    const happening = {
      ownerId: Meteor.userId(),
      title,
      isPublic,
      createdAt: new Date(),
    };
    if (description) {
      check(description, String);
      happening.description = description;
    }
    if (url) {
      check(url, String);
      happening.url = url;
    }
    if (startDate) {
      check(startDate, Date);
      happening.startDate = startDate;
    }
    if (endDate) {
      check(endDate, Date);
      happening.endDate = endDate;
    }
    return Happenings.insert(happening);
  },
  'happenings.update'({ _id, title, description, url, startDate, endDate, isPublic }) {
    const ownerId = Meteor.userId();
    if (!ownerId) {
      throw new Meteor.Error(401, 'Vous devez être connecté.');
    }
    check(_id, String);
    if (Happenings.find({ _id, ownerId }).count() === 0) {
      throw new Meteor.Error(403, 'Vous devez être le propriétaire.');
    }
    check(title, String);
    check(isPublic, Boolean);
    const happening = {
      title,
      isPublic,
      updatedAt: new Date(),
    };
    if (description) {
      check(description, String);
      happening.description = description;
    }
    if (url) {
      check(url, String);
      happening.url = url;
    }
    if (startDate) {
      check(startDate, Date);
      happening.startDate = startDate;
    }
    if (endDate) {
      check(endDate, Date);
      happening.endDate = endDate;
    }
    return Happenings.update({ _id }, { $set: happening });
  },
  'happenings.remove'(_id) {
    const ownerId = Meteor.userId();
    if (!ownerId) {
      throw new Meteor.Error(401, 'Vous devez être connecté.');
    }
    check(_id, String);
    if (Happenings.find({ _id, ownerId }).count() === 0) {
      throw new Meteor.Error(403, 'Vous devez être le propriétaire.');
    }
    return Happenings.remove({ _id });
  },
});
