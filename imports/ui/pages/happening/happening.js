import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import jrQrcode from 'jr-qrcode';

import './happening.html';
import '../../components/header/header.js';
import '../../components/loading/loading.js';

import { Happenings } from '/imports/api/happenings/happenings';

Template.happening.onCreated(() => {
  const instance = Template.instance();
  const _id = FlowRouter.getParam('_id');
  instance.subscribe('happenings.by_id', _id);
  instance.happening = new ReactiveVar();
  instance.autorun(() => {
    const happening = Happenings.findOne({ _id });
    if (happening) {
      instance.happening.set(happening);
      document.title = `OnSeCompte: ${happening.title}`;
    }
  });
});

Template.happening.onRendered(() => {
  window.scrollTo(0, 0);
});

Template.happening.helpers({
  happening() {
    return Template.instance().happening.get();
  },
  qrCode() {
    const _id = FlowRouter.getParam('_id');
    const url = Meteor.absoluteUrl(`/c/${_id}`);
    return jrQrcode.getQrBase64(url, {
      correctLevel: 0,
      background: '#000',
      foreground: '#fff',
      padding: 20,
      width: 512,
      height: 512,
    });
  },
  url() {
    const _id = FlowRouter.getParam('_id');
    return Meteor.absoluteUrl(`/c/${_id}`);
  },
  isOwner() {
    const ownerId = Meteor.userId();
    if (ownerId) {
      const happening = Template.instance().happening.get();
      return happening && happening.ownerId === ownerId;
    }
    return false;
  },
});

Template.happening.events({
  'click #copyUrlButton'() {
    const _id = FlowRouter.getParam('_id');
    const url = Meteor.absoluteUrl(`/c/${_id}`);
    navigator.clipboard.writeText(url);
    $('#inputUrlIcon').html('done').addClass('green');
    Meteor.setTimeout(() => {
      $('#inputUrlIcon').html('content_copy').removeClass('green');
    }, 1000);
  },
});
