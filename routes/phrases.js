const express = require("express");
const router = express.Router();
const phraseToTrain = require("../controllers/phrases").default;

router.get("/getPhraseToTrain", phraseToTrain);

module.exports = router;
