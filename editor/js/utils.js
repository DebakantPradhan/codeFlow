// Add this to store code in multiple language buffers
let codeBuffers = {
    'javascript': '',
    'python': '',
    'cpp': '',
    'java': ''
};

// Modify setupLanguageSelector function to store in buffer
function setupLanguageSelector(editor) {
    const languageSelect = document.getElementById('language-select');
    
    languageSelect.addEventListener('change', function (e) {
        const previousLanguage = editor.getModel().getLanguageId();
        const newLanguage = e.target.value;
        
        // Save current code to the previous language buffer
        codeBuffers[previousLanguage] = editor.getValue();
        
        // Update editor language
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
        
        // If we've seen this language before and have stored code
        if (codeBuffers[newLanguage] && codeBuffers[newLanguage].trim() !== '') {
            editor.setValue(codeBuffers[newLanguage]);
        } else {
            // Only generate default starter code if we're not working with a loaded problem
            // or if this language buffer is empty
            if (!window.isLoadedProblem || !codeBuffers[newLanguage]) {
                // Generate starter code for the selected language
                let starterCode = generateStarterCode(newLanguage);
                editor.setValue(starterCode);
                codeBuffers[newLanguage] = starterCode;
            }
        }
    });
}

// Separate function to generate starter code
function generateStarterCode(language) {
    switch (language) {
        case 'python':
            return `# Python solution
def solution():
    # Write your code here
    pass

# Test your solution
if __name__ == "__main__":
    solution()`;
        case 'java':
            return `// Java solution
public class Solution {
    public static void main(String[] args) {
        // Write your code here
    }
}`;
        case 'cpp':
            return `// C++ solution
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`;
        default: // javascript
            return `// JavaScript solution
function solution() {
    // Write your code here
}

// Test your solution
solution();`;
    }
}

// Setup save button functionality
function setupSaveButton(editor) {
    document.getElementById('save-button').addEventListener('click', function () {
        const code = editor.getValue();
        const language = document.getElementById('language-select').value;
        const fileExtensions = {
            'javascript': 'js',
            'python': 'py',
            'java': 'java',
            'cpp': 'cpp'
        };

        const blob = new Blob([code], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `solution.${fileExtensions[language] || 'txt'}`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// Get file extension based on problem title
function getFileNameFromProblem(title) {
    if (!title) return 'solution';
    
    // Extract the problem name without number and convert to camelCase
    const problemNameMatch = title.match(/^\d+\.\s*(.*?)$/);
    let fileName = 'solution';
    
    if (problemNameMatch && problemNameMatch[1]) {
        fileName = problemNameMatch[1]
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .map((word, index) => {
                if (index === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    }
    
    return fileName;
}

// // When loading a problem, update the buffer
// // Add this to the loadProblem function in loader.js
// if (data.starterCode) {
//     const cleanCode = cleanCodeFormatting(data.starterCode);
//     editor.setValue(cleanCode);
//     // Store the initial code in the language buffer
//     codeBuffers[data.language] = cleanCode;
// }