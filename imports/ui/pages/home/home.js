import { Template } from 'meteor/templating';

import './home.html';

import '../../components/header/header.js';
// import '../../components/footer/footer.js';
import '../../components/hello/hello.js';
import '../../components/topTen/topTen.js';
import '../../components/about/about.js';

Template.home.onCreated(() => {
  document.title = 'On Se Compte';
});

Template.home.onRendered(() => {
  // @ts-ignore
  window.prerenderReady = true; //Tell pre-render we are now ready
});
