/* global Parser */
'use strict';

describe('Parser', function () {
  function expectJsonToParse(json) {
    var parser = new Parser();
    if (typeof(json) === 'object') {
      json = JSON.stringify(json);
    }
    expect(parser.parse(json)).toEqual(JSON.parse(json));
  }

  function expectJsonParser(json) {
    var parser = new Parser();
    return expect(function () {
      parser.parse(json);
    });
  }

  describe('sunny day parsing', function () {
    it('should parse empty object', function () {
      expectJsonToParse({});
    });

    it('should parse object with one string value', function () {
      expectJsonToParse({a: 'b'});
    });

    it('should parse object with two string value', function () {
      expectJsonToParse({a: 'b', c: 'd'});
    });

    it('should parse object with integer value', function () {
      expectJsonToParse({a: 5});
    });

    it('should parse object with negative value', function () {
      expectJsonToParse({a: -5});
    });

    it('should parse object with floating point value', function () {
      expectJsonToParse({a: 5.5});
    });

    it('should parse object with true value', function () {
      expectJsonToParse({a: true});
    });

    it('should parse object with false value', function () {
      expectJsonToParse({a: false});
    });

    it('should parse object with null value', function () {
      expectJsonToParse({a: null});
    });

    it('should parse object with empty array value', function () {
      expectJsonToParse({a: []});
    });

    it('should parse object with non-empty array value', function () {
      expectJsonToParse({a: ['b']});
    });

    it('should parse object with object value', function () {
      expectJsonToParse({a: {b: 'c'}});
    });

    it('should parse complex object', function () {
      expectJsonToParse({a: {b: 'c'}, d: [1, 2, false, []], e: {f: {}}});
    });

    it('should not care about whitespace', function () {
      expectJsonToParse(' { "a" : "b" } ');
    });
  });

  describe('error handling', function () {
    it('should throw if ":" separtor is missing', function () {
      expectJsonParser('{"a"L"b"}').toThrow('expected L to be : (4)');
    });

    it('should throw if "}" separtor is missing', function () {
      expectJsonParser('{"a":"b"L').toThrow('expected L to be } (8)');
    });

    it('should throw if "]" separtor is missing', function () {
      expectJsonParser('{"a":["b"L').toThrow('expected L to be ] (9)');
    });

    it('should throw if value is adjacent', function () {
      expectJsonParser('{"a":"b"5}').toThrow('expected 5 to be } (8)');
    });

    it('should throw if array is adjacent', function () {
      expectJsonParser('{"a":"b"[]}').toThrow('expected [ to be } (8)');
    });

    it('should throw if redundant missing value after ","', function () {
      expectJsonParser('{"a":"b",}').toThrow('expected } to be a value (9)');
    });

    it('should throw if redundant missing value after ":"', function () {
      expectJsonParser('{"a":}').toThrow('expected } to be a value (5)');
    });

    it('should throw if object key is not a string', function () {
      expectJsonParser('{1:"b",}').toThrow('expected 1 to be a string');
    });

    it('should throw if shit appears after json', function () {
      expectJsonParser('{}shit').toThrow('expected s to be undefined (2)');
    });

    it('should throw if shit appears instead of json', function () {
      expectJsonParser('shit').toThrow('expected s to be { (0)');
    });
  });

});
