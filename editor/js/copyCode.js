// Setup copy button functionality
function setupCopyButton(editor) {
    const copyButton = document.getElementById('copy-code-btn');
    if (!copyButton) return;
    
    copyButton.addEventListener('click', function() {
        // Get the code from the editor
        const code = editor ? editor.getValue() : '';
        
        // Copy the code to clipboard
        copyToClipboard(code);
        
        // Show "Copied!" feedback
        const originalHTML = this.innerHTML;
        this.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/>
            </svg>
            Copied!
        `;
        this.classList.add('copied');
        
        // Restore the original button text after 2 seconds
        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.classList.remove('copied');
        }, 2000);
    });
}

// Helper function to copy to clipboard
function copyToClipboard(text) {
    // Modern approach using Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback to older method if Clipboard API fails
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback for browsers without Clipboard API support
        fallbackCopyToClipboard(text);
    }
}

// Fallback clipboard copy method
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}