var hibou = (function () {
    'use strict';

    var acorn;

    if (typeof module !== 'undefined' && module.exports) {
        acorn = require('acorn');
    } else {
        acorn = window.acorn;
        if (typeof acorn === 'undefined') {
            throw {
                name: 'AcornNotFoundError',
                message: 'Acorn not found'
            };
        }
    }

    var exports = {},

    is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },

    has_node = function (node, type) {
        var child, subchild;

        if (node.type === type) {
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

    exports.whitelist = function (code, node) {
        var tree = acorn.parse(code);

        return (function () {
            var i;
            node = is_array(node) ? node : [node];
            for (i = 0; i < node.length; i += 1) {
                tree = has_node(tree, node[i]);
                if (false === tree) {
                    return node;
                }
            }
            return true;
        }());
    }

    exports.blacklist = function (code, node) {
        var tree = acorn.parse(code);

        return (function () {
            var i;
            node = is_array(node) ? node : [node];
            for (i = 0; i < node.length; i += 1) {
                tree = has_node(tree, node[i]);
                if (false !== tree) {
                    return node;
                }
            }
            return true;
        }());
    }

    exports.expected = function (code) {
        var tree = acorn.parse(code);

        return (function (args) {
            var i, j, result = [], node;
            for (j = 1; j < args.length; j += 1) {
                node = is_array(args[j]) ? args[j] : [args[j]];
                for (i = 0; i < node.length; i += 1) {
                    tree = has_node(tree, node[i]);
                    if (false === tree) {
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
