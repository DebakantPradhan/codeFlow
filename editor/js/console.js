// Setup console panel functionality
function setupConsoleToggle() {
    let isConsoleVisible = false;
    const consolePanel = document.getElementById('console-panel');
    
    document.getElementById('console-toggle').addEventListener('click', function () {
        // Toggle the console visibility
        isConsoleVisible = !isConsoleVisible;
        
        // Update console display
        consolePanel.style.display = isConsoleVisible ? 'block' : 'none';

        // Adjust the main container height to accommodate the console
        const mainContainer = document.querySelector('.main-container');
        mainContainer.style.height = isConsoleVisible ? 'calc(100vh - 202px)' : 'calc(100vh - 52px)';
        
        // Notify the editor to resize itself
        if (window.editor) {
            window.editor.layout();
        }
        
        // Update button text or style to indicate state
        this.textContent = isConsoleVisible ? 'Hide Console' : 'Toggle Console';
    });
}

// Setup run button functionality
function setupRunButton(editor) {
    document.getElementById('run-button').addEventListener('click', function () {
        const code = editor.getValue();
        const language = document.getElementById('language-select').value;
        const consoleOutput = document.getElementById('console-output');

        // Make console visible if it's not
        const consolePanel = document.getElementById('console-panel');
        if (consolePanel.style.display !== 'block') {
            document.getElementById('console-toggle').click();
        }

        // Clear previous output
        consoleOutput.innerHTML = '';

        try {
            if (language === 'javascript') {
                // Override console.log
                const originalConsoleLog = console.log;
                console.log = function () {
                    const args = Array.from(arguments);
                    consoleOutput.innerHTML += args.join(' ') + '\n';
                    originalConsoleLog.apply(console, args);
                };

                // Run the code
                eval(code);

                // Restore console.log
                console.log = originalConsoleLog;
            } else {
                consoleOutput.innerHTML = `Running ${language} code is not supported in this browser environment.\n`;
                consoleOutput.innerHTML += `In a full implementation, this would be sent to a server for execution.`;
            }
        } catch (error) {
            consoleOutput.innerHTML += `Error: ${error.message}\n`;
            console.error('Error executing code:', error);
        }
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
    `;
    problemContent.appendChild(shortcutInfo);
}