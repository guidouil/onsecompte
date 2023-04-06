import { Template } from 'meteor/templating';

import './body.html';
import '/imports/ui/components/toast/toast';

Template.bodyLayout.onRendered(() => {
  // Dark mode detection
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $('body').addClass('dark');
  }
});
