import { Template } from "meteor/templating";

import "./body.html";

Template.bodyLayout.onRendered(() => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    $("body").addClass("dark");
  }
});
