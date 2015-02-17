var fs = require('fs');

var acorn = require('acorn');
var esprima = require('esprima');

function nanotime() {
    var t = process.hrtime();
    return t[0] * 1e9 + t[1];
}

function test_acorn(js) {
    var i, t = nanotime();
    for (i = 0; i < 10000; i += 1) {
        acorn.parse(js);
    }
    console.log('  acorn: ' + (nanotime() - t) + 'ns');
}

function test_esprima(js) {
    var i, t = nanotime();
    for (i = 0; i < 10000; i += 1) {
        esprima.parse(js);
    }
    console.log('esprima: ' + (nanotime() - t) + 'ns');
}

fs.readFile('hibou.js', function(e, data) {
    var i;
    for (i = 0; i < 10; i += 1) {
        test_acorn(data);
        test_esprima(data);
    }
});
