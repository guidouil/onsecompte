import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './fiveStars.html';

Template.fiveStars.onCreated(() => {
  const instance = Template.instance();
  instance.rating = new ReactiveVar();
  instance.isReadOnly = new ReactiveVar();
});

Template.fiveStars.onRendered(() => {
  const instance = Template.instance();
  instance.autorun(() => {
    const { rating, isReadOnly } = instance.data;
    if (rating) {
      instance.rating.set(rating);
    }
    if (isReadOnly) {
      instance.isReadOnly.set(isReadOnly);
    }
  });
});

Template.fiveStars.helpers({
  starsCount() {
    return [1, 2, 3, 4, 5];
  },
  isSelected(starNumber, rating) {
    if (rating === undefined) {
      rating = Template.instance().rating.get();
    }
    if (starNumber <= rating) {
      return true;
    }
    return false;
  },
  isHalf(starNumber, rating) {
    if (starNumber - 0.5 <= rating) {
      return true;
    }
    return false;
  },
  rating() {
    return Template.instance().rating.get();
  },
  isReadOnly() {
    return Template.instance().isReadOnly.get();
  },
});

Template.fiveStars.events({
  'click .starBtn'(event, templateInstance) {
    templateInstance.rating.set(event.currentTarget.dataset.value);
  },
});
