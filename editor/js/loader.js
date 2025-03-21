function loadProblemFromURL(editor) {
    const urlParams = new URLSearchParams(window.location.search);
    const problemParam = urlParams.get('problem');
    const problemId = urlParams.get('problemId');
    
    // If we have a problemId, fetch from API
    if (problemId) {
        // Show loading state
        showLoadingIndicator();
        
        // Fetch problem data from API
        fetch(`/api/problem?id=${problemId}`)
            .then(response => response.json())
            .then(result => {
                if (result.success && result.data) {
                    // Render the problem data
                    renderProblem(editor, result.data);
                } else {
                    // Handle error
                    showErrorMessage(result.error || 'Failed to load problem data');
                }
            })
            .catch(error => {
                console.error('Error fetching problem data:', error);
                showErrorMessage('Error fetching problem data. Please try again.');
            });
            
        return true;
    }
    
    // If no problemId but we have a problemParam, try direct approach
    if (problemParam) {
        try {
            const problemData = JSON.parse(decodeURIComponent(problemParam));
            renderProblem(editor, problemData);
            return true;
        } catch (error) {
            console.error('Error parsing problem data from URL:', error);
            showErrorMessage('Error parsing problem data from URL');
            return false;
        }
    }
    
    return false;
}

// Helper function to show loading indicator
function showLoadingIndicator() {
    const problemTitle = document.querySelector('.problem-title');
    const problemContent = document.querySelector('.problem-content');
    
    if (problemTitle) {
        problemTitle.textContent = 'Loading problem...';
        problemTitle.style.visibility = 'visible';
    }
    
    if (problemContent) {
        problemContent.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                <div class="loading-spinner"></div>
                <p style="margin-left: 15px;">Loading problem data...</p>
            </div>
        `;
        problemContent.style.visibility = 'visible';
    }
    
    // Add styling for spinner if not already added
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            .loading-spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-top: 4px solid #007acc;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Helper function to show error message
function showErrorMessage(message) {
    const problemTitle = document.querySelector('.problem-title');
    const problemContent = document.querySelector('.problem-content');
    
    if (problemTitle) {
        problemTitle.textContent = 'Error';
        problemTitle.style.visibility = 'visible';
    }
    
    if (problemContent) {
        problemContent.innerHTML = `
            <div style="padding: 20px; background-color: #ffdddd; color: #aa0000; border-radius: 4px;">
                <h3>Error Loading Problem</h3>
                <p>${message}</p>
                <p>Please try opening the problem again from the original website.</p>
            </div>
        `;
        problemContent.style.visibility = 'visible';
    }
}

// Function to render problem data
function renderProblem(editor, problemData) {
    // Get reference to problem elements
    const problemTitle = document.querySelector('.problem-title');
    const problemContent = document.querySelector('.problem-content');
    
    // Set title
    if (problemTitle) {
        let titleText = problemData.title || 'Untitled Problem';
        if (problemData.problemNumber) {
            titleText = problemData.problemNumber + '. ' + titleText;
        }
        problemTitle.innerHTML = titleText;
        problemTitle.style.visibility = 'visible';
    }
    
    // Set description with proper formatting
    if (problemContent && problemData.description) {
        problemContent.innerHTML = problemData.description;
        problemContent.style.visibility = 'visible';
        
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