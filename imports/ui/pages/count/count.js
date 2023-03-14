import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';

import './count.html';
import '../../components/header/header.js';
import '../../components/loading/loading.js';

import { Happenings } from '/imports/api/happenings/happenings';
import { Participants } from '/imports/api/participants/participants';

Template.count.onCreated(() => {
  const instance = Template.instance();
  // @ts-ignore
  const uuid = new DeviceUUID().get();
  instance.uuid = new ReactiveVar(uuid);
  instance.happening = new ReactiveVar();
  instance.autorun(() => {
    const happening = Happenings.findOne();
    if (happening) {
      instance.subscribe('participants.by_hnuuid', happening._id, uuid);
      instance.happening.set(happening);
      document.title = happening.title;
    }
  });
});

Template.count.onRendered(() => {
  window.scrollTo(0, 0);
  // @ts-ignore
  window.prerenderReady = true; //Tell pre-render we are now ready
});

Template.count.helpers({
  uuid() {
    return Template.instance().uuid.get();
  },
  happening() {
    return Template.instance().happening.get();
  },
  participant() {
    const uuid = Template.instance().uuid.get();
    return Participants.findOne({ uuid });
  },
});

Template.count.events({
  'click #countBtn'(event, templateInstance) {
    const happening = Template.instance().happening.get();
    const happeningId = happening._id;
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Bug!',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire(
          'Merci',
          'Vous êtes compté en tant que participant. Maintenant faites passer.',
          'success',
        );
        FlowRouter.go(`/compteur/${happening.slug}`);
      }
    });
  },
  'click #likeBtn'(event, templateInstance) {
    const happening = Template.instance().happening.get();
    const happeningId = happening._id;
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid, isLike: true }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Bug!',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire(
          'Merci!',
          'Vous êtes compté en tant que soutien. Maintenant faites passer.',
          'success',
        );
        FlowRouter.go(`/compteur/${happening.slug}`);
      }
    });
  },
  'click #removeParticipantBtn'() {
    const happening = Template.instance().happening.get();
    const happeningId = happening._id;
    const uuid = Template.instance().uuid.get();
    const participant = Participants.findOne({ happeningId, uuid });
    Swal.fire({
      title: 'Supprimer votre comptage ?',
      text: 'Il sera effacé immédiatemant.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('participants.remove', participant._id, (error) => {
          if (error) {
            Swal.fire({
              title: 'Bug!',
              text: error.message,
              icon: 'error',
            });
          }
        });
      }
    });
  },
});
