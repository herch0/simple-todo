<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
  <head>
    <meta charset="UTF-8">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/skeleton.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <title></title>
    <style>
      [draggable] {
        user-select: none;
      }
      .task {
        height: 30px;
        line-height: 30px;
        width: 150px;
        border: 1px solid #ccc;
        margin-bottom: 5px;
        border-radius: 5px;
        text-align: center;
        cursor: move;
      }
      .task.over {
        border: 1px dashed #000;
      }
      #form_task label {
        display: inline-block;
      }
      #form_task button {
        display: inline;
        vertical-align: middle;
      }
      #form_task input {
        width: 400px;
      }
      #form_task button, #form_task select, #form_task input, #form_task label {
        margin-bottom: 0;
        margin: 4px;
      }

    </style>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div id="form_task" class="div_row">
            <label>Title</label><input type="text" id="title">
            <label>Priority</label>
            <select id="priority" >
              <option value="1">High</option>
              <option value="2">Normal</option>
              <option value="3">Low</option>
            </select>
            <button class="button" id="btn_new_task"><i class="fa fa-plus"></i> Create task</button>
        </div>
      </div>
      
        <div id="tasks">
          <!--      <div class="item" draggable="true">Item1</div>
                <div class="item" draggable="true">Item2</div>
                <div class="item" draggable="true">Item3</div>-->
        </div> 
    </div>
    <script src="js/app.js"></script>
    <script src="js/dnd.js"></script>
  </body>
</html>
