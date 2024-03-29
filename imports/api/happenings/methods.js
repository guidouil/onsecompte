// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Happenings } from './happenings.js';

Meteor.methods({
  'happenings.insert'({ title, slug, description, url, startDate, endDate, isPublic }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(401, 'Vous devez être connecté.');
    }
    check(title, String);
    check(slug, String);
    check(isPublic, Boolean);
    const happening = {
      ownerId: Meteor.userId(),
      title,
      slug,
      isPublic,
      count: 0,
      likes: 0,
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
  'happenings.update'({ _id, title, slug, description, url, startDate, endDate, isPublic }) {
    const ownerId = Meteor.userId();
    if (!ownerId) {
      throw new Meteor.Error(401, 'Vous devez être connecté.');
    }
    check(_id, String);
    const currentHappening = Happenings.findOne({ _id, ownerId });
    if (!currentHappening) {
      throw new Meteor.Error(403, 'Vous devez être le propriétaire.');
    }
    check(title, String);
    check(slug, String);
    check(isPublic, Boolean);
    const happening = {
      title,
      isPublic,
      updatedAt: new Date(),
    };
    if (!currentHappening.count && !currentHappening.likes) {
      happening.slug = slug;
    }
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
  'happenings.isUniqueSlug'({ slug, _id }) {
    check(slug, String);
    if (_id !== undefined) {
      check(_id, String);
      return Happenings.find({ _id: { $ne: _id }, slug }).count() === 0;
    }
    return Happenings.find({ slug }).count() === 0;
  },
  'happenings.isOwner'(_id) {
    const ownerId = Meteor.userId();
    if (!ownerId) {
      return false;
    }
    check(_id, String);
    if (Happenings.find({ _id, ownerId }).count() === 0) {
      return false;
    }
    return true;
  },
  'happenings.calculateTotals'() {
    const happenings = Happenings.find({
      $or: [{ count: { $exists: true } }, { likes: { $exists: true } }],
    }).fetch();
    if (happenings && happenings.length) {
      happenings.forEach(({ _id, count = 0, likes = 0 }) => {
        const total = count + likes;
        Happenings.update({ _id }, { $set: { total } });
      });
    }
  },
});
