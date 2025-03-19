// Function to handle zoom operations
function zoomEditor(editor, direction) {
    // Get current font size
    const currentFontSize = editor.getOption(monaco.editor.EditorOption.fontSize);
    
    // Calculate new font size (min: 8, max: 30)
    let newFontSize = currentFontSize + (direction * 2); // Change by 2px at a time
    newFontSize = Math.max(8, Math.min(30, newFontSize));
    
    // Update font size
    editor.updateOptions({ fontSize: newFontSize });
    
    // Save the current zoom level to localStorage
    localStorage.setItem('editor-font-size', newFontSize);
    
    // Update status bar with current zoom level
    updateZoomStatus(newFontSize);
}

// Reset zoom to default (14px)
function resetZoom(editor) {
    const defaultFontSize = 14;
    editor.updateOptions({ fontSize: defaultFontSize });
    localStorage.setItem('editor-font-size', defaultFontSize);
    updateZoomStatus(defaultFontSize);
}

// Update status bar with current zoom level
function updateZoomStatus(fontSize) {
    const statusElement = document.getElementById('zoom-level');
    if (statusElement) {
        statusElement.textContent = `${Math.round((fontSize / 14) * 100)}%`;
    }
}

// Setup mouse wheel zoom functionality
function setupMouseWheelZoom(editor) {
    // Target the entire editor container and all its children
    const editorContainer = document.querySelector('.monaco-editor');
    
    if (!editorContainer) {
        console.error('Monaco editor container not found');
        return;
    }
    
    // Add event listener with capture phase to intercept events before they reach Monaco's handlers
    document.addEventListener('wheel', function(e) {
        // Check if the event target is within the editor
        if (editorContainer.contains(e.target) && (e.ctrlKey || e.metaKey)) {
            // Prevent default browser zoom and monaco's own handling
            e.preventDefault();
            e.stopPropagation();
            
            // Determine zoom direction based on wheel delta
            const direction = e.deltaY < 0 ? 1 : -1;
            zoomEditor(editor, direction);
        }
    }, { passive: false, capture: true }); // Use capture phase and non-passive to ensure we get the event first
}