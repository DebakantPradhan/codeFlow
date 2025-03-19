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

    // Zoom in (Ctrl+=)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, function() {
        zoomEditor(editor, 1);
    });

    // Zoom out (Ctrl+-)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, function() {
        zoomEditor(editor, -1);
    });

    // Reset zoom (Ctrl+0)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, function() {
        resetZoom(editor);
    });

    // Setup mouse wheel zoom separately to ensure it runs after editor is fully initialized
    setTimeout(() => setupMouseWheelZoom(editor), 500);

    // Multiple cursor selection (Alt+Click)
    editor.updateOptions({
        multiCursorModifier: 'alt'
    });
}

// Add keyboard shortcuts info to the problem panel
function addShortcutsInfo() {
    const problemContent = document.querySelector('.problem-content');
    const shortcutInfo = document.createElement('div');
    shortcutInfo.className = 'shortcut-info';
    shortcutInfo.innerHTML = `
        <h3>VS Code Shortcuts:</h3>
        <p><span class="kbd">Ctrl+S</span> / <span class="kbd">⌘+S</span>: Save code</p>
        <p><span class="kbd">Ctrl+B</span> / <span class="kbd">⌘+B</span>: Run code</p>
        <p><span class="kbd">Ctrl+Shift+B</span> / <span class="kbd">⌘+Shift+B</span>: Toggle console</p>
        <p><span class="kbd">Ctrl+/</span> / <span class="kbd">⌘+/</span>: Toggle comment</p>
        <p><span class="kbd">Alt+Shift+F</span> / <span class="kbd">⌥+Shift+F</span>: Format code</p>
        <p><span class="kbd">Ctrl+D</span> / <span class="kbd">⌘+D</span>: Duplicate line</p>
        <p><span class="kbd">Ctrl+Shift+K</span> / <span class="kbd">⌘+Shift+K</span>: Delete line</p>
        <p><span class="kbd">Alt+↑</span> / <span class="kbd">⌥+↑</span>: Move line up</p>
        <p><span class="kbd">Alt+↓</span> / <span class="kbd">⌥+↓</span>: Move line down</p>
        <p><span class="kbd">Ctrl+F</span> / <span class="kbd">⌘+F</span>: Find</p>
        <p><span class="kbd">Alt+Click</span> / <span class="kbd">⌥+Click</span>: Add cursor</p>
        <p><span class="kbd">Ctrl++</span> / <span class="kbd">⌘++</span>: Zoom in</p>
        <p><span class="kbd">Ctrl+-</span> / <span class="kbd">⌘+-</span>: Zoom out</p>
        <p><span class="kbd">Ctrl+0</span> / <span class="kbd">⌘+0</span>: Reset zoom</p>
        <p><span class="kbd">Ctrl+Wheel</span> / <span class="kbd">⌘+Wheel</span>: Zoom in/out</p>
    `;
    problemContent.appendChild(shortcutInfo);
}