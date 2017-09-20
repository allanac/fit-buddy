const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  }
);

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;
