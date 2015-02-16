var hibou = (function () {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        var acorn = require('acorn');
    } else {
        var acorn = window.acorn;
        if (typeof acorn === 'undefined') {
            throw {
                name: 'AcornNotFoundError',
                message: 'Acorn not found'
            };
        }
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

    exports.whitelist = function (code, node_type) {
        var tree = acorn.parse(code), i, result = true;

        if (typeof node_type === 'string') {
            if (false === has_node(tree, node_type)) {
                result = node_type;
            }
        } else if (is_array(node_type)) {
            for (i = 0; i < node_type.length; i += 1) {
                tree = has_node(tree, node_type[i]);
                if (false === tree) {
                    result = node_type[i];
                    break;
                }
            }

        }

        return result;
    };

    exports.blacklist = function (code, node_type) {
        var tree = acorn.parse(code), i, result = false;

        if (typeof node_type === 'string') {
            if (has_node(tree, node_type)) {
                result = node_type;
            }
        } else if (is_array(node_type)) {
            for (i = 0; i < node_type.length; i += 1) {
                tree = has_node(tree, node_type[i]);
                if (false !== tree) {
                    result = node_type[i];
                    break;
                }
            }

        }

        return result;
    };

    exports.expected = function (code, rules) {
        var tree = acorn.parse(code);

        return '';
        //return get_missing_rules(check_rules(tree, rules), rules);
    };

    return exports;
}());

/*var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

console.log(hibou.whitelist(code, 'ForStatement'));
console.log(hibou.whitelist(code, ['ForStatement', 'VariableDeclaration']));
console.log(hibou.whitelist(code, ['None', 'ForStatement']));
console.log(hibou.whitelist(code, ['ForStatement', 'None']));

console.log(hibou.blacklist(code, 'VariableDeclaration'));
console.log(hibou.blacklist(code, ['ForStatement', 'VariableDeclaration']));
console.log(hibou.blacklist(code, ['None', 'ForStatement']));
console.log(hibou.blacklist(code, ['ForStatement', 'None']));
*/