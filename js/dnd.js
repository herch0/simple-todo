var dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary. Allows us to drop.
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
    // this / e.target is current target element.
    e.stopPropagation(); // stops the browser from redirecting.

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragSrcEl.innerHTML = this.innerHTML;
//        dragSrcEl.dispatchEvent(new CustomEvent('change', {index: }));
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    var items = document.querySelectorAll('#tasks .task');
    this.style.opacity = '1';
    [].forEach.call(items, function (item) {
        item.classList.remove('over');
    });
}