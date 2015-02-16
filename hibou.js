var hibou = (function () {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        var acorn = require('acorn');
        var esprima = require('esprima');
    }

    var exports = {},

    is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },

    has_node = function (node, type) {
        var child, subchild;

        if (node['type'] === type) {
            return true;
        }

        for (child in node) {
            if (node.hasOwnProperty(child) &&
                    node[child] && typeof node[child] === 'object' &&
                    is_array(node[child])) {
                for (subchild in node[child]) {
                    if (has_node(node[child][subchild], type)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    check_rules = function (code, rules) {
        var result = {}, rule;

        for (rule in rules) {
            if (is_array(rules[rule])) {
                //return false; // todo
            }
            result[rules[rule]] = has_node(code, rules[rule]);
        }

        return result;
    },

    get_broken_rules = function (rules, expected) {
        var rule, broken = [];

        for (rule in rules) {
            if (rules[rule] !== expected) {
                broken.push(rule);
            }
        }

        return broken;
    },

    get_missing_rules = function (tree_rules, expected_rules) {
        var rule, missing = [];

        for (rule in expected_rules) {
            if (! tree_rules.hasOwnProperty(expected_rules[rule])) {
                missing.push(expected_rules[rule]);
            }
        }

        return missing;
    }

    exports.whitelist = function (code, rules) {
        var tree = acorn.parse(code);

        return get_broken_rules(check_rules(tree, rules), true);
    };

    exports.blacklist = function (code, rules) {
        var tree = acorn.parse(code);

        return get_broken_rules(check_rules(tree, rules), false);
    }

    exports.expected = function (code, rules) {
        var tree = acorn.parse(code);

        return get_missing_rules(check_rules(tree, rules), rules);
    }

    return exports;
}());

var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';
var rules = [
    'ForStatement',
    'NopeStatement'
];

console.log('whitelist:');
console.log(hibou.whitelist(code, rules));
console.log('blacklist:');
console.log(hibou.blacklist(code, rules));
console.log('expected:');
console.log(hibou.expected(code, rules));
