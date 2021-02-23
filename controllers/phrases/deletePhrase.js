const Phrase = require("../../models/phrase");

const deletePhrases = async function (req, res) {
  const { phrase } = req.body;
  try {
    await Phrase.deleteOne({ phrase });
    res.status(200).json({ success: "success" });
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

module.exports = {
  deletePhrases,
};
