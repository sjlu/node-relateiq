var request = require('request');
var _ = require('lodash');

var RelateIQ = (function() {

  var url = 'https://api.relateiq.com/v2/';

  function RelateIQ(apiKey, apiSecret) {
    request = request.defaults({
      auth: {
        user: apiKey,
        pass: apiSecret,
        sendImmediately: true
      }
    });
  }

  var makeRequest = function(uri, data, cb) {
    // set defaults and set the
    // api user and secret key
    // as the request's basic auth
    data = data || {};
    data.method = data.method || "GET";

    request(url + uri, data, function(err, httpReq, body) {
      if (err) return cb(err);

      switch(httpReq.statusCode) {
        case 200:
          break;
        case 400:
          return cb(new Error('bad request'));
          break;
        case 401:
          return cb(new Error('unauthorized'));
          break;
        case 403:
          return cb(new Error('forbidden'));
          break;
        case 404:
          return cb(new Error('not found'));
          break;
        case 422:
          return cb(new Error('unprocessable entity'));
          break;
        case 429:
          return cb(new Error('too many requests'));
          break;
        case 500:
          return cb(new Error('internal server error'))
          break;
        case 503:
          return cb(new Error('service unavailable'));
          break;
        default:
          return cb(new Error('unrecognized http status code'));
          break;
      }

      try {
        if ("string" === typeof body) {
          body = JSON.parse(body);
        }
      } catch (e) {
        return cb(new Error('unreadable data'));
      }

      if (body.objects) {
        body = body.objects;
      }

      cb(err, body);
    });
  }

  RelateIQ.prototype.getAccounts = function(cb) {
    makeRequest('accounts', {}, cb);
  }

  RelateIQ.prototype.createAccount = function(account, cb) {
    if (!account.name) return cb(new Error('Name is required'));
    account = _.pick(account, 'name');

    makeRequest('accounts', {
      method: 'POST',
      json: account
    }, cb);
  }

  RelateIQ.prototype.createContact = function(contact, cb) {
    if (!contact.name) return cb(new Error('Name is required'));
    contact = _.pick(contact, [
      'name',
      'email',
      'phone',
      'address',
      'company',
      'title'
    ]);

    _.each(contact, function(values, key) {
      if (Array.isArray(values)) {
        values = _.map(values, function(value) {
          return {
            "value": value
          }
        })
      } else if ("string" === typeof values) {
        values = [{
          "value": values
        }];
      } else {
        return; // unrecognized
      }

      contact[key] = values;
    });

    makeRequest('contacts', {
      method: 'POST',
      json: {
        properties: contact
      }
    }, cb);
  }

  RelateIQ.prototype.getContacts = function(cb) {
    makeRequest('contacts', {}, cb);
  }

  RelateIQ.prototype.getLists = function(cb) {
    makeRequest('lists?_start=0&_limit=50', {}, cb);
  }

  RelateIQ.prototype.getListItems = function(listId, cb) {
    makeRequest('lists/' + listId + '/listitems', {}, cb);
  }

  RelateIQ.prototype.getListItem = function(listId, listItemId, cb) {
    makeRequest('lists/' + listId + '/listitems/' + listItemId, {}, cb);
  }

  RelateIQ.prototype.createListItem = function(listId, listItem, cb) {
    if (!listItem.accountId && !listItem.contactIds) {
      return cb(new Error('accountId or contactIds is required'))
    }
    listItem = _.pick(listItem, [
      "accountId",
      "contactIds",
      "name",
      "fieldValues"
    ]);
    var req = {
      method: "POST",
      json: listItem
    };

    makeRequest('lists/' + listId + '/listitems', req, cb);
  }

  RelateIQ.prototype.updateListItem = function(listId, listItemId, listItem, cb) {
    var req = {
      method: "PUT",
      json: listItem
    };
    makeRequest('lists/' + listId + '/listitems/' + listItemId, req, cb);
  }

  return RelateIQ;

})();

module.exports = RelateIQ;
