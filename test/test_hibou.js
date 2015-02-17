QUnit.test('Basic whitelist examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

    assert.equal(true, hibou.whitelist(code, 'ForStatement'));
    assert.equal(true, hibou.whitelist(code, ['ForStatement', 'VariableDeclaration']));
    assert.equal('None', hibou.whitelist(code, ['None', 'ForStatement']));
    assert.equal('None', hibou.whitelist(code, ['ForStatement', 'None']));
});

QUnit.test('Basic blacklist examples', function(assert) {
    var code = 'var answer = 6 * 7; for (var i=0; i<10; i+=1) { x = y; }';

    assert.equal('VariableDeclaration', hibou.blacklist(code, 'VariableDeclaration'));
    assert.equal('ForStatement', hibou.blacklist(code, ['ForStatement', 'VariableDeclaration']));
    assert.equal(false, hibou.blacklist(code, ['None', 'ForStatement']));
    assert.equal('ForStatement', hibou.blacklist(code, ['ForStatement', 'None']));
});

