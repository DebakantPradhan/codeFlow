document.getElementById('inject-btn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: injectButton
        });
    });
});

function injectButton() {
    // Create and inject button
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
    
    const targetElement = document.querySelector('.text-title-large');
    if (targetElement) {
        targetElement.parentElement.appendChild(button);
        console.log('Button injected successfully');
    } else {
        console.log('Target element not found');
        document.body.insertBefore(button, document.body.firstChild);
    }
}