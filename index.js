'use strict';
const alfy = require('alfy');
const URI = require('urijs');

const ONE_HOUR = 1000 * 60 * 60;

const formatURI = uri => {
  return new URI(uri).setSearch({
    'utm_source': 'alfred'
  }).toString();
}

const Q = alfy.input.replace(/\++/g, '').trim();
const API_URL = new URI('https://api.scryfall.com/cards/search').setSearch('q', Q).toString();
const AUTOCOMPLETE_URL = new URI('https://api.scryfall.com/cards/autocomplete').setSearch('q', Q).toString();
const SEARCH_URL = formatURI(new URI('https://www.scryfall.com/search').setSearch('q', Q).toString());

const EMPTY = [{
  title: '¯\\_(ツ)_/¯',
  subtitle: `Hellbent: no cards matching "${Q}".`,
  arg: SEARCH_URL,
  quicklookurl: SEARCH_URL
}];

const SEARCH = [{
  uid: `on-site-${Q}`,
  title: 'Search on Scryfall',
  arg: SEARCH_URL,
  quicklookurl: SEARCH_URL
}];

const formatFullCard = card => {
  const output = {
    uid: card.id,
    title: card.name,
    arg: formatURI(card.scryfall_uri),
    quicklookurl: formatURI(card.scryfall_uri),
    autocomplete: card.name
  };
  if (card.name === 'Amoeboid Changeling') {
    output.icon = { path: 'img/o.O.jpg' };
  }
  return output;
}

const formatAbbreviatedCard = card => {
  const QUERY = encodeURI(`!"${card}"`);
  const URL = formatURI(`https://scryfall.com/search?q=${QUERY}`);
  const output = {
    uid: URL,
    title: card,
    arg: URL,
    quicklookurl: URL,
    autocomplete: card
  };
  if (card === 'Amoeboid Changeling') {
    output.icon = { path: 'img/o.O.jpg' };
  }
  return output;
}

if (
  /\S[:=<>]+\S/g.test(Q) ||
  /[\(\)|!]+/g.test(Q)
) {
  alfy.fetch(API_URL, { maxAge: ONE_HOUR })
    .then(results => {
      if (results.object === "error") {
        alfy.output(EMPTY);
      } else {
        alfy.output(SEARCH.concat(results.data.slice(0, 10).map(formatFullCard)));
      }
    })
    .catch(err => {
      alfy.output(EMPTY);
    });
} else {
  alfy.fetch(AUTOCOMPLETE_URL, { maxAge: ONE_HOUR })
    .then(results => {
      if (results.object === "error") {
        alfy.output(EMPTY);
      } else {
        alfy.output(SEARCH.concat(results.data.slice(0, 10).map(formatAbbreviatedCard)));
      }
    })
    .catch(err => {
      alfy.output(EMPTY);
    });
}
