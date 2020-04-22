const express = require("express");
const router = express.Router();
const { randomPhrase } = require("../controllers/phrases/randomPhrase");
const { getPhrases } = require("../controllers/phrases/getPhrases");
const { postPhrase } = require("../controllers/phrases/postPhrase");

router.get("/randomPhrase", randomPhrase);
router.get("/phrases", getPhrases);
router.post("/phrases", postPhrase);

module.exports = router;
