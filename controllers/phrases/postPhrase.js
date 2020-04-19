const Phrase = require("../models/phrase");

const postPhrase = async function (req, res) {
  const { userName, phraseSet } = req.body;
  const phraseToSave = new Phrase({
    userName,
    phrase: phraseSet.phrase,
    translation: phraseSet.translation,
  });
  try {
    await phraseToSave.save();
    return res.status(200);
  } catch (e) {
    return res.status(400).json({
      error: "Email is taken",
    });
  }
};

module.exports = {
  postPhrase,
};
