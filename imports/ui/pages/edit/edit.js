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
    const title = $('#title').val();
    const description = $('#description').val();
    let startDate = $('#startDate').val();
    const startTime = $('#startTime').val();
    startDate = new Date(`${startDate} ${startTime}`);
    let endDate = $('#endDate').val();
    const endTime = $('#endTime').val();
    if (endDate) {
      endDate = new Date(`${endDate} ${endTime}`);
    }
    const isPublic = document.getElementById('isPublic').checked;
    const happening = {
      _id,
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      isPublic,
    };
    Meteor.call('happenings.update', happening, (error) => {
      if (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
        });
      } else {
        FlowRouter.go(`/happening/${_id}`);
      }
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
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
            });
          } else {
            FlowRouter.go('/profile');
          }
        });
      }
    });
  },
});
