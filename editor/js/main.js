// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
    // Check if there are URL parameters before doing anything else
    const urlParams = new URLSearchParams(window.location.search);
    const hasProblemParam = urlParams.has('problem');
    
    // If we have a problem parameter, hide the welcome content immediately
    if (hasProblemParam) {
        // Hide the default welcome content
        const problemTitle = document.querySelector('.problem-title');
        const problemContent = document.querySelector('.problem-content');
        
        // Make them invisible but keep their space to prevent layout shift
        if (problemTitle) problemTitle.style.visibility = 'hidden';
        if (problemContent) problemContent.style.visibility = 'hidden';
    }

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
        // Only add if we don't have a problem from URL
        if (!hasProblemParam) {
            addShortcutsInfo();
        }

        // Setup copy button functionality
        setupCopyButton(editor);

        // Setup copy in console
        setupCopyConsoleButton();
        
        // Setup clear in console
        setupClearConsoleButton();
        
        // Hide the loading overlay after everything is loaded
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            // Remove from DOM after transition completes
            setTimeout(() => {
                loadingOverlay.remove();
            }, 300);
        }
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