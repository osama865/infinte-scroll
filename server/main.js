import { Meteor } from "meteor/meteor";
import messageCollection from "../database/collections/messagesCollection";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
import seed from "./seed";
import "../imports/api/publications"
const Time = require('dayjs');



Meteor.methods({
  'fetchMessages': (filters , options) => {
    console.log("hello" , filters , options);
    return messageCollection.find(filters , options).fetch();
  },
});


// first define the insertion method
const insertMessage = doc => messageCollection.insert(doc)
Meteor.startup(() => {
  if (true) {
    // seed.forEach(insertMessage)
  }
});