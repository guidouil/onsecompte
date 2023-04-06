import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Swal from 'sweetalert2';

import './count.html';
import '../../components/header/header.js';
import '../../components/loading/loading.js';
import '../../components/theCount/theCount.js';
import '../../components/fiveStars/fiveStars.js';

import { Happenings } from '/imports/api/happenings/happenings';
import { Participants } from '/imports/api/participants/participants';

Template.count.onCreated(() => {
  const instance = Template.instance();
  // @ts-ignore
  const uuid = new DeviceUUID().get();
  instance.uuid = new ReactiveVar(uuid);
  instance.happening = new ReactiveVar();
  instance.isOwner = new ReactiveVar();
  instance.autorun(() => {
    const happening = Happenings.findOne();
    if (happening) {
      instance.subscribe('participants.by_hnuuid', happening._id, uuid);
      instance.happening.set(happening);
      document.title = happening.title;
      Meteor.call('happenings.isOwner', happening._id, (error, isOwner) => {
        instance.isOwner.set(isOwner);
      });
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
  isOwner() {
    return Template.instance().isOwner.get();
  },
});

Template.count.events({
  'click #countBtn'(event, templateInstance) {
    const happening = Template.instance().happening.get();
    const happeningId = happening._id;
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid }, (error) => {
      if (error) {
        document.querySelector('#toastErrorMessage').innerHTML = error.message;
        ui('#toastError');
      } else {
        document.querySelector('#toastSuccessMessage').innerHTML =
          'Vous êtes compté en tant que participant. Maintenant faites passer.';
        ui('#toastSuccess');
      }
    });
  },
  'click #likeBtn'(event, templateInstance) {
    const happening = Template.instance().happening.get();
    const happeningId = happening._id;
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid, isLike: true }, (error) => {
      if (error) {
        document.querySelector('#toastErrorMessage').innerHTML = error.message;
        ui('#toastError');
      } else {
        document.querySelector('#toastSuccessMessage').innerHTML =
          'Vous êtes compté en tant que soutien. Maintenant faites passer.';
        ui('#toastSuccess');
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
            document.querySelector('#toastErrorMessage').innerHTML = error.message;
            ui('#toastError');
          }
        });
      }
    });
  },
  'click #rateBtn'(event, templateInstance) {
    const rating = Number(document.getElementById('fiveStarsRating').value);
    if (rating) {
      const happening = Template.instance().happening.get();
      const happeningId = happening._id;
      const uuid = templateInstance.uuid.get();
      const { _id } = Participants.findOne({ happeningId, uuid });
      Meteor.call('participants.setRating', { _id, rating }, (error) => {
        if (error) {
          document.querySelector('#toastErrorMessage').innerHTML = error.message;
          ui('#toastError');
        }
      });
    }
  },
});
