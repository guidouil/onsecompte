import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';

import './count.html';
import '../../components/header/header.js';

import { Happenings } from '/imports/api/happenings/happenings';
import { Participants } from '/imports/api/participants/participants';

Template.count.onCreated(() => {
  const instance = Template.instance();
  const _id = FlowRouter.getParam('_id');
  instance.subscribe('happenings.by_id', _id);
  // @ts-ignore
  const uuid = new DeviceUUID().get();
  instance.subscribe('participants.by_hnuuid', _id, uuid);
  instance.uuid = new ReactiveVar(uuid);
});

Template.count.onRendered(() => {
  window.scrollTo(0, 0);
});

Template.count.helpers({
  uuid() {
    return Template.instance().uuid.get();
  },
  happening() {
    const _id = FlowRouter.getParam('_id');
    return Happenings.findOne({ _id });
  },
  participant() {
    const happeningId = FlowRouter.getParam('_id');
    const uuid = Template.instance().uuid.get();
    return Participants.findOne({ happeningId, uuid });
  },
});

Template.count.events({
  'click #countBtn'(event, templateInstance) {
    const happeningId = FlowRouter.getParam('_id');
    const uuid = templateInstance.uuid.get();
    Meteor.call('participants.insert', { happeningId, uuid }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire('Bravo!', 'Vous êtes compté!', 'success');
        FlowRouter.go(`/happening/${happeningId}`);
      }
    });
  },
});
