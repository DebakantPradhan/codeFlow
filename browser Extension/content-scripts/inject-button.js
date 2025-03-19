// inject-button.js
function injectOpenButton() {
    // Create button
    const button = document.createElement('button');
    button.textContent = 'Open in VS Code Editor';
    button.style.cssText = `
      background-color: #0078d4;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      margin: 10px 0;
    `;
    
    // Detect which site we're on
    const isLeetCode = window.location.hostname.includes('leetcode.com');
    const isGFG = window.location.hostname.includes('geeksforgeeks.org');
    
    // Append button to appropriate location
    if (isLeetCode) {
      // We'll update this selector once you share DOM info
      const container = document.querySelector('...');
      if (container) container.appendChild(button);
      
      button.addEventListener('click', function() {
        const problemData = window.scrapeLeetCodeProblem();
        openInEditor(problemData);
      });
    } 
    else if (isGFG) {
      // We'll update this selector once you share DOM info
      const container = document.querySelector('...');
      if (container) container.appendChild(button);
      
      button.addEventListener('click', function() {
        const problemData = window.scrapeGFGProblem();
        openInEditor(problemData);
      });
    }
  }
  
  function openInEditor(problemData) {
    // Encode problem data to pass in URL
    const encodedData = encodeURIComponent(JSON.stringify(problemData));
    
    // Open editor with data
    // Update this URL to wherever your editor is hosted
    window.open(`http://yourhost.com/editor.html?problem=${encodedData}`);
  }
  
  // Run when page is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectOpenButton);
  } else {
    injectOpenButton();
  }