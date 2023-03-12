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
  instance.happening = new ReactiveVar();
  instance.isOwner = new ReactiveVar();
  instance.autorun(() => {
    const happening = Happenings.findOne();
    if (happening) {
      instance.happening.set(happening);
      document.title = happening.title;
      Meteor.call('happenings.isOwner', happening._id, (error, isOwner) => {
        instance.isOwner.set(isOwner);
      });
    }
  });
});

Template.happening.onRendered(() => {
  window.scrollTo(0, 0);
  window.prerenderReady = true; //Tell pre-render we are now ready
});

Template.happening.helpers({
  happening() {
    return Template.instance().happening.get();
  },
  qrCode() {
    const slug = FlowRouter.getParam('slug');
    const url = Meteor.absoluteUrl(`/c/${slug}`);
    return jrQrcode.getQrBase64(url, {
      correctLevel: 0,
      background: '#6751a4',
      foreground: '#fff',
      padding: 20,
      width: 512,
      height: 512,
    });
  },
  url() {
    const happening = Template.instance().happening.get();
    return Meteor.absoluteUrl(`/c/${happening.slug}`);
  },
  isOwner() {
    return Template.instance().isOwner.get();
  },
});

Template.happening.events({
  'click #copyUrlButton'() {
    const slug = FlowRouter.getParam('slug');
    const url = Meteor.absoluteUrl(`/c/${slug}`);
    navigator.clipboard.writeText(url);
    $('#inputUrlIcon').html('done').addClass('green');
    Meteor.setTimeout(() => {
      $('#inputUrlIcon').html('content_copy').removeClass('green');
    }, 1000);
  },
});
