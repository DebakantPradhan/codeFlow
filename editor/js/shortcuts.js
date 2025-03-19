// Setup keyboard shortcuts for the editor
function setupKeyboardShortcuts(editor) {
    // Save (Ctrl+S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
        document.getElementById('save-button').click();
    });

    // Run code (Ctrl+B)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, function() {
        document.getElementById('run-button').click();
    });

    // Toggle console (Ctrl+Shift+B)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB, function() {
        document.getElementById('console-toggle').click();
    });

    // Toggle comment (Ctrl+/)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, function() {
        editor.trigger('keyboard', 'editor.action.commentLine');
    });

    // Format document (Alt+Shift+F)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, function() {
        editor.trigger('keyboard', 'editor.action.formatDocument');
    });

    // Duplicate line (Ctrl+D)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, function() {
        editor.trigger('keyboard', 'editor.action.copyLinesDownAction');
    });

    // Delete line (Ctrl+Shift+K)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, function() {
        editor.trigger('keyboard', 'editor.action.deleteLines');
    });

    // Move line up (Alt+Up)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, function() {
        editor.trigger('keyboard', 'editor.action.moveLinesUpAction');
    });

    // Move line down (Alt+Down)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, function() {
        editor.trigger('keyboard', 'editor.action.moveLinesDownAction');
    });

    // Find (Ctrl+F)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, function() {
        editor.trigger('keyboard', 'actions.find');
    });
}