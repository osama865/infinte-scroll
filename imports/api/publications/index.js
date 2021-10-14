import { Meteor } from 'meteor/meteor';

Meteor.publish('messages',()=> {
    console.log("olny data relate to messages will be published");
});