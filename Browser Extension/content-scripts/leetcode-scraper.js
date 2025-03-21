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
            
            // Include the problem URL for the "Back to Problem" button
            const problemURL = window.location.href.split('?')[0];

            // Create problem data object
            const problemData = {
                title: title,
                problemNumber: problemNumber,
                difficulty: difficulty,
                description: description,
                starterCode: starterCode,
                language: editorLanguage,
                url: problemURL
            };
            
            console.log("Scraped LeetCode problem:", problemData);
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
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 5px;">
                <path d="M14.25 1.25L8.51 7l-3.01-2.25-4 3v5l4-3 3.01 2.25 5.74-5.75v-5z" fill="currentColor"/>
            </svg>
            Open in VS Code Editor
        `;
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
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
        `;
        
        // Add hover effect
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#005999';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#007acc';
        });
        
        // Find a good place to inject the button
        const targetElement = document.querySelector('.text-title-large');
        if (targetElement) {
            targetElement.parentElement.appendChild(button);
        } else {
            // Try alternative locations
            const problemHeader = document.querySelector('.flex-1');
            if (problemHeader) {
                // Create a container for the button to align it properly
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'margin-top: 10px; display: flex; justify-content: flex-end;';
                buttonContainer.appendChild(button);
                problemHeader.appendChild(buttonContainer);
            } else {
                // Fallback - add to top of page
                document.body.insertBefore(button, document.body.firstChild);
            }
        }
        
        // Add click event listener
        button.addEventListener('click', function() {
            // Show loading state
            const originalContent = this.innerHTML;
            this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon" style="animation: spin 1s linear infinite; margin-right: 5px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                Loading...
            `;
            
            // Add loading animation
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleElement);
            
            // Extract data
            const problemData = scrapeLeetCodeProblem();
            
            if (problemData) {
                openInEditor(problemData);
                // Restore button after a delay
                setTimeout(() => {
                    this.innerHTML = originalContent;
                }, 1500);
            } else {
                this.innerHTML = originalContent;
                alert('Failed to extract problem data. Please try again.');
            }
        });
    }
    
    // Function to open data in the editor
    /*function openInEditor(data) {
        // Encode problem data
        const encodedData = encodeURIComponent(JSON.stringify(data));
        
        // Update this URL to where your editor is hosted
        // For local development
        const localEditorUrl = 'http://127.0.0.1:5500/editor/index.html';
        // For production - update this to your actual hosted URL
        const productionEditorUrl = 'https://codezen-editor.vercel.app';
        
        // Choose URL based on environment
        // const editorUrl = localEditorUrl;
        const editorUrl = productionEditorUrl;
        
        // Open in new tab
        window.open(`${editorUrl}?problem=${encodedData}`, '_blank');
    } */
    
    function openInEditor(data) {
        try {
            // Production URL
            const editorUrl = 'https://codezen-editor.vercel.app';
            const apiUrl = `${editorUrl}/api/problem`;

            // Send the data to the API
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success && result.problemId) {
                        // Open the editor with just the problem ID
                        window.open(`${editorUrl}?problemId=${result.problemId}`, '_blank');
                    } else {
                        console.error('Failed to store problem data:', result.error);

                        // Fallback to direct URL parameter for small problems
                        const encodedData = encodeURIComponent(JSON.stringify(data));
                        if (encodedData.length < 1500) { // Safe size for URL
                            window.open(`${editorUrl}?problem=${encodedData}`, '_blank');
                        } else {
                            alert('Failed to prepare problem data. Please try again.');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error storing problem data:', error);

                    // Try the direct method as fallback
                    const encodedData = encodeURIComponent(JSON.stringify(data));
                    if (encodedData.length < 1500) { // Safe size for URL
                        window.open(`${editorUrl}?problem=${encodedData}`, '_blank');
                    } else {
                        alert('Connection error. Please try again later.');
                    }
                });
        } catch (error) {
            console.error('Error in openInEditor:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }
    
    // Monitor for language changes and update button if needed
    function monitorLanguageChanges() {
        // For LeetCode, listen to language change button clicks
        const languageSwitcher = document.querySelector('button[aria-haspopup="dialog"]');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('click', function() {
                // Re-inject the button after a delay to ensure it's still there after language change
                setTimeout(injectButton, 500);
            });
        }
    }
    
    // Expose the scrapeLeetCodeProblem function globally for other scripts to access
    window.scrapeLeetCodeProblem = scrapeLeetCodeProblem;
    
    // Run the injection after page is fully loaded
    function init() {
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                injectButton();
                monitorLanguageChanges();
            });
        } else {
            injectButton();
            monitorLanguageChanges();
        }
        
        // Observe DOM changes for single-page app navigation
        const observer = new MutationObserver(function(mutations) {
            // Check if our button still exists, if not re-inject it
            if (!document.getElementById('open-vscode-editor-btn')) {
                injectButton();
                monitorLanguageChanges();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    init();
})();