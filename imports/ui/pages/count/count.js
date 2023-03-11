import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';

import './count.html';
import '../../components/header/header.js';

import { Happenings } from '/imports/api/happenings/happenings';
import { Participants } from '/imports/api/participants/participants';

Template.count.onCreated(() => {
  const instance = Template.instance();
  const _id = FlowRouter.getParam('_id');
  instance.subscribe('happenings.by_id', _id);
  // @ts-ignore
  const uuid = new DeviceUUID().get();
  instance.subscribe('participants.by_hnuuid', _id, uuid);
  instance.uuid = new ReactiveVar(uuid);
  instance.happening = new ReactiveVar();
  instance.autorun(() => {
    const happening = Happenings.findOne({ _id });
    if (happening) {
      instance.happening.set(happening);
      document.title = `OnSeCompte: ${happening.title}`;
    }
  });
});

Template.count.onRendered(() => {
  window.scrollTo(0, 0);
});

Template.count.helpers({
  uuid() {
    return Template.instance().uuid.get();
  },
  happening() {
    return Template.instance().happening.get();
  },
  participant() {
    const happeningId = FlowRouter.getParam('_id');
    const uuid = Template.instance().uuid.get();
    return Participants.findOne({ happeningId, uuid });
  },
});

Template.count.events({
  'click #countBtn'(event, templateInstance) {
    const happeningId = FlowRouter.getParam('_id');
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire(
          'Merci',
          'Vous êtes compté en tant que participant. Maintenant faites les autres se compter aussi.',
          'success',
        );
        FlowRouter.go(`/happening/${happeningId}`);
      }
    });
  },
  'click #likeBtn'(event, templateInstance) {
    const happeningId = FlowRouter.getParam('_id');
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid, isLike: true }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire(
          'Merci!',
          'Vous êtes compté en tant que soutient. Maintenant faites les autres se compter aussi.',
          'success',
        );
        FlowRouter.go(`/happening/${happeningId}`);
      }
    });
  },
  'click #removeParticipantBtn'() {
    const happeningId = FlowRouter.getParam('_id');
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
              title: 'Error!',
              text: error.message,
              icon: 'error',
            });
          }
        });
      }
    });
  },
});
