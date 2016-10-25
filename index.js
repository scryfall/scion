'use strict';
const alfy = require('alfy');

const EMPTY = [{
  title: '¯\\_(ツ)_/¯',
  subtitle: `Hellbent: no cards matching "${alfy.input}".`,
  valid: false
}];
const ONE_HOUR = 1000 * 60 * 60;
const SCRYFALL = `https://api.scryfall.com/cards/search?q=include%3Aextras+${encodeURI(alfy.input)}`;

alfy.fetch(SCRYFALL, { maxAge: ONE_HOUR })
  .then(results => {
    if (results.object === "error") {
      alfy.output(EMPTY);
    } else {
      alfy.output(results.data.slice(0, 10).map(card => ({
        uid: card.id,
        title: card.name,
        subtitle: card.type_line,
        arg: card.scryfall_uri,
        quicklookurl: card.scryfall_uri,
        autocomplete: card.name
      })));
    }
  })
  .catch(err => {
    alfy.output(EMPTY);
  });
