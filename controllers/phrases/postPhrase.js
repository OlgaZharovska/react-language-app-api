const Phrase = require("../../models/phrase");

const postPhrase = async function (req, res) {
  const { phrase, translation, category, userName } = req.body;
  console.log(userName);
  const phraseToSave = new Phrase({
    phrase,
    translation,
    userName,
    category,
  });
  try {
    await phraseToSave.save();
    return res.send({ suces: "suces" });
  } catch (e) {
    return res.status(400).json({
      error: "Email is taken",
    });
  }
};

module.exports = {
  postPhrase,
};
