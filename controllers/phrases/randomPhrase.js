const randomPhrase = async function (req, res) {
  const { userName } = req.body;
  try {
    const phrases = await Phrase.findOne({ userName });
    if (!phrases) {
      return res.status(400).json({
        error: "No phrases have been created yet",
      });
    }
    const makeRandomNum = function (min, max) {
      return 0 + Math.floor(Math.random() * (max + 1 - min));
    };
    const numberPointer = makeRandomNum(0, this.props.phrases.length - 1);

    return res.send({
      phraseToTrain: phrases[numberPointer],
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  randomPhrase,
};
