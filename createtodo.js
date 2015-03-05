$(loaded);

function loaded() {
  //TODOの名前を拾う
  var list = $("#new-todo")
  var html = [];
  for(var i=0, len=localStorage.length; i<len; i++) {
    key = localStorage.key(i);
    value = JSON.parse(localStorage.getItem(key));
    if(getParameter() == value.listName){
      html.push("<p>" + value.listName + "</p>")
    }
  }
  list.before(html.join(''));

  //showTodo();
  // ボタンをクリックしたときに実行するイベントを設定する
  $("#addToDo").click(
    // コールバックとしてメソッドを引数にわたす
    function () {
      saveTodo();
      //showTodo();
      //alert("リストを作成しました");
    });

  $("#kakunin").click(
    function () {
      kakunin();
    });
}

// 入力された内容をローカルストレージに保存する
function saveTodo() {
  if($("#name").val().length > 5){
    alert("5文字以上になりました");
  }else if($("#name").val().length <= 0){
    alert("入力されてません");
  }else{
    // 入力されたテキストを保存する
    var array = {};
    //var todoName = "todo" + $("#name").val();
    array['todoName'] = $("#name").val();
    array['todotype'] = "todo"
    array['todoLimit'] = $("#limit").val();
    todoListName = getParameter();
    nowtime = new Date();
    var year = nowtime.getFullYear().toString();
    var month = (nowtime.getMonth() + 1).toString();
    var day = nowtime.getDate().toString();
    array['todoDate'] = year + "年" + month + "月" + day + "日";
    //var time = new Date();
    localStorage.setItem(todoListName, JSON.stringify(array));
    //alert(array);
    // テキストボックスを空にする
    $("#name").val("");
    $("#limit").val("");
  }
}

// ローカルストレージに保存した値を再描画する
function showTodo() {
  // すでにある要素を削除する
  var list = $("#listall")
  list.children().remove();
  // ローカルストレージに保存された値すべてを要素に追加する
  var key, value, html = [];
  for(var i=0, len=localStorage.length; i<len; i++) {
    key = localStorage.key(i);
    value = localStorage.getItem(key);
    html.push("<p><size = \"5\">" + value.todoName + "</p></size>");
    html.push("<p>< color = \"#87cefa\">期限：　"+ value.todoLimit + "</p></color>");
  }
  list.append(html.join(''));
}

function getParameter() {
  var parameter = location.search;
  parameter = parameter.substring(4, parameter.length);
  parameter = decodeURIComponent(parameter);
  return parameter;
}

function kakunin() {
  for(var i=0, len=localStorage.length; i<len; i++) {
    var keyCut = (localStorage.key(i)).slice(0, 4);
    //alert(keyCut);
    if (keyCut != "list") {
      var list = $("#listall")
      list.children().remove();

      var key, value, html = [];
      key = localStorage.key(i);
      value = JSON.parse(localStorage.getItem(key));
      html.push("<p><size = \"5\">" + value.todoName + "</p></size><p><color = \"#87cefa\">期限：　"+ value.todoLimit + "</p><p>作成日：" + value.todoDate + "</p></color><input id=\"finishButton" + value.todoName + "\" type=\"button\" value=\"未完了\">");
      html.push("");
      list.append(html.join(''));
    }
  }
}
