import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import prerender from 'prerender-node';

Meteor.startup(() => {
  prerender.set('prerenderToken', 'XpA2nIZVFLAS9fCiiSZQ');
  prerender.set('protocol', 'https');
  prerender.set('host', 'onsecompte.fr');
  prerender.crawlerUserAgents.push('googlebot');
  prerender.crawlerUserAgents.push('bingbot');
  prerender.crawlerUserAgents.push('yandex');
  WebApp.rawConnectHandlers.use(prerender);
});
