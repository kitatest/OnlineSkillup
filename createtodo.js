$(loaded);

function loaded() {
  //TODOの名前を拾う
  var list = $("#new-todo");
  list.children().remove();
  var html = [];
  html.push(getParameter())
  list.append(html.join(''));

  showTodo();
  //$("#limit").val("yyyy/mm/dd").css("color","#CCC").focus(
    //function() {
    //$(this).val("").css("color","#000")
  //});

  // ボタンをクリックしたときに実行するイベントを設定する
  $("#addToDo").click(
    // コールバックとしてメソッドを引数にわたす
    function () {
      saveTodo();
      showTodo();
      //alert("リストを作成しました");
    });

  $("#kakunin").click(
    function () {
      errorCheck2();
    });

  $("#finishButton0").click(
    function () {
      //var key = $('#todoNum0').text();
      //alert(test);
      finishTodo($('#todoNum0 h2').text(), 0);
  });

  $("#finishButton1").click(
    function () {
      finishTodo($('#todoNum1 h2').text(), 1);
  });
}

// 入力された内容をローカルストレージに保存する
function saveTodo() {
  if(!errorCheck()){

  }else {
    // 入力されたテキストを保存する
    var array = {};
    var todoName = $("#name").val();
    array['listName'] = getParameter();
    //array['todoName'] = $("#name").val();
    array['todoType'] = "todo"
    //var limitDate = Array();
    //limitDate = $("#limit").val().split("/");
    array['todoLimit'] = errorCheck();
    //todoListName = getParameter();
    nowtime = new Date();
    var year = nowtime.getFullYear().toString();
    var month = (nowtime.getMonth() + 1).toString();
    var day = nowtime.getDate().toString();
    array['todoDate'] = year + "年" + month + "月" + day + "日";
    array['finish'] = "N";
    //var time = new Date();
    localStorage.setItem(todoName, JSON.stringify(array));
    //alert(array);
    // テキストボックスを空にする
    $("#name").val("");
    $("#limit").val("");
  }
}

function errorCheck() {
  var error = $("#error")
  error.children().remove();
  var limitDate = Array();
  limitDate = $("#limit").val().split("/");
  //alert($.isNumeric(limitDate[0]));
  //alert($.isNumeric(limitDate[1]));
  //alert($.isNumeric(limitDate[2]));
  var html = [];
  if($("#name").val().length <= 0){
    html.push("<p><font size = \"5\" color = \"red\">ToDo名が作成されていません</font></p>");
    error.append(html.join(''));
    return false;
  }else if(($.isNumeric(limitDate[0])) && ($.isNumeric(limitDate[1])) && ($.isNumeric(limitDate[2]))){
    var limitYear = parseInt(limitDate[0]);
    var limitMonth = parseInt(limitDate[1]);
    var limitDay = parseInt(limitDate[2]);
    var chackDate = new Date(limitYear, limitMonth-1, limitDay);

    if(limitYear < 2015) {
      html.push("<p><font size = \"5\" color = \"red\">期限が2015年より前です</font></p>");
      error.append(html.join(''));
      return false;
    }else if(chackDate.getFullYear() == limitYear && chackDate.getMonth() == limitMonth-1 && chackDate.getDate() == limitDay) {
      alert(limitYear + "年" + limitMonth + "月" + limitDay + "日");
      return (limitYear + "年" + limitMonth + "月" + limitDay + "日");
    }else{
      html.push("<p><font size = \"5\" color = \"red\">正しい期限が入力されていません</font></p>");
      error.append(html.join(''));
      return false;
    }
  }
}

function getParameter() {
  var parameter = location.search;
  parameter = parameter.substring(4, parameter.length);
  parameter = decodeURIComponent(parameter);
  return parameter;
}

function showTodo() {
  var todoNum = 0;

  // すでにある要素を削除する
  var list = $("#todoall")
  list.children().remove();
  for(var i=0, len=localStorage.length; i<len; i++) {
    var key, value, html = [];
    key = localStorage.key(i);
    value = JSON.parse(localStorage.getItem(key));
    if (value.todoType == "todo"){
      var finish;
      if(value.finish == "N") {
        finish = "未完了";
      }else if(value.finish == "Y") {
       finish = "完了";
      }
      //var keyCut = (localStorage.key(i)).slice(4);
  // ローカルストレージに保存された値すべてを要素に追加する
      html.push("<dl id=todoNum" + todoNum + "><h2>" + key + "</h2><dt><font color = \"#87cefa\">期限：　"+ value.todoLimit + "</dt><dt>作成日：" + value.todoDate + "</dt></font><dd><input id=\"finishButton" + todoNum + "\" type=\"button\" value=\""+ finish + "\"></dd></dl>");
      //alert('#finishButton' + todoNum);
      //var test = 2;
      todoNum++;
    }
    list.append(html.join(''));
  }

  for(var i=0; i<5; i++) {
      $('#finishButton' + i).css({
        "width": "150px",
        "height": "50px",
        "font-size": "1.2em",
        "background-color": "#000",
        "color": "#fff",
        "border-style": "none"
      });
  }
}


function finishTodo(key, buttonNum) {
  //alert(key + ":" + buttonNum);
  var array = {};
  var value = [];
  value = JSON.parse(localStorage.getItem(key));
  array['listName'] = value.listName;
    //array['todoName'] = $("#name").val();
  array['todoType'] = "todo"
  array['todoLimit'] = value.todoLimit;
  array['todoDate'] = value.todoDate;
  if(value.finish == "N") {
    $('#finishButton' + buttonNum).val("完了");
    array['finish'] = "Y";
  }else if(value.finish == "Y") {
    $('#finishButton' + buttonNum).val("未完了");
    array['finish'] = "N";
  }
  localStorage.setItem(key, JSON.stringify(array));
}
