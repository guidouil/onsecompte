import { Template } from 'meteor/templating';

import './happeningForm.html';

Template.happeningForm.events({
  'input #title'(event) {
    const title = event.currentTarget.value
      .trim()
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/'/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const slug = encodeURIComponent(title);
    $('#slug').val(slug);
  },
});
