import { Meteor } from "meteor/meteor";
import messageCollection from "../database/collections/messagesCollection";
import { check } from "meteor/check";
import "../imports/api/publications"


// the method to fetch messages
Meteor.methods({
  'fetchMessages': (filters , options) => {
    console.log("iam options" , options);
    return messageCollection.find(filters , options).fetch();
  },
});

Meteor.startup(() => {
  
});