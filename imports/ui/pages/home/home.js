import { Template } from 'meteor/templating';

import './home.html';

import '../../components/header/header.js';
import '../../components/hello/hello.js';
import '../../components/topTen/topTen.js';

Template.home.onCreated(() => {
  document.title = 'On Se Compte';
});
