import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './happeningItem.html';
import '../fiveStars/fiveStars';
import { error } from 'jquery';

Template.happeningItem.helpers({
  averageRating() {
    const happening = Template.instance().data;
    if (happening && happening.ratersCount) {
      return happening.ratingTotal / happening.ratersCount;
    }
    return false;
  },
});

Template.happeningItem.events({
  'click .happening'() {
    const { _id, slug } = this;
    const userId = Meteor.userId();
    if (!userId) {
      FlowRouter.go(`/a/${slug}`);
    } else {
      Meteor.call('happenings.isOwner', _id, (error, isOwner) => {
        if (error) {
          document.querySelector('#toastErrorMessage').innerHTML = error.message;
          ui('#toastError');
        } else if (isOwner) {
          FlowRouter.go(`/compteur/${slug}`);
        } else {
          FlowRouter.go(`/a/${slug}`);
        }
      });
    }
  },
});
