var hibou = (function () {
    'use strict';

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

    is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },

    has_node = function (node, type) {
        var child, subchild;
console.log(node);
        if (node === type || node && node.type === type) {
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

    exports.whitelist = function (code, node) {
        var tree = parser.parse(code);

        return (function () {
            var i, root;
            node = is_array(node) ? node : [node];
            root = tree;
            for (i = 0; i < node.length; i += 1) {
                root = has_node(root, node[i]);
                if (false === root) {
                    return node;
                }
            }
            return true;
        }());
    }

    exports.blacklist = function (code, node) {
        var tree = parser.parse(code);

        return (function () {
            var i, root;
            node = is_array(node) ? node : [node];
            root = tree;
            for (i = 0; i < node.length; i += 1) {
                root = has_node(root, node[i]);
                if (false !== root) {
                    return node;
                }
            }
            return true;
        }());
    }

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

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = hibou;
}
