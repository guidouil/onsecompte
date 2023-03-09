import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { $ } from 'meteor/jquery';

import './header.html';
import '../menu/menu';

Template.header.helpers({
  isHome() {
    if (FlowRouter.getRouteName() === 'home') {
      return true;
    }
    return false;
  },
});

Template.header.events({
  'click #showMenuBtn'() {
    $('#menu').addClass('active');
  },
  'click #goBackBtn'() {
    window.history.back();
  },
  'click #darkModeBtn'() {
    $('body').toggleClass('dark');
  },
  'click #logo'() {
    FlowRouter.go('/');
  },
});
