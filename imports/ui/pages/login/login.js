import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';
import Swal from 'sweetalert2';

import './login.html';
import '../../components/header/header.js';

Template.login.onRendered(() => {
  window.scrollTo(0, 0);
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
      Swal.fire({
        title: 'Error!',
        text: 'Merci de saisir une adresse valide',
        icon: 'error',
      });
      return false;
    }
    const options = { selector: email, userData: { email } };
    Accounts.requestLoginTokenForUser(options, (error) => {
      if (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
        });
      } else {
        FlowRouter.go(`/login-token/${email}`);
      }
    });
  },
  'input #email'() {
    $('#emailField').removeClass('invalid');
  },
});
