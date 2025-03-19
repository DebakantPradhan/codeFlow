// Initialize the Monaco editor
function initMonacoEditor() {
    const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: `// Write your code here...`,
        language: 'cpp', // Default to C++
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        matchBrackets: 'always',
        wordWrap: 'on',
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: 'none',
        useTabStops: true,
        suggest: {
                    showIcons: true,
                    showMethods: true,
                    showFunctions: true,
                    showConstructors: true,
                    showFields: true,
                    showVariables: true,
                    showClasses: true,
                    showStructs: true,
                    showInterfaces: true,
                    showModules: true,
                    showProperties: true,
                    showEvents: true,
                    showOperators: true,
                    showUnits: true,
                    showValues: true,
                    showConstants: true,
                    showEnums: true,
                    showEnumMembers: true,
                    showKeywords: true,
                    showWords: true,
                    showColors: true,
                    showFiles: true,
                    showReferences: true,
                    showFolders: true,
                    showTypeParameters: true,
                    showSnippets: true
                },
        quickSuggestions: {
            other: true,
            comments: true,
            strings: true
        },
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'top',
        suggestOnTriggerCharacters: true,
        tabCompletion: 'on',
        wordBasedSuggestions: true,
        parameterHints: {
            enabled: true,
            cycle: true
        }
    });
    
    // Show cursor position in status bar
    editor.onDidChangeCursorPosition(function(e) {
        const position = editor.getPosition();
        document.getElementById('cursor-position').textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
    });
    
    // Multiple cursor selection (Alt+Click)
    editor.updateOptions({
        multiCursorModifier: 'alt'
    });
    
    return editor;
}