'use strict';
const alfy = require('alfy');

const API_URL = `https://api.scryfall.com/cards/search?q=include%3Aextras+${encodeURI(alfy.input)}`;
const SEARCH_URL = `https://www.scryfall.com/search?q=include%3Aextras+${encodeURI(alfy.input)}`;

const EMPTY = [{
  title: '¯\\_(ツ)_/¯',
  subtitle: `Hellbent: no cards matching "${alfy.input}".`,
  arg: SEARCH_URL,
  quicklookurl: SEARCH_URL
}];
const SEARCH = [{
  uid: `on-site-${alfy.input}`,
  title: 'Search on Scryfall',
  arg: SEARCH_URL,
  quicklookurl: SEARCH_URL
}];

const ONE_HOUR = 1000 * 60 * 60;

const formatCard = card => {
  const output = {
    uid: card.id,
    title: card.name,
    subtitle: card.type_line,
    arg: card.scryfall_uri,
    quicklookurl: card.scryfall_uri,
    autocomplete: card.name
  };
  if (card.name === 'Amoeboid Changeling') {
    output.icon = { path: 'img/o.O.jpg' };
  }
  return output;
}

alfy.fetch(API_URL, { maxAge: ONE_HOUR })
  .then(results => {
    if (results.object === "error") {
      alfy.output(EMPTY);
    } else {
      alfy.output(SEARCH.concat(results.data.slice(0, 10).map(formatCard)));
    }
  })
  .catch(err => {
    alfy.output(EMPTY);
  });
