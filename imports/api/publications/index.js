import { Meteor } from 'meteor/meteor';
import messagesCollection from '../../../database/collections/messagesCollection';

Meteor.publish('messages',()=> {
    console.log("olny data relate to messages will be published");
});