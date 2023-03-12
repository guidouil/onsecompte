import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

import { Happenings } from '/imports/api/happenings/happenings.js';

// Import needed templates
import '../../ui/layouts/body/body.js';

import '../../ui/pages/home/home.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/loginToken/loginToken.js';
import '../../ui/pages/profile/profile.js';
import '../../ui/pages/new/new.js';
import '../../ui/pages/happening/happening.js';
import '../../ui/pages/edit/edit.js';
import '../../ui/pages/count/count.js';
import '../../ui/pages/search/search.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/not-found/not-found.js';

const ensureSignedIn = () => {
  if (!Meteor.userId()) {
    FlowRouter.go('/login');
  }
  return true;
};

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  action() {
    this.render('bodyLayout', 'home');
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    this.render('bodyLayout', 'login');
  },
});

FlowRouter.route('/login-token/:email/:token?', {
  name: 'loginToken',
  meta: {
    'og:title'() {
      return 'On Se Compte';
    },
  },
  title() {
    return 'On Se Compte';
  },
  action() {
    this.render('bodyLayout', 'loginToken');
  },
});

FlowRouter.route('/profile', {
  triggersEnter: [ensureSignedIn],
  name: 'profile',
  meta: {
    'og:title'() {
      return 'On Se Compte - Profil';
    },
  },
  title() {
    return 'On Se Compte - Profil';
  },
  action() {
    this.render('bodyLayout', 'profile');
  },
});

FlowRouter.route('/new', {
  triggersEnter: [ensureSignedIn],
  name: 'new',
  meta: {
    'og:title'() {
      return 'On Se Compte - Nouveau compteur';
    },
  },
  title() {
    return 'On Se Compte - Nouveau compteur';
  },
  action() {
    this.render('bodyLayout', 'new');
  },
});

FlowRouter.route('/happening/:slug', {
  name: 'happening',
  waitOn(params) {
    return [Meteor.subscribe('happenings.by_slug', params.slug)];
  },
  data(params) {
    return Happenings.findOne({ slug: params.slug });
  },
  meta: {
    'og:title'(params, query, data = {}) {
      return data.title;
    },
  },
  title(params, query, data = {}) {
    if (data) {
      return data.title;
    }
    return 'On Se Compte';
  },
  action() {
    this.render('bodyLayout', 'happening');
  },
});

FlowRouter.route('/edit/:_id', {
  triggersEnter: [ensureSignedIn],
  name: 'edit',
  waitOn(params) {
    return [Meteor.subscribe('happenings.by_id', params._id)];
  },
  data(params) {
    return Happenings.findOne({ _id: params._id });
  },
  meta: {
    'og:title'(params, query, data = {}) {
      return data.title;
    },
  },
  title(params, query, data = {}) {
    if (data) {
      return data.title;
    }
    return 'On Se Compte';
  },
  action() {
    this.render('bodyLayout', 'edit');
  },
});

FlowRouter.route('/c/:slug', {
  name: 'count',
  waitOn(params) {
    return [Meteor.subscribe('happenings.by_slug', params.slug)];
  },
  data(params) {
    return Happenings.findOne({ slug: params.slug });
  },
  meta: {
    'og:title'(params, query, data = {}) {
      return data.title;
    },
  },
  title(params, query, data = {}) {
    if (data) {
      return data.title;
    }
    return 'On Se Compte';
  },
  action() {
    this.render('bodyLayout', 'count');
  },
});

FlowRouter.route('/search', {
  name: 'search',
  meta: {
    'og:title'() {
      return 'On Se Compte - Recherche';
    },
  },
  title() {
    return 'On Se Compte - Recherche';
  },
  action() {
    this.render('bodyLayout', 'search');
  },
});

FlowRouter.route('/about', {
  name: 'about',
  meta: {
    'og:title'() {
      return 'On Se Compte - À propos';
    },
  },
  title() {
    return 'On Se Compte - À propos';
  },
  action() {
    this.render('bodyLayout', 'about');
  },
});

// 404
FlowRouter.route('*', {
  name: 'not-found',
  meta: {
    'og:title'() {
      return 'On Se Compte - Page non trouvée';
    },
  },
  title() {
    return 'On Se Compte - Page non trouvée';
  },
  action() {
    this.render('bodyLayout', 'notFound');
  },
});

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
