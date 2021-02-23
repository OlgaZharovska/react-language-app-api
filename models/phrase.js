var mongoose = require("mongoose");
var Phrase = mongoose.model("Phrase", {
  phrase: {
    type: String,
  },
  translation: {
    type: String,
  },
  category: {
    type: String,
  },
  userName: {
    type: String,
  },
});

module.exports = Phrase;
