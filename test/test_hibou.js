QUnit.test('Whitelist single-token examples that pass', function(assert) {
    assert.equal(hibou.whitelist('var a = 1;', 'VariableDeclaration'), true);
    assert.equal(hibou.whitelist('if (true) {}', 'IfStatement'), true);
    assert.equal(hibou.whitelist('for (;;) {}', 'ForStatement'), true);
    assert.equal(hibou.whitelist('x = function () { return x; }', 'ReturnStatement'), true);
});

QUnit.test('Whitelist single-token examples that are caught', function(assert) {
    assert.equal(hibou.whitelist('', 'VariableDeclaration'), false);
    assert.equal(hibou.whitelist('for (var x = 1; x < 10; x += 1) { y += 1; }', 'ReturnStatement'), false);
});

QUnit.test('Whitelist nested examples that pass', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; } if (y === 3) { var q = function () { return; }; }';

    assert.equal(hibou.whitelist(code, ['ForStatement', 'VariableDeclarator']), true);
    assert.equal(hibou.whitelist(code, ['ForStatement', 'VariableDeclaration']), true);
    assert.equal(hibou.whitelist(code, ['IfStatement', 'FunctionExpression', 'ReturnStatement']), true);
});

QUnit.test('Whitelist nested examples that are caught', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; }';

    assert.equal(hibou.whitelist(code, ['None', 'ForStatement']), false);
    assert.equal(hibou.whitelist(code, ['ForStatement', 'None']), false);
});

QUnit.test('Blacklist single-token examples that pass', function(assert) {
    assert.equal(hibou.blacklist('', 'VariableDeclaration'), true);
    assert.equal(hibou.blacklist('x = 1;', 'IfStatement'), true);
    assert.equal(hibou.blacklist('x = 1;', 'ForStatement'), true);
});

QUnit.test('Blacklist single-token examples that are caught', function(assert) {
    assert.equal(hibou.blacklist('var x = 1', 'VariableDeclaration'), false);
    assert.equal(hibou.blacklist('if (true) {}', 'IfStatement'), false);
    assert.equal(hibou.blacklist('for (;;) {}', 'ForStatement'), false);
});

QUnit.test('Blacklist nested examples that pass', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; }';

    assert.equal(hibou.blacklist(code, ['None', 'ForStatement']), true);
    assert.equal(hibou.blacklist(code, ['ForStatement', 'None']), true);
});

QUnit.test('Blacklist nested examples that are caught', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; } if (y === 3) { var q = function () { return; }; }';

    assert.equal(hibou.blacklist(code, ['ForStatement', 'VariableDeclarator']), false);
    assert.equal(hibou.blacklist(code, ['ForStatement', 'VariableDeclaration']), false);
    assert.equal(hibou.blacklist(code, ['IfStatement', 'FunctionExpression', 'ReturnStatement']), false);
});

QUnit.test('Basic blacklist examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; }';

    assert.equal(hibou.blacklist(code, 'VariableDeclaration'), false);
    assert.equal(hibou.blacklist(code, ['ForStatement', 'VariableDeclaration']), false);
    assert.equal(hibou.blacklist(code, ['None', 'ForStatement']), true);
    assert.equal(hibou.blacklist(code, ['ForStatement', 'None']), true);
});

QUnit.test('Basic expected examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i = 0; i < 10; i += 1) { x = y; }';

    assert.equal(hibou.expected(code, 'ForStatement'), true);
    assert.equal(hibou.expected(code, ['ForStatement', 'VariableDeclaration']), true);
    assert.equal(hibou.expected(code, ['None', 'ForStatement']),
                 [['None', 'ForStatement']].toString());
    assert.equal(hibou.expected(code, ['ForStatement', 'None']),
                 [['ForStatement', 'None']].toString());

    assert.equal(hibou.expected(code, 'VariableDeclaration', 'ForStatement'), true);
});
