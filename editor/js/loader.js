// Load problem from URL parameters
function loadProblemFromURL(editor) {
    const urlParams = new URLSearchParams(window.location.search);
    const problemParam = urlParams.get('problem');
    
    if (!problemParam) return false;
    
    try {
        const problemData = JSON.parse(decodeURIComponent(problemParam));
        
        // Get reference to problem elements
        const problemTitle = document.querySelector('.problem-title');
        const problemContent = document.querySelector('.problem-content');
        
        // Set title
        if (problemTitle) {
            problemTitle.innerHTML = problemData.title || 'Untitled Problem';
            problemTitle.style.visibility = 'visible'; // Make it visible again
        }
        
        // Set description with proper formatting
        if (problemContent && problemData.description) {
            problemContent.innerHTML = problemData.description;
            problemContent.style.visibility = 'visible'; // Make it visible again
            
            // Style code blocks in the description
            highlightCodeBlocks();
        }
        
        // Set language
        if (problemData.language) {
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = problemData.language;
                
                // Dispatch change event to trigger language change in Monaco
                const event = new Event('change');
                languageSelect.dispatchEvent(event);
            }
            
            // Set editor language directly
            monaco.editor.setModelLanguage(editor.getModel(), problemData.language);
        }
        
        // Set code
        if (problemData.starterCode) {
            // Clean up the code
            const cleanCode = problemData.starterCode
                .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
                .replace(/\u2003/g, '  ') // Replace em spaces
                .replace(/\u2002/g, ' ')  // Replace en spaces
                .replace(/\u2007/g, ' ')  // Replace figure space
                .replace(/\u2001/g, ' ')  // Replace em quad space
                .replace(/\u2000/g, ' ')  // Replace en quad space
                .replace(/\u200B/g, '');  // Remove zero-width spaces
            
            editor.setValue(cleanCode);
            
            // After setting value, move cursor to a good starting position
            positionCursorAtStartingPoint(editor, cleanCode, problemData.language);
        }
        
        // Add "Back to Problem" button if URL is provided
        if (problemData.url) {
            addBackToProblemButton(problemData.url);
        }
        
        // Mark this problem as loaded from URL
        window.problemLoadedFromURL = true;
        
        return true;
    } catch (error) {
        console.error('Error parsing problem data from URL:', error);
        return false;
    }
}

function highlightCodeBlocks() {
    // Find all pre and code elements in the problem description
    const codeBlocks = document.querySelectorAll('.problem-content pre, .problem-content code');
    
    // Add styling to make them stand out
    codeBlocks.forEach(block => {
        block.style.backgroundColor = '#2d2d2d';
        block.style.padding = '0.5em';
        block.style.borderRadius = '4px';
        block.style.fontFamily = 'monospace';
        block.style.overflowX = 'auto';
    });
}

function positionCursorAtStartingPoint(editor, code, language) {
    // Find an appropriate place to position the cursor based on language
    let lineNumber = 1;
    const lines = code.split('\n');
    
    // Look for common patterns in each language where user should start coding
    if (language === 'cpp') {
        // Look for "// Your code goes here" or similar comment
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Your code') || lines[i].includes('Write your code')) {
                lineNumber = i + 2; // Position cursor on the line after the comment
                break;
            }
            // Function body in Solution class
            if (lines[i].includes('Solution') && lines[i+1] && lines[i+1].includes('{')) {
                lineNumber = i + 2;
                break;
            }
        }
    } else if (language === 'python') {
        // Look for Python function body
        for (let i = 0; i < lines.length; i++) {
            if ((lines[i].includes('def ') || lines[i].includes('class ')) && 
                lines[i].includes(':')) {
                lineNumber = i + 1; // Python uses indentation, so go to next line
                break;
            }
        }
    } else if (language === 'java') {
        // Look for Java method body
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('public') && lines[i].includes('(') && 
                lines[i+1] && lines[i+1].includes('{')) {
                lineNumber = i + 2; // Position cursor inside the method body
                break;
            }
        }
    } else if (language === 'javascript') {
        // Look for JavaScript function body
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('function') && (lines[i].includes('{') || 
                (lines[i+1] && lines[i+1].includes('{')))) {
                lineNumber = i + 2; // Position cursor inside the function body
                break;
            }
        }
    }
    
    // Set cursor position
    editor.setPosition({ lineNumber, column: 1 });
    editor.revealLineInCenter(lineNumber);
    editor.focus();
}

function addBackToProblemButton(url) {
    // Create button if it doesn't exist
    let backButton = document.getElementById('back-to-problem-btn');
    
    if (!backButton) {
        backButton = document.createElement('button');
        backButton.id = 'back-to-problem-btn';
        backButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 5px;">
                <path d="M7.5 1L9 2.5 4.75 6.75H15v1.5H4.75L9 12.5 7.5 14l-6-6 6-7z" fill="currentColor"/>
            </svg>
            Back to Problem
        `;
        backButton.style.cssText = `
            background-color: #444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 10px;
        `;
        
        // Add hover effect
        backButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#555';
        });
        
        backButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#444';
        });
        
        // Add click event to open original problem
        backButton.addEventListener('click', function() {
            window.open(url, '_blank');
        });
        
        // Add to toolbar
        const toolbarRight = document.querySelector('.toolbar-right');
        if (toolbarRight) {
            toolbarRight.prepend(backButton);
        }
    }
}