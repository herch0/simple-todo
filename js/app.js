
var store = window.localStorage;
var tasks = [];

var months = new Array("Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec");

//window.localStorage.clear();

function format_date(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  var d = date.getDate();
  var m = months[date.getMonth()];
  var y = date.getFullYear();
  return d + " " + m;
}

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
  div.addEventListener('priorityChange', this, false);
  div.addEventListener('finished', this, false);
  div.addEventListener('change', this, false);
  div.addEventListener('remove', this, false);
  var checkFinished = document.createElement('input');
  checkFinished.setAttribute('type', 'checkbox');
  checkFinished.addEventListener('change', checkFinishedClick);
  if (this.end) {
    checkFinished.checked = true;
  } else {
    checkFinished.checked = false;
  }
  var spanCheckFinished = document.createElement('span');
  spanCheckFinished.appendChild(checkFinished);
  div.appendChild(spanCheckFinished);
  var spanTitle = document.createElement('span');
  spanTitle.addEventListener('dblclick', taskDblClick);
  spanTitle.addEventListener('blur', taskBlur);
  spanTitle.className = 'title';
  spanTitle.innerHTML = title;
  div.appendChild(spanTitle);
  var finshDateSpan = document.createElement('span');
  finshDateSpan.setAttribute('class', 'finishDate');
  if (this.end) {
    finshDateSpan.innerHTML = format_date(this.end);
  }
  div.appendChild(finshDateSpan);
  
  var spanRemove = document.createElement('a');
  spanRemove.addEventListener('click', removeTaskClick);
  spanRemove.className = 'close';
  spanRemove.innerHTML = '<i class="fa fa-close"></i>';
  div.appendChild(spanRemove);
  this.domElement = div;
}

Task.prototype.handleEvent = function (event) {
  if (event.type == 'priorityChange') {
    if (event.detail) {
      if (event.detail.priority) {
        this.domElement.classList.remove('priority-' + this.priority);
        this.priority = event.detail.priority;
        this.domElement.classList.add('priority-' + this.priority);
      }
    }
    displayTasks();
  } else if (event.type == 'finished') {
    this.end = event.detail.finishDate;
    if (this.end) {
      //3rd element is span finshdate
      this.domElement.childNodes[2].innerHTML = format_date(this.end);
    } else {
      this.domElement.childNodes[2].innerHTML = '';
    }
  } else if (event.type == 'change') {// 2nd child is title span
    if (this.title != this.domElement.childNodes[1].innerHTML) {
      this.title = this.domElement.childNodes[1].innerHTML;
    }
  } else if (event.type == 'remove') {
    var i = tasks.indexOf(this);
    tasks.splice(i, 1);
    displayTasks();    
  }
  save();
};

function removeTaskClick(event) {
  //first parent is <a>, second is the task div
  event.target.parentNode.parentNode.dispatchEvent(new Event('remove'));
}

function checkFinishedClick(event) {
  var check = event.target;
  if (check.checked) {
    var date = new Date();
  } else {
    var date = null;
  }
  event.target.parentNode.dispatchEvent(new CustomEvent('finished', {'detail': {'finishDate': date}}))
}

function taskDblClick(event) {
  event.target.contentEditable = true;
  event.target.style.cursor = 'text';
  //select the text inside the div
  var selection = window.getSelection();
  var range = document.createRange();
  range.setStart(event.target.firstChild, 0);
  range.setEnd(event.target.firstChild, event.target.firstChild.textContent.length);
  selection.addRange(range);
  //////////////////////////////////
  event.target.focus();
}

function taskBlur(event) {
  var selection = window.getSelection();
  selection.removeAllRanges();
  event.target.contentEditable = false;
  event.target.style.cursor = 'move';
  event.target.parentNode.dispatchEvent(new Event('change'));
}

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