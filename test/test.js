var RelateIQ = require('../index');
var util = require('util');
var async = require('async');
var assert = require('assert');
var uid = require('uid');
var _ = require('lodash');

function print(err, data) {
  console.log(err);
  console.log(util.inspect(data, false, null));
}

describe('AllTests', function() {

  var relateIQ = new RelateIQ('538cdc79e4b04d134110f77b', 'lfE1lEihxIgy0QcfP1fdXUqfU6c');
  var accountId = null;
  var companyName = uid(24).toLowerCase();
  var contactName = uid(24).toLowerCase();
  contactName = contactName.substring(0, 1).toUpperCase() + contactName.substring(1);
  var contactEmail = uid(24).toLowerCase() + '@' + uid(12).toLowerCase() + '.com';
  var contactId = null;
  var listId = null;
  var listItemId = null;

  it('should create an account', function(done) {
    relateIQ.createAccount({
      name: companyName
    }, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.equal(data.name, companyName);
      assert.ok(data.id);

      accountId = data.id;

      done();
    });
  });

  it('should retrieve the account', function(done) {
    relateIQ.getAccount(accountId, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.equal(data.name, companyName);
      assert.ok(data.id);

      done();
    });
  });

  it('should create a contact', function(done) {
    var name = uid(24);
    var company =
    relateIQ.createContact({
      name: contactName,
      company: companyName,
      email: contactEmail
    }, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.ok(data.id);
      assert.equal(_.first(data.properties.email).value, contactEmail);

      contactId = data.id;

      done();
    });
  });

  it('should get a list', function(done) {
    relateIQ.getLists(function(err, data) {
      assert.ifError(err);
      print(err, data);

      var list = _.first(data);
      assert.ok(list.id);

      listId = list.id;

      done();
    });
  });

  it('should create a list item', function(done) {
    relateIQ.createListItem(listId, {
      listId: listId,
      accountId: accountId,
      contactIds: [
        contactId
      ],
      // name: companyName
    }, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.ok(data.id);
      assert.equal(data.name, companyName);
      assert.equal(data.accountId, accountId);

      listItemId = data.id;

      done();
    });
  });

  var listItem = null;

  it('should obtain a list item', function(done) {
    relateIQ.getListItem(listId, listItemId, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.ok(data.id);

      listItem = data;

      done();
    });
  });

  it('should properly update a list item', function(done) {
    listItem.name = uid(20);
    relateIQ.updateListItem(listId, listItemId, listItem, function(err, data) {
      assert.ifError(err);
      print(err, data);

      assert.ok(data.id);
      assert.equal(data.name, listItem.name);

      listItem = data;

      done();
    });
  });

  it('should remove a list item', function(done) {
    relateIQ.removeListItem(listId, listItemId, function(err, data) {
      assert.ifError(err);
      print(err, data);

      done();
    });
  })

});