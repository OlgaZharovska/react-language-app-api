const Phrase = require("../../models/phrase");

const getPhrases = async function (req, res) {
  const { userName } = req.body;
  try {
    const phrases = await Phrase.find({ userName });
    res.send(phrases);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

module.exports = {
  getPhrases,
};
