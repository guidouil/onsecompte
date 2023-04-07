import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';

import './login.html';
import '../../components/header/header.js';

Template.login.onRendered(() => {
  window.scrollTo(0, 0);
  window.prerenderReady = true; //Tell pre-render we are now ready
});

Template.login.events({
  'submit #requestLoginToken'(event) {
    event.preventDefault();
    let email = $('#email').val();
    if (!email) {
      $('#emailField').addClass('invalid');
      $('#email').focus();
      return false;
    }
    email = email.trim().toLowerCase();
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      document.querySelector('#toastErrorMessage').innerHTML = 'Merci de saisir une adresse valide';
      ui('#toastError');
      return false;
    }
    const options = { selector: email, userData: { email } };
    Accounts.requestLoginTokenForUser(options, (error) => {
      if (error) {
        document.querySelector('#toastErrorMessage').innerHTML = error.message;
        ui('#toastError');
      } else {
        FlowRouter.go(`/login-token/${email}`);
      }
    });
  },
  'input #email'() {
    $('#emailField').removeClass('invalid');
  },
});
