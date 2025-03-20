(function() {
    // Function to scrape problem data from GeeksForGeeks
    function scrapeGFGProblem() {
        try {
            // Extract title
            const titleElement = document.querySelector('.problems_header_content__title__L2cB2 h3');
            const title = titleElement ? titleElement.textContent.trim() : '';
            
            // Extract difficulty
            let difficulty = 'Medium'; // Default
            const difficultyElement = document.querySelector('.problems_header_description__t_8PB strong');
            if (difficultyElement) {
                difficulty = difficultyElement.textContent.trim();
            }
            
            // Extract problem description
            const descriptionElement = document.querySelector('.problems_problem_content__Xm_eO');
            const description = descriptionElement ? descriptionElement.innerHTML : '';
            
            // Extract selected language from the dropdown
            let language = 'cpp'; // Default language
            const languageDropdown = document.querySelector('.problems_language_dropdown__DgjFb .divider.text');
            if (languageDropdown) {
                const selectedLanguage = languageDropdown.textContent.trim();
                
                // Map GFG language names to our editor's language identifiers
                if (selectedLanguage.includes('Python')) {
                    language = 'python';
                } else if (selectedLanguage.includes('Java')) {
                    language = 'java';
                } else if (selectedLanguage.includes('Javascript') || selectedLanguage.includes('JavaScript')) {
                    language = 'javascript';
                } else if (selectedLanguage.includes('C++')) {
                    language = 'cpp';
                }
            }
            
            // Extract starter code
            let fullCode = '';
            let starterCode = '';
            
            const codeEditor = document.querySelector('#ace-editor');
            if (codeEditor) {
                // Find all text content in the editor
                const codeLines = codeEditor.querySelectorAll('.ace_line');
                codeLines.forEach(line => {
                    fullCode += line.textContent + '\n';
                });
                
                // Clean up the code
                fullCode = fullCode
                    .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
                    .replace(/\u2003/g, '  ') // Replace em spaces
                    .replace(/\u2002/g, ' ')  // Replace en spaces
                    .replace(/\u200B/g, '');  // Remove zero-width spaces
                
                // Extract only the user's solution part by removing driver code
                starterCode = extractUserSolutionCode(fullCode, language);
            }
            
            // Include the problem URL for the "Back to Problem" button
            const problemURL = window.location.href;
            
            // Create problem data object
            const problemData = {
                title: title,
                difficulty: difficulty,
                description: description,
                starterCode: starterCode,
                language: language,
                url: problemURL
            };
            
            console.log("Scraped GFG problem:", problemData);
            return problemData;
        } catch (error) {
            console.error('Error scraping GeeksForGeeks problem:', error);
            return null;
        }
    }
    
    // Function to extract only the user solution part from the full code
    function extractUserSolutionCode(fullCode, language) {
        if (!fullCode) return '';
        
        // For C++
        if (language === 'cpp') {
            // Look for the class Solution or user code segment
            const driverEndPattern = /\/\/\s*\}\s*Driver Code Ends/i;
            const driverStartPattern = /\/\/\s*\{\s*Driver Code Starts/i;
            
            // First find all driver code sections
            const lines = fullCode.split('\n');
            let inSolutionSection = false;
            let skipDriverSection = false;
            let userCode = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check for driver code markers
                if (driverStartPattern.test(line)) {
                    skipDriverSection = true;
                    continue;
                }
                
                if (driverEndPattern.test(line)) {
                    skipDriverSection = false;
                    continue;
                }
                
                // Check for Solution class which indicates user code
                if (line.includes('class Solution') || line.includes('struct Solution')) {
                    inSolutionSection = true;
                }
                
                // When we're in a solution section but not in driver code, collect the lines
                if (inSolutionSection && !skipDriverSection) {
                    userCode.push(line);
                }
                
                // If we've seen a closing brace after Solution class, we may be exiting user code
                if (inSolutionSection && line.trim() === '};') {
                    inSolutionSection = false;
                }
            }
            
            // If we couldn't identify the solution section, try a different approach
            if (userCode.length === 0) {
                // Look for the function signature in a class
                const functionMatch = fullCode.match(/\s*(\w+)\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\}/g);
                if (functionMatch) {
                    userCode = functionMatch;
                } else {
                    // Fallback: look for a section between driver code ends and driver code starts
                    let sectionStart = fullCode.indexOf('// } Driver Code Ends');
                    let sectionEnd = fullCode.lastIndexOf('//{ Driver Code Starts');
                    if (sectionStart !== -1 && sectionEnd !== -1 && sectionStart < sectionEnd) {
                        return fullCode.substring(sectionStart + '// } Driver Code Ends'.length, sectionEnd).trim();
                    }
                    
                    // Last resort: just return the full code if we can't extract the user part
                    return fullCode; 
                }
            }
            
            return userCode.join('\n');
        }
        
        // For Java
        else if (language === 'java') {
            // Find the class Solution in Java
            const solutionClassPattern = /class\s+Solution\s*\{[\s\S]*?\}/;
            const match = fullCode.match(solutionClassPattern);
            
            if (match) {
                return match[0];
            }
            
            // Fallback: look for a section between driver code ends and driver code starts
            let sectionStart = fullCode.indexOf('// } Driver Code Ends');
            let sectionEnd = fullCode.lastIndexOf('//{ Driver Code Starts');
            if (sectionStart !== -1 && sectionEnd !== -1 && sectionStart < sectionEnd) {
                return fullCode.substring(sectionStart + '// } Driver Code Ends'.length, sectionEnd).trim();
            }
            
            return fullCode;
        }
        
        // For Python
        else if (language === 'python') {
            // Python usually has a class Solution or functions directly
            const lines = fullCode.split('\n');
            let userCode = [];
            let inSolutionSection = false;
            let inDriverCode = false;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check for driver code comments or markers
                if (line.includes('Driver Code Starts')) {
                    inDriverCode = true;
                    continue;
                }
                
                if (line.includes('Driver Code Ends')) {
                    inDriverCode = false;
                    continue;
                }
                
                // Solutions in Python usually start with 'class Solution' or are functions
                if (line.startsWith('class Solution') || line.startsWith('def ')) {
                    inSolutionSection = true;
                }
                
                // Collect user code
                if (inSolutionSection && !inDriverCode) {
                    userCode.push(line);
                }
                
                // End of solution class
                if (inSolutionSection && line.trim() === '' && userCode.length > 0) {
                    // Check if the next non-empty line is not indented
                    let j = i + 1;
                    while (j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && !lines[j].startsWith(' ') && !lines[j].startsWith('\t')) {
                        inSolutionSection = false;
                    }
                }
            }
            
            // If we couldn't identify user code, return a reasonable section
            if (userCode.length === 0) {
                // Fallback: look for a section between driver code ends and driver code starts
                let sectionStart = fullCode.indexOf('# } Driver Code Ends');
                let sectionEnd = fullCode.lastIndexOf('#{ Driver Code Starts');
                if (sectionStart !== -1 && sectionEnd !== -1 && sectionStart < sectionEnd) {
                    return fullCode.substring(sectionStart + '# } Driver Code Ends'.length, sectionEnd).trim();
                }
                
                return fullCode;
            }
            
            return userCode.join('\n');
        }
        
        // For JavaScript
        else if (language === 'javascript') {
            // JavaScript typically has functions or classes
            const lines = fullCode.split('\n');
            let userCode = [];
            let inSolutionSection = false;
            let inDriverCode = false;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check for driver code markers
                if (line.includes('Driver Code Starts')) {
                    inDriverCode = true;
                    continue;
                }
                
                if (line.includes('Driver Code Ends')) {
                    inDriverCode = false;
                    continue;
                }
                
                // Look for solution class or function
                if (line.includes('class Solution') || line.includes('function ')) {
                    inSolutionSection = true;
                }
                
                // Collect user code
                if (inSolutionSection && !inDriverCode) {
                    userCode.push(line);
                }
                
                // End of solution
                if (inSolutionSection && line.trim() === '}' && userCode.length > 0) {
                    let j = i + 1;
                    // If next non-empty line is not starting a new function, end solution section
                    while (j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && !lines[j].includes('function ') && !lines[j].includes('class ')) {
                        inSolutionSection = false;
                    }
                }
            }
            
            // If we couldn't identify user code, use fallback
            if (userCode.length === 0) {
                // Fallback: look for a section between driver code ends and driver code starts
                let sectionStart = fullCode.indexOf('// } Driver Code Ends');
                let sectionEnd = fullCode.lastIndexOf('//{ Driver Code Starts');
                if (sectionStart !== -1 && sectionEnd !== -1 && sectionStart < sectionEnd) {
                    return fullCode.substring(sectionStart + '// } Driver Code Ends'.length, sectionEnd).trim();
                }
                
                return fullCode;
            }
            
            return userCode.join('\n');
        }
        
        // Default fallback for any language
        let sectionStart = fullCode.indexOf('Driver Code Ends');
        let sectionEnd = fullCode.lastIndexOf('Driver Code Starts');
        if (sectionStart !== -1 && sectionEnd !== -1 && sectionStart < sectionEnd) {
            return fullCode.substring(sectionStart + 'Driver Code Ends'.length, sectionEnd).trim();
        }
        
        return fullCode;
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
        const targetElement = document.querySelector('.problems_header_content__title__L2cB2');
        if (targetElement) {
            targetElement.appendChild(button);
        } else {
            // Try alternative locations
            const editorHeader = document.querySelector('.problems_header_description__t_8PB');
            if (editorHeader) {
                // Create a container for the button to align it properly
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'margin-top: 10px; display: flex; justify-content: flex-end;';
                buttonContainer.appendChild(button);
                editorHeader.appendChild(buttonContainer);
            } else {
                // Fallback - add to editor container
                const editorContainer = document.querySelector('.problems_editor_content__zXHUI');
                if (editorContainer) {
                    editorContainer.parentNode.insertBefore(button, editorContainer);
                } else {
                    // Last resort - add to body
                    document.body.insertBefore(button, document.body.firstChild);
                }
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
            const problemData = scrapeGFGProblem();
            
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
    function openInEditor(data) {
        // Encode problem data
        const encodedData = encodeURIComponent(JSON.stringify(data));
        
        // Update this URL to where your editor is hosted
        // For local development
        const localEditorUrl = 'http://127.0.0.1:5500/editor/index.html';
        // For production - update this to your actual hosted URL
        const productionEditorUrl = 'https://yourdomain.com/editor/index.html';
        
        // Choose URL based on environment
        const editorUrl = localEditorUrl;
        
        // Open in new tab
        window.open(`${editorUrl}?problem=${encodedData}`, '_blank');
    }
    
    // Monitor for language changes and update button if needed
    function monitorLanguageChanges() {
        const languageDropdown = document.querySelector('.problems_language_dropdown__DgjFb');
        if (languageDropdown) {
            languageDropdown.addEventListener('click', function() {
                // Re-inject the button after a short delay to ensure it's still there after language change
                setTimeout(injectButton, 500);
            });
        }
    }
    
    // Expose the scrapeGFGProblem function globally for other scripts to access
    window.scrapeGFGProblem = scrapeGFGProblem;
    
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