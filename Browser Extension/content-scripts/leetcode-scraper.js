(function() {
    // Function to scrape problem data from LeetCode
    function scrapeLeetCodeProblem() {
        try {
            // Extract title
            const titleElement = document.querySelector('.text-title-large a');
            const title = titleElement ? titleElement.textContent.trim() : '';
            
            // Extract problem number
            const problemNumber = title.split('.')[0].trim();
            
            // Extract difficulty
            let difficulty = 'Medium'; // Default
            const difficultyElements = document.querySelectorAll('.text-body');
            difficultyElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes('easy')) {
                    difficulty = 'Easy';
                } else if (text.includes('medium')) {
                    difficulty = 'Medium';
                } else if (text.includes('hard')) {
                    difficulty = 'Hard';
                }
            });
            
            // Extract problem description
            const descriptionElement = document.querySelector('.elfjS');
            const description = descriptionElement ? descriptionElement.innerHTML : '';
            
            // Extract chosen language with better DOM handling
            let language = 'javascript'; // Default fallback
            try {
                // First, try to find the button with a nested text node
                const languageButtons = document.querySelectorAll('button[aria-haspopup="dialog"] button');
                
                if (languageButtons.length > 0) {
                    // Find the first button with text content (language name)
                    for (const btn of languageButtons) {
                        const text = btn.textContent.trim().split('\n')[0].trim();
                        if (text && !text.includes('svg')) {
                            language = text.toLowerCase();
                            console.log("Found language:", language);
                            break;
                        }
                    }
                }
                
                // If we haven't found it yet, try XPath as a last resort
                if (language === 'javascript') {
                    const xpath = "//button[contains(@class, 'rounded')][text()[contains(., 'C++') or contains(., 'Python') or contains(., 'Java')]]";
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    if (result.singleNodeValue) {
                        language = result.singleNodeValue.textContent.trim().toLowerCase();
                        console.log("Found language using XPath:", language);
                    }
                }
            } catch (error) {
                console.error("Error extracting language:", error);
            }
            
            // Map LeetCode language name to Monaco editor language ID
            const languageMap = {
                'javascript': 'javascript',
                'python': 'python',
                'python3': 'python',
                'java': 'java',
                'c++': 'cpp',
                'c': 'c',
                'c#': 'csharp',
                'ruby': 'ruby',
                'swift': 'swift',
                'go': 'go',
                'scala': 'scala',
                'kotlin': 'kotlin',
                'rust': 'rust',
                'php': 'php',
                'typescript': 'typescript'
            };
            
            // Get mapped language or default to javascript
            const editorLanguage = languageMap[language] || 'cpp';

            console.log("here is the language ", editorLanguage);
            
            // Extract starter code and clean it up
            const codeEditor = document.querySelector('.view-lines');
            let starterCode = '';
            
            if (codeEditor) {
                const codeLines = codeEditor.querySelectorAll('.view-line');
                codeLines.forEach(line => {
                    starterCode += line.textContent + '\n';
                });
                
                // Clean up the code - replace any odd space characters with regular spaces
                starterCode = starterCode
                    .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
                    .replace(/\u2003/g, '  ') // Replace em spaces
                    .replace(/\u2002/g, ' ')  // Replace en spaces
                    .replace(/\u2007/g, ' ')  // Replace figure spaces
                    .replace(/\u2001/g, ' ')  // Replace other spaces
                    .replace(/\u2000/g, ' ')  // Replace other spaces
                    .replace(/\u200B/g, '');  // Remove zero-width spaces
            }
            

            //create problemData object
            const problemData = {
                title: title,
                problemNumber: problemNumber,
                difficulty: difficulty,
                description: description,
                starterCode: starterCode,
                language: editorLanguage
            };
            console.log(problemData);
            
            return problemData;
        } catch (error) {
            console.error('Error scraping LeetCode problem:', error);
            return null;
        }
    }
    
    // Function to inject "Open in VS Code Editor" button
    function injectButton() {
        // Check if button already exists
        if (document.getElementById('open-vscode-editor-btn')) {
            return;
        }
        
        // Create button
        const button = document.createElement('button');
        button.id = 'open-vscode-editor-btn';
        button.textContent = 'Open in VS Code Editor';
        button.style.cssText = `
            background-color: #007acc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px 0;
            font-size: 14px;
        `;
        
        // Find a good place to inject the button
        const targetElement = document.querySelector('.text-title-large');
        if (targetElement) {
            targetElement.parentElement.appendChild(button);
        } else {
            // Fallback - add to top of page
            document.body.insertBefore(button, document.body.firstChild);
        }
        
        // Add click event listener
        button.addEventListener('click', function() {
            const problemData = scrapeLeetCodeProblem();
            if (problemData) {
                openInEditor(problemData);
            } else {
                alert('Failed to extract problem data. Please try again.');
            }
        });
    }
    
    // Function to open data in the editor
    function openInEditor(data) {
        // Encode problem data
        const encodedData = encodeURIComponent(JSON.stringify(data));
        
        // Update this URL to where your editor is hosted
        const editorUrl = 'http://127.0.0.1:5500/editor/index.html';
        
        // Open in new tab
        window.open(`${editorUrl}?problem=${encodedData}`, '_blank');
    }
    
    // Run the injection after page is fully loaded
    function init() {
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectButton);
        } else {
            injectButton();
        }
        
        // Observe DOM changes for single-page app navigation
        const observer = new MutationObserver(function(mutations) {
            injectButton();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    init();
})();