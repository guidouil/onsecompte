import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';
import Swal from 'sweetalert2';

import './new.html';
import '../../components/header/header.js';
import '../../components/happeningForm/happeningForm.js';

Template.new.events({
  'submit #newHappeningForm'(event) {
    event.preventDefault();
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
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      isPublic,
    };
    Meteor.call('happenings.insert', happening, (error, _id) => {
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
});
