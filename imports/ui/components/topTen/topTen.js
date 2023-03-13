import { Template } from 'meteor/templating';

import './topTen.html';
import '../../components/loading/loading.js';

import { Happenings } from '/imports/api/happenings/happenings';

Template.topTen.onCreated(() => {
  const instance = Template.instance();
  instance.subscribe('happenings.top_ten');
});

Template.topTen.helpers({
  happenings() {
    return Happenings.find({ isPublic: true }, { sort: { count: -1, likes: -1 } }).fetch();
  },
});
