const express = require('express');
const UserModel = require('../models/user-model.js');
const ConversationModel  = require('../models/conversation-model.js');
const MessageModel = require('../models/message-model.js');

const router = express.Router();

router.get('/messages', (req, res, next) => {
  // This route will display all conversations the signed in user has with other users
  // Only return one message from each conversation to display as snippet
  ConversationModel.find({ participants: req.user._id })
    .select('_id')
    .exec(function(err, conversations) {
        if (err) {
          next(err);
          return;
          }

      // Set up empty array to hold conversations + most recent message
    let fullConversations = [];
    conversations.forEach((conversation) => {
      MessageModel.find({ 'conversationId': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: "author",
            select: "user.name"
          })
          .exec((err, message) => {
            if (err) {
              next(err);
              return;
            }

            fullConversations.push(message);

            if(fullConversations.length === conversations.length)
              {
              return res.status(200).json({ conversations: fullConversations });
              }
          });
      });
  });
});



router.get('/messages/:recipient', (req, res, next) => {
  // This route will display the specific messages with logged in user and other user
  ConversationModel.findOne(
    {participants:
        { $size: 2, $all:[req.user._id, req.params.recipient] }
      },

      (err, conversation) => {
        if(conversation === null){
          const newConversation = new ConversationModel (
            {
              participants: [
                req.user._id,
                req.params.recipient]
            }
          );

          newConversation.save((err) =>  {
            if (err) {
              return next(err);
            }
            res.locals.MessagesList = [];
            res.render('chat-views/conversation');
          })
        }

        else {
          MessageModel.find({ conversationId: conversation._id })
            .select('createdAt body author')
            .sort('-createdAt')
            .populate({
              path: 'author',
              select: 'name'
            })
            .exec((err, messages) => {
              if (err) {
                next(err);
                return;
                }
                res.locals.recipient = req.params.recipient;
                res.locals.MessagesList = messages;
                res.render('chat-views/conversation');
            });
        }
      }
  )
});


router.post('/messages/:recipient/new', (req, res, next) => {

  const message = new MessageModel({
    conversationId: conversation._id,
    body: req.body.composedMessage,
    author: req.user._id
  });

const reply = new MessageModel({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.user._id
  });

  reply.save((err, sentReply) => {
    if (err) {
      next(err);
      return;
    }
    res.locals.conversation = sentReply;
    res.render('chat-views/conversation');
    return(next);
  });
});




// // DELETE Route to Delete Conversation
// router.get(deleteConversation = function(req, res, next) {
//   Conversation.findOneAndRemove({
//     $and : [
//             { '_id': req.params.conversationId }, { 'participants': req.user._id }
//            ]}, function(err) {
//         if (err) {
//           res.send({ error: err });
//           return next(err);
//         }
//
//         res.status(200).json({ message: 'Conversation removed!' });
//         return next();
//   });
// }
// //
// // // PUT Route to Update Message
// // updateMessage = function(req, res, next) {
// //   Conversation.find({
// //     $and : [
// //             { '_id': req.params.messageId }, { 'author': req.user._id }
// //           ]}, function(err, message) {
// //         if (err) {
// //           res.send({ error: err});
// //           return next(err);
// //         }
// //
// //         message.body = req.body.composedMessage;
// //
// //         message.save(function (err, updatedMessage) {
// //           if (err) {
// //             res.send({ error: err });
// //             return next(err);
// //           }
// //
// //           res.status(200).json({ message: 'Message updated!' });
// //           return next();
// //         });
// //   });
// // }



module.exports = router;
