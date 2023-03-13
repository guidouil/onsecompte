import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'On Se Compte';
Accounts.emailTemplates.from = 'On Se Compte <onsecompte@gmail.com>';

Accounts.emailTemplates.sendLoginToken = {
  subject() {
    return 'Votre code pour se connecter à OnSeCompte.fr';
  },
  text(user, url, { sequence }) {
    const email = user.emails[0].address;
    const loginTokenUrl = Meteor.absoluteUrl(`/login-token/${email}/${sequence}`);
    return `Bonjour et bienvenue,\n\nVoici le code pour se connecter :\n${sequence}\n\nSinon vous pouvez cliquer sur le lien çi dessous pour vous connecter automatiquement :\n${loginTokenUrl}\n\nMerci et à tout de suite`;
  },
};
