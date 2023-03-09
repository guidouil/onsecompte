import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";

import "./menu.html";

Template.menu.events({
  "click #closMenuBtn"() {
    $("#menu").removeClass("active");
  },
});
