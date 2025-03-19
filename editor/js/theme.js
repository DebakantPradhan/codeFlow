// // Apply dark theme to body initially
// document.body.classList.add('dark-theme');
// Setup theme toggle functionality
function setupThemeToggle(editor) {
    let isDarkTheme = true;
    
    document.getElementById('theme-toggle').addEventListener('click', function () {
        isDarkTheme = !isDarkTheme;
        monaco.editor.setTheme(isDarkTheme ? 'vs-dark' : 'vs');
        document.body.classList.toggle('dark-theme', isDarkTheme);
    });
}