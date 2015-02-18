// hibou.js, providing a whitelist, blacklist, and expected structure to
// complement standard unit testing.
//
// hibou.js exposes three functions to window (inside a browser) or to
// global (inside node.js).
// * whitelist: Accepts a JavaScript string and a single rule, and returns true if the rule is matched, otherwise false.
// * blacklist: Accepts a JavaScript string and a single rule, and returns false if the rule is matched, otherwise true.
// * expected: Accepts a JavaScript string and any number of additional rules as arguments. Returns true if all rules match, or an array of unmatched rules.

var hibou = (function () {
    'use strict';

    // Define a variable to hold our parser. hibou uses the Acorn parser
    // because it is faster on small code samples like the ones we expect
    // to be using while offering the same AST format.
    // However, due to the similarity in APIs, we can switch out if necessary.
    var parser;

    if (typeof module !== 'undefined' && module.exports) {
        parser = require('acorn');
    } else {
        parser = window.acorn;
        if (typeof parser === 'undefined') {
            throw {
                name: 'ParserNotFoundError',
                message: 'Parser not found'
            };
        }
    }

    var exports = {},

    // Borrowing _is_array_ from (Crockford 2008)
    is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },

    // Accept a node in the AST (for example, the root from _parse_), and
    // a string describing the type of the node. Recursively iterate down the
    // tree to see if the node exists. If the node is not found, return false.
    // Otherwise, return the node.
    has_node = function (node, type) {
        var child, subchild;

        if (! node) {
            return false;
        }

        if (node === type || node.type === type) {
            return node;
        }

        for (child in node) {
            if (node.hasOwnProperty(child) &&
                    node[child] && typeof node[child] === 'object') {
                for (subchild in node[child]) {
                    if (has_node(node[child][subchild], type)) {
                        return node;
                    }
                }
            }
        }

        return false;
    };

    // Accepts a JavaScript code string and a node rule to find.
    // node may be either a single string (for example, 'ForStatement'),
    // or an array of strings corresponding to successive child nodes in the
    // AST (for example, ['ForStatement', 'IfStatement'] represents a
    // for-statement that contains an if-statement).
    exports.whitelist = function (code, node) {
        var tree = parser.parse(code);

        return (function () {
            var i, root;
            node = is_array(node) ? node : [node];
            root = tree;
            for (i = 0; i < node.length; i += 1) {
                root = has_node(root, node[i]);
                if (false === root) {
                    return false;
                }
            }
            return true;
        }());
    }

    // Accepts a JavaScript code string and a node rule to find.
    // The rule format is similar to _whitelist_ above. If a rule is not
    // found, return true. Otherwise, if the rule is found while it has been
    // blacklisted, return false.
    exports.blacklist = function (code, node) {
        var tree = parser.parse(code);

        return (function () {
            var i, root, child, result = true;
            node = is_array(node) ? node : [node];
            root = tree;
            for (child in node) {
                root = has_node(root, node[child]);
                if (false !== root) {
                    result = false;
                } else {
                    return true;
                }
            }
            return result;
        }());
    }

    // Accepts a JavaScript code string and any number of additional rules
    // to find. If all of the provided rules match, return true. Otherwise,
    // return an array containing each of the unmatched rules.
    exports.expected = function (code) {
        var tree = parser.parse(code);

        return (function (args) {
            var i, j, result = [], node, root;
            for (j = 1; j < args.length; j += 1) {
                node = is_array(args[j]) ? args[j] : [args[j]];
                root = tree;
                for (i = 0; i < node.length; i += 1) {
                    root = has_node(root, node[i]);
                    if (false === root) {
                        result.push(node);
                        break;
                    }
                }
            }
            return result.length ? result : true;
        }(arguments));
    }

    return exports;
}());

// Allow node.js to see hibou.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = hibou;
}
