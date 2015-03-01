
var store = window.localStorage;
var tasks = [];

//window.localStorage.clear();

function init() {
  var btnNewTask = document.getElementById('btn_new_task');
  btnNewTask.addEventListener('click', newTask, false);

//get stored tasks
  var itemsJson = store.getItem('tasks');
  if (itemsJson) {
    itemsJson = JSON.parse(itemsJson);
    //add retrieved tasks to the global array tasks
    for (var i = 0; i < itemsJson.length; i++) {
      var item = itemsJson[i];
      tasks.push(new Task(item.title, item.priority, item.start, item.end, item.index));
    }
  }
//display the tasks in the page
  displayTasks();
}

function Task(title, priority, start, end, index) {
  this.title = title;
  this.priority = priority;
  this.start = start;
  this.end = end;
  this.index = (index ? index : 0);
  var div = document.createElement('div');
  div.setAttribute('draggable', true);
  div.dataset.index = this.index;
  div.dataset.priority = this.priority;
  div.classList.add('task');
  div.classList.add('priority-' + this.priority);
  div.innerHTML = title;
  div.addEventListener('change', this, false);
  div.addEventListener('dblclick', function (event) {
    event.target.contentEditable = true;
    event.target.style.cursor = 'text';
    event.target.focus();
  });
  div.addEventListener('blur', function (event) {
    event.target.contentEditable = false;
    event.target.style.cursor = 'move';
    event.target.dispatchEvent(new Event('change'));
  });
  this.domElement = div;
}

Task.prototype.handleEvent = function (event) {
  if (event.type == 'change') {
    if (event.detail) {
      this.domElement.classList.remove('priority-' + this.priority);
      this.priority = event.detail.priority;
      this.domElement.classList.add('priority-' + this.priority);
    }
    if (this.title != this.domElement.innerHTML) {
      this.title = this.domElement.innerHTML;
    }
    save();
    displayTasks();
  }
};

function newTask() {
  var title = document.getElementById("title").value;
  var priority = document.getElementById("priority").value;
  document.getElementById("title").value = "";
  document.getElementById("priority").value = 1;
  tasks.push(new Task(title, priority, new Date(), null, tasks.length));
  displayTasks();
  save();
}

function save() {
  var data = JSON.stringify(tasks);
  store.setItem('tasks', data);
}

function displayTasks() {
  var docFragment = document.createDocumentFragment();
  tasks.sort(function (t1, t2) {
    if (t1.priority == t2.priority) {
      return t1.title < t2.title ? -1 : 1;
    }
    return t1.priority - t2.priority;
  });
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    docFragment.appendChild(task.domElement);
  }
  document.getElementById("tasks").innerHTML = '';
  document.getElementById("tasks").appendChild(docFragment);
  //reattach dnd events
  var items = document.querySelectorAll('#tasks .task');
  [].forEach.call(items, function (item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });
}

window.onload = init;