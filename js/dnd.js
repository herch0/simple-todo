var dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.priority);
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
        var priority = e.dataTransfer.getData('text/plain');
        var otherPriority = this.dataset.priority;
        this.dataset.priority = priority;
        dragSrcEl.dataset.priority = otherPriority;
        dragSrcEl.dispatchEvent(new CustomEvent('change', {'detail': {'priority': dragSrcEl.dataset.priority}}));
        this.dispatchEvent(new CustomEvent('change', {'detail': {'priority': this.dataset.priority}}));
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