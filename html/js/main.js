var editor;

$(function () {
    if (typeof ace !== 'undefined') {
        editor = ace.edit('ace_editor_hibou');
        editor.container.style.opacity = '';
        editor.session.setMode('ace/mode/javascript');
        editor.setAutoScrollEditorIntoView(true);
        editor.setOption('maxLines', 24);

        editor.check_id = false;

        editor.checkCode = function () {
            $('#whitelist').removeClass('invis')
                .html('Whitelist results (ForStatement): ' + hibou.whitelist(
                    editor.getValue(), 'ForStatement'));

            $('#blacklist').removeClass('invis')
                .html('Blacklist results (ForStatement): ' + hibou.blacklist(
                    editor.getValue(), 'ForStatement'));

            $('#expected').removeClass('invis')
                .html('Expected results (ForStatement): ' + hibou.expected(
                    editor.getValue(), 'ForStatement'));
            };

        editor.on('input', function() {
            if (false !== editor.check_id) {
                clearTimeout(editor.check_id);
            }

            $('#whitelist').addClass('invis');
            $('#blacklist').addClass('invis');
            $('#expected').addClass('invis');
            editor.check_id = setTimeout(editor.checkCode, 1000);
        });
    }
});
