import { WebApp } from 'meteor/webapp';
import jsontoxml from 'jsontoxml';

import { Happenings } from '/imports/api/happenings/happenings';

WebApp.connectHandlers.use('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'text/xml');

  const sitemapData = [
    {
      name: 'urlset',
      attrs: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      children: [],
    },
  ];

  const formatDate = (inputDate) => {
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
  };

  const pushToSiteMap = ({ loc, lastmod, changefreq = 'weekly', priority = 1 }) => {
    sitemapData[0].children.push({
      name: 'url',
      children: [
        {
          name: 'loc',
          text: loc,
        },
        {
          name: 'lastmod',
          text: formatDate(lastmod),
        },
        {
          name: 'changefreq',
          text: changefreq,
        },
        {
          name: 'priority',
          text: priority,
        },
      ],
    });
  };

  // home
  pushToSiteMap({
    loc: Meteor.absoluteUrl('/'),
    lastmod: new Date(),
  });
  // login
  pushToSiteMap({
    loc: Meteor.absoluteUrl('/login'),
    lastmod: new Date(),
    priority: 0.9,
  });
  // about
  pushToSiteMap({
    loc: Meteor.absoluteUrl('/about'),
    lastmod: new Date(),
    priority: 0.9,
  });

  // select items
  const items = Happenings.find(
    {},
    {
      sort: { updatedAt: -1, createdAt: -1 },
      fields: {
        _id: 1,
        slug: 1,
        updatedAt: 1,
        createdAt: 1,
      },
    },
  );
  items.map((item) => {
    pushToSiteMap({
      loc: Meteor.absoluteUrl(`/happening/${item.slug}`),
      lastmod: item.updatedAt || item.createdAt,
      priority: 0.8,
    });
    pushToSiteMap({
      loc: Meteor.absoluteUrl(`/c/${item.slug}`),
      lastmod: item.updatedAt || item.createdAt,
      priority: 0.8,
    });
    return item._id;
  });

  res.writeHead(200);
  res.write('<?xml version="1.0" encoding="UTF-8"?>');
  res.end(jsontoxml(sitemapData));
});
