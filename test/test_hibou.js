QUnit.test('Basic whitelist examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

    assert.equal(hibou.whitelist(code, 'ForStatement'), true);
    assert.equal(hibou.whitelist(code, ['ForStatement', 'VariableDeclaration']), true);
    assert.equal(hibou.whitelist(code, ['None', 'ForStatement']),
                 ['None', 'ForStatement'].toString());
    assert.equal(hibou.whitelist(code, ['ForStatement', 'None']),
                 ['ForStatement', 'None'].toString());
});

QUnit.test('Basic blacklist examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

    assert.equal(hibou.blacklist(code, 'VariableDeclaration'), 'VariableDeclaration');
    assert.equal(hibou.blacklist(code, ['ForStatement', 'VariableDeclaration']),
                 ['ForStatement', 'VariableDeclaration'].toString());
    assert.equal(hibou.blacklist(code, ['None', 'ForStatement']), true);
    assert.equal(hibou.blacklist(code, ['ForStatement', 'None']),
                 ['ForStatement', 'None'].toString());
});

QUnit.test('Basic expected examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

    assert.equal(hibou.expected(code, 'ForStatement'), true);
    assert.equal(hibou.expected(code, ['ForStatement', 'VariableDeclaration']), true);
    assert.equal(hibou.expected(code, ['None', 'ForStatement']),
                 [['None', 'ForStatement']].toString());
    assert.equal(hibou.expected(code, ['ForStatement', 'None']),
                 [['ForStatement', 'None']].toString());

    assert.equal(hibou.expected(code, 'VariableDeclaration', 'ForStatement'), true);
});
