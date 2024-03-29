import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';

import './loginToken.html';
import '../../components/header/header.js';

Template.loginToken.onRendered(() => {
  window.scrollTo(0, 0);
  const token = FlowRouter.getParam('token');
  if (token) {
    $('#loginWithToken').trigger('submit');
  }
});

Template.loginToken.helpers({
  email() {
    return FlowRouter.getParam('email');
  },
  token() {
    return FlowRouter.getParam('token');
  },
});

Template.loginToken.events({
  'submit #loginWithToken'(event) {
    event.preventDefault();
    const email = FlowRouter.getParam('email');
    let token = $('#token').val();
    if (!token) {
      $('#tokenField').addClass('invalid');
      $('#token').focus();
      return false;
    }
    token = token.trim();
    Meteor.passwordlessLoginWithToken(email, token, (error) => {
      if (error) {
        document.querySelector('#toastErrorMessage').innerHTML = error.message;
        ui('#toastError');
      } else {
        FlowRouter.go(`/profile`);
      }
    });
  },
  'input #token'() {
    $('#tokenField').removeClass('invalid');
  },
});
