// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
    // Load the Monaco editor
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], function() {
        // Initialize the editor
        const editor = initMonacoEditor();
        
        // Setup event listeners for buttons and controls
        setupEventListeners(editor);

        // Process any URL parameters for problem loading
        loadProblemFromURL(editor);
        
        // Initialize keyboard shortcuts
        setupKeyboardShortcuts(editor);
        
        // Setup code completion providers
        setupCompletionProviders();
        
        // Handle resizing panels
        setupPanelResizer();
        
        // // Process any URL parameters for problem loading
        // loadProblemFromURL(editor);
        
        // Add keyboard shortcuts info to the problem panel
        addShortcutsInfo();
        
        // Apply dark theme by default
        // document.body.classList.add('dark-theme');
    });
});

// Setup event listeners for buttons and controls
function setupEventListeners(editor) {
    // Theme toggle
    setupThemeToggle(editor);
    
    // Console panel toggle
    setupConsoleToggle();
    
    // Run button
    setupRunButton(editor);
    
    // Save button
    setupSaveButton(editor);
    
    // Language selection
    setupLanguageSelector(editor);
}