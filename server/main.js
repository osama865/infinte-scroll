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
  //process.env.MONGO_URL = "mongodb+srv://osama:N5uBNpY5FKG7vfy0@cluster0.ezstx.mongodb.net/logs?retryWrites=true&w=majority"
  console.log(Meteor.settings)
});