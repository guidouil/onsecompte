import { Template } from 'meteor/templating';

Template.registerHelper('toLocaleDate', (date) => {
  if (date && typeof date === 'object') {
    return date.toLocaleString();
  }
  return '';
});

Template.registerHelper('toShortDate', (date) => {
  if (date) {
    if (typeof date === 'object') {
      return date.toLocaleDateString();
    }
    return new Date(date * 1000).toLocaleDateString();
  }
  return '';
});

Template.registerHelper('dateInputFormat', (inputDate) => {
  if (inputDate) {
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
  return '';
});

Template.registerHelper('timeInputFormat', (inputDate) => {
  if (inputDate) {
    let hour, minute;
    hour = inputDate.getHours();
    minute = inputDate.getMinutes();
    hour = hour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
  return '';
});

Template.registerHelper('formatNumber', (num) => {
  if (num) {
    return num.toLocaleString('fr-FR');
  }
  return 0;
});

// eslint-disable-next-line eqeqeq
Template.registerHelper('eq', (a, b) => a == b);

Template.registerHelper('neq', (a, b) => a !== b);

Template.registerHelper('gte', (a, b) => a >= b);

Template.registerHelper('lte', (a, b) => a <= b);

Template.registerHelper('add', (a, b) => a + b);

Template.registerHelper('minus', (a, b) => a - b);

Template.registerHelper('or', (a, b) => a || b);

Template.registerHelper('and', (a, b) => a && b);

Template.registerHelper('includes', (array, word) => array.includes(word));

Template.registerHelper('not', (boolean) => !boolean);

Template.registerHelper('neg', (n) => n * -1);

Template.registerHelper('roundTwo', (num) => Math.round(num * 100) / 100);
