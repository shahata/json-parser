/* exported Parser */
function Parser() {
  'use strict';

  this.parse = function (json) {

    function extractCollection(start, end, base, add) {
      if (extractSeparator(start, true)) {
        if (!extractSeparator(end, true)) {
          do {
            add.call(base, extractValue());
          } while (extractSeparator(',', true));
          extractSeparator(end);
        }
        return base;
      }
    }

    function extractArray() {
      return extractCollection('[', ']', [], Array.prototype.push);
    }

    function extractObject() {
      return extractCollection('{', '}', {}, function (key) {
        if (typeof(key) === 'string') {
          this[key] = extractSeparator(':') && extractValue();
        } else {
          throw 'expected ' + key + ' to be a string';
        }
      });
    }

    function extractValue() {
      var value;
      matchers.some(function (matcher) {
        if (typeof(matcher) === 'function') {
          value = matcher();
        } else {
          json = json.trim().replace(matcher.regexp, function (match, expression) {
            value = matcher.parse(expression);
            return '';
          });
        }
        return value !== undefined;
      });
      return value;
    }

    var original = json;
    function extractSeparator(separator, soft) {
      var next = json.trim()[0];
      if (next === separator) {
        json = json.trim().slice(1);
        return true;
      } else if (!soft) {
        throw 'expected ' + next + ' to be ' + separator + ' (' + original.lastIndexOf(json) + ')';
      }
    }

    var matchers = [
      {
        regexp: /^"([^"]*)"/,
        parse: function (value) { return value; }
      }, {
        regexp: /^(-?\d+(\.\d+)?)/,
        parse: function (value) { return parseFloat(value, 10); }
      }, {
        regexp: /^(true|false)/,
        parse: function (value) { return value === 'true'; }
      }, {
        regexp: /^(null)/,
        parse: function () { return null; }
      },
      extractArray, extractObject, function () { extractSeparator('a value'); }
    ];

    var result = extractObject();
    extractSeparator(result ? undefined : '{');
    return result;
  };
}