
var store = window.localStorage;
var tasks = [];

function init() {
  var btnNewTask = document.getElementById('btn_new_task');
  btnNewTask.addEventListener('click', newTask, false);

  var itemsJson = store.getItem('tasks');
  if (itemsJson) {
    itemsJson = JSON.parse(itemsJson);
    for (var i = 0; i < itemsJson.length; i++) {
      var item = itemsJson[i];
      tasks.push(new Task(item.title, item.priority, item.start, item.end));
    }
  }
  reloadTasks();
}


function Task(title, priority, start, end) {
  this.title = title;
  this.priority = priority;
  this.start = start;
  this.end = end;
}

function newTask() {
  var title = document.getElementById("title").value;
  var priority = document.getElementById("priority").value;
  tasks.push(new Task(title, priority, new Date(), null));
  console.log(tasks);
  reloadTasks();
  save();
}

function save() {
  var data = JSON.stringify(tasks);
  store.setItem('tasks', data);
}

function reloadTasks() {
  var html = '';
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    html += '<div class="task" draggable=true>' + task.title + '</div>';
  }

  document.getElementById("tasks").innerHTML = html;
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