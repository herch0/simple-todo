
var store = window.localStorage;
var tasks = [];

//window.localStorage.clear();

function init() {
  var btnNewTask = document.getElementById('btn_new_task');
  btnNewTask.addEventListener('click', newTask, false);

  var itemsJson = store.getItem('tasks');
  if (itemsJson) {
    itemsJson = JSON.parse(itemsJson);
    for (var i = 0; i < itemsJson.length; i++) {
      var item = itemsJson[i];
      tasks.push(new Task(item.title, item.priority, item.start, item.end, item.index));
    }
  }
  reloadTasks();
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
  div.className = 'task';
  div.innerHTML = title;
  div.addEventListener('change', this, false);
  this.domElement = div;
}

Task.prototype.handleEvent = function (event) {
  console.log(event.type);
  console.log(this.title);
  reloadTasks();
};

function newTask() {
  var title = document.getElementById("title").value;
  var priority = document.getElementById("priority").value;
  tasks.push(new Task(title, priority, new Date(), null));
  console.log(tasks);
  reloadTasks();
//  save();
}

function save() {
  var data = JSON.stringify(tasks);
  console.log(data);
  store.setItem('tasks', data);
}

function reloadTasks() {
  var docFragment = document.createDocumentFragment();
  tasks.sort(function (t1, t2) {
    if (t1.priority == t2.priority) {
      if (t1.index == t2.index) {
        return t1.title < t2.title ? -1 : 1;
      } else {
        return t2.index - t1.index;
      }
    }
    return t1.priority - t2.priority;
  });
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    task.index = i;
    task.domElement.dataset.index = i;
    docFragment.appendChild(task.domElement);
  }
  save();

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