import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';

import './edit.html';
import '../../components/header/header.js';

import { Happenings } from '/imports/api/happenings/happenings';

Template.edit.onCreated(() => {
  const instance = Template.instance();
  const _id = FlowRouter.getParam('_id');
  instance.subscribe('happenings.by_id', _id);
});

Template.edit.helpers({
  happening() {
    const _id = FlowRouter.getParam('_id');
    return Happenings.findOne({ _id });
  },
});

Template.edit.events({
  'submit #editHappeningForm'(event) {
    event.preventDefault();
    const _id = FlowRouter.getParam('_id');
    const currentHappening = Happenings.findOne({ _id });
    const title = $('#title').val();
    const slug = $('#slug').val();
    Meteor.call('happenings.isUniqueSlug', { slug, _id }, (error, isUnique) => {
      if (error) {
        document.querySelector('#toastErrorMessage').innerHTML = error.message;
        ui('#toastError');
        return false;
      }
      if (!isUnique) {
        Swal.fire({
          title: 'Déjà pris',
          text: 'Ce nom court est déjà pris par un autre événement',
          icon: 'error',
        });
        return false;
      }
      const description = $('#description').val();
      let startDate = $('#startDate').val();
      const startTime = $('#startTime').val();
      if (startDate) {
        startDate = new Date(`${startDate} ${startTime}`);
      }
      let endDate = $('#endDate').val();
      const endTime = $('#endTime').val();
      if (endDate) {
        endDate = new Date(`${endDate} ${endTime}`);
      }
      const isPublic = document.getElementById('isPublic').checked;
      const happening = {
        _id,
        title,
        slug,
        description,
        startDate,
        startTime,
        endDate,
        endTime,
        isPublic,
      };
      Meteor.call('happenings.update', happening, (errorBis) => {
        if (errorBis) {
          document.querySelector('#toastErrorMessage').innerHTML = errorBis.message;
          ui('#toastError');
        } else {
          FlowRouter.go(`/compteur/${currentHappening.slug}`);
        }
      });
    });
  },
  'click #deleteHappeningBtn'() {
    const _id = FlowRouter.getParam('_id');
    Swal.fire({
      title: 'Effacer le compteur ?',
      text: 'Tous les participants seront effacés immédiatement.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('happenings.remove', _id, (error) => {
          if (error) {
            document.querySelector('#toastErrorMessage').innerHTML = error.message;
            ui('#toastError');
          } else {
            FlowRouter.go('/profile');
          }
        });
      }
    });
  },
});
