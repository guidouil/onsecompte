import { Template } from 'meteor/templating';
import './about.html';

Template.about.onRendered(() => {
  window.scrollTo(0, 0);
  // @ts-ignore
  window.prerenderReady = true; //Tell pre-render we are now ready
});
