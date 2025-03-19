// Load problem from URL parameters
function loadProblemFromURL(editor) {
    const urlParams = new URLSearchParams(window.location.search);
    const problemParam = urlParams.get('problem');

    if (problemParam) {
        try {
            const problemData = JSON.parse(decodeURIComponent(problemParam));
            loadProblem(editor, problemData);
            console.log('Problem data loaded from URL parameters');
        } catch (error) {
            console.error('Error processing problem data from URL:', error);
        }
    }
}

// Load problem data into the editor
window.loadProblem = function(editor, data) {
    if (!data) return;

    // Update problem title and difficulty
    if (data.title) {
        const titleElem = document.querySelector('.problem-title');
        titleElem.innerHTML = data.title;

        if (data.difficulty) {
            const diffClass = data.difficulty.toLowerCase();
            titleElem.innerHTML += `<span class="problem-difficulty ${diffClass}">${data.difficulty}</span>`;
        }
    }

    // Update problem content
    if (data.description) {
        const contentElem = document.querySelector('.problem-content');
        // Store shortcut info before replacing content
        const shortcutInfo = contentElem.querySelector('.shortcut-info');
        contentElem.innerHTML = data.description;
        // Re-add shortcut info after content replacement
        if (shortcutInfo) {
            contentElem.appendChild(shortcutInfo);
        }
    }

    // Update starter code
    if (data.starterCode) {
        // Clean up the code
        const cleanCode = data.starterCode
            .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
            .replace(/\u2003/g, '  ') // Replace em spaces
            .replace(/\u2002/g, ' ')  // Replace en spaces
            .replace(/\u2007/g, ' ')  // Replace figure spaces
            .replace(/\u2001/g, ' ')  // Replace other spaces
            .replace(/\u2000/g, ' ')  // Replace other spaces
            .replace(/\u200B/g, '');  // Remove zero-width spaces
        
        editor.setValue(cleanCode);
        
        // Mark this as loaded from URL and store the initial code
        if (window.markProblemAsLoadedFromURL && data.language) {
            window.markProblemAsLoadedFromURL(data.language, cleanCode);
        }
    }

    // Update language if provided
    if (data.language) {
        const langSelect = document.getElementById('language-select');
        if (langSelect.querySelector(`option[value="${data.language}"]`)) {
            langSelect.value = data.language;
            monaco.editor.setModelLanguage(editor.getModel(), data.language);
        }
    }
};