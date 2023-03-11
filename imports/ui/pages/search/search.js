import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

import './search.html';

Template.search.onCreated(() => {
  const instance = Template.instance();
  instance.happenings = new ReactiveVar();
});

Template.search.helpers({
  happenings() {
    return Template.instance().happenings.get();
  },
});

Template.search.events({
  'submit #searchForm'(event, templateInstance) {
    event.preventDefault();
    const search = $('#search').val();
    console.log(search);
  },
});
