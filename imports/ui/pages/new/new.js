import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';
import Swal from 'sweetalert2';

import './new.html';
import '../../components/header/header.js';
import '../../components/happeningForm/happeningForm.js';

Template.new.onRendered(() => {
  window.scrollTo(0, 0);
  $('#isPublic').trigger('click');
});

Template.new.events({
  'submit #newHappeningForm'(event) {
    event.preventDefault();
    const title = $('#title').val();
    const slug = $('#slug').val();
    Meteor.call('happenings.isUniqueSlug', { slug }, (error, isUnique) => {
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
        title,
        slug,
        description,
        startDate,
        startTime,
        endDate,
        endTime,
        isPublic,
      };
      Meteor.call('happenings.insert', happening, (errorBis) => {
        if (errorBis) {
          document.querySelector('#toastErrorMessage').innerHTML = errorBis.message;
          ui('#toastError');
        } else {
          FlowRouter.go(`/compteur/${slug}`);
        }
      });
    });
    return true;
  },
});
