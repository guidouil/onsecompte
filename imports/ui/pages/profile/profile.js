import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './profile.html';
import '../../components/header/header.js';

import { Happenings } from '/imports/api/happenings/happenings';

Template.profile.onCreated(() => {
  const instance = Template.instance();
  instance.subscribe('happenings.by_owner');
});

Template.profile.helpers({
  happenings() {
    const ownerId = Meteor.userId();
    return Happenings.find({ ownerId }).fetch();
  },
});

Template.profile.events({
  'click #logOutBtn'() {
    Meteor.logout();
    FlowRouter.go('/');
  },
});
