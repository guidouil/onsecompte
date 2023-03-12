// All happenings-related publications
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Happenings } from '../happenings.js';

// Meteor.publish('happenings.all', () => Happenings.find({ isPublic: true }));

Meteor.publish('happenings.top_ten', () =>
  Happenings.find(
    { isPublic: true },
    {
      limit: 10,
      fields: { _id: 1, slug: 1, title: 1, count: 1, likes: 1, isPublic: 1 },
      sort: { count: -1, likes: -1 },
    },
  ),
);

Meteor.publish('happenings.by_owner', () => {
  const ownerId = Meteor.userId();
  if (!ownerId) {
    throw new Meteor.Error(401, 'Vous devez être connecté.');
  }
  return Happenings.find({ ownerId });
});

Meteor.publish('happenings.by_id', (_id) => {
  check(_id, String);
  return Happenings.find({ _id });
});

Meteor.publish('happenings.by_slug', (slug) => {
  check(slug, String);
  return Happenings.find({ slug });
});
