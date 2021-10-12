import { Meteor } from "meteor/meteor";
import messageCollection from "../database/collections/messagesCollection";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
import seed from "./seed";
import "../imports/api/publications"


Meteor.methods({
  'fetchMessages': (filters , options) => {
    console.log("hello" , filters , options);
    return messageCollection.find(filters , options).fetch();
  },
});


// first define the insertion method
Meteor.startup(() => {
  // If there is no acc with the user name then create it
  if (true) {
    // seed.forEach(insertMessage);
  }
});