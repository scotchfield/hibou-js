var hibou = (function () {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        var acorn = require('acorn');
    }

    var exports = {}, root = false,

    is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },

    has_node = function (node, type) {
        var child, subchild;

        if (node['type'] === type) {
            return node;
        }

        for (child in node) {
            if (node.hasOwnProperty(child) &&
                    node[child] && typeof node[child] === 'object' &&
                    is_array(node[child])) {
                for (subchild in node[child]) {
                    if (has_node(node[child][subchild], type)) {
                        return node;
                    }
                }
            }
        }
        return false;
    };

    exports.whitelist = function (code) {
        var tree = acorn.parse(code), i, result = true;

        for (i = 1; i < arguments.length; i += 1) {
            if (! has_node(tree, arguments[i])) {
                result = arguments[i];
                break;
            }
        }

        return result;
    };

    exports.blacklist = function (code, rules) {
        var tree = acorn.parse(code), i, result = false;

        for (i = 1; i < arguments.length; i += 1) {
            if (has_node(tree, arguments[i])) {
                result = arguments[i];
                break;
            }
        }

        return result;
    };

    exports.expected = function (code, rules) {
        var tree = acorn.parse(code);

        return get_missing_rules(check_rules(tree, rules), rules);
    };

    return exports;
}());

var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

console.log(hibou.whitelist(code, 'ForStatement', 'AssignStatement'));
console.log(hibou.blacklist(code, 'ForStatement', 'AssignStatement'));