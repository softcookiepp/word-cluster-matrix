const GrammarField = require('../grammarField');

// a simple test to ensure that the word blacklist implementation is functioning
// generates a small grammar field with blacklist and logs relevant info to console
grammarField = new GrammarField( ["the quick brown fox", "jumped over the lazy dog"], [0, 1], ["fox", "dog"] );
console.log("wordBlacklist:");
console.log(grammarField.wordBlacklist);
console.log("uniqueWords:");
console.log(grammarField.uniqueWords);
