// Setup panel resizing functionality
function setupPanelResizer() {
    const resizer = document.getElementById('resizer');
    const problemPanel = document.getElementById('problem-statement');
    let isResizing = false;

    resizer.addEventListener('mousedown', function (e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        resizer.classList.add('active');
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;

        const mainContainer = document.querySelector('.main-container');
        const containerRect = mainContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const newWidth = e.clientX - containerRect.left;
        const percentWidth = (newWidth / containerWidth) * 100;

        // Limit min and max width with smoother constraints
        if (percentWidth >= 20 && percentWidth <= 80) {
            problemPanel.style.flex = `0 0 ${percentWidth}%`;
            // Force layout recalculation for smoother resizing
            if (window.editor) {
                window.editor.layout();
            }
        }
    });

    document.addEventListener('mouseup', function () {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            resizer.classList.remove('active');
            // Trigger layout update for editor
            if (window.editor) {
                window.editor.layout();
            }
        }
    });
}