import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import jrQrcode from 'jr-qrcode';
import Swal from 'sweetalert2';

import './counter.html';
import '../../components/header/header.js';
import '../../components/loading/loading.js';
import '../../components/theCount/theCount.js';

import { Happenings } from '/imports/api/happenings/happenings';

Template.counter.onCreated(() => {
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

Template.counter.onRendered(() => {
  window.scrollTo(0, 0);
  window.prerenderReady = true; //Tell pre-render we are now ready
});

Template.counter.helpers({
  happening() {
    return Template.instance().happening.get();
  },
  qrCode() {
    const slug = FlowRouter.getParam('slug');
    const url = Meteor.absoluteUrl(`/a/${slug}`);
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
    return Meteor.absoluteUrl(`/a/${happening.slug}`);
  },
  isOwner() {
    return Template.instance().isOwner.get();
  },
  averageRating() {
    const happening = Template.instance().happening.get();
    if (happening && happening.ratersCount) {
      return happening.ratingTotal / happening.ratersCount;
    }
    return false;
  },
});

Template.counter.events({
  'click #copyUrlButton'() {
    const slug = FlowRouter.getParam('slug');
    const url = Meteor.absoluteUrl(`/a/${slug}`);
    navigator.clipboard.writeText(url);
    $('#inputUrlIcon').html('done').addClass('green');
    Swal.fire('Copié', 'Vous pouvez coller ce lien où vous voulez.', 'success');
    Meteor.setTimeout(() => {
      $('#inputUrlIcon').html('content_copy').removeClass('green');
    }, 1000);
  },
});
