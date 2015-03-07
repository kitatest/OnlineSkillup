$(loaded);

function loaded() {
  sortDate();

  //リスト全削除ボタン
  $("#clearButton").click(
    function () {
      clearText();
      sortDate();
      alert("リストを全削除しました");
  });
  // ボタンをクリックしたときに実行するイベントを設定する
  $("#formButton").click(
    // コールバックとしてメソッドを引数にわたす
    function () {
      if(errorCheck()){
        saveText();
        sortDate();
      //alert("リストを作成しました");
    }
  });

  $("form").submit(
    function() {
      if(errorCheck()){
        saveText();
        sortDate();
      }
  });

  $("#addButton").click(
    function() {
      addData();
      sortDate();
  });

  $("#sortButton").click(
    function() {
      sortDate();
  });
}

// 入力された内容をローカルストレージに保存する
function saveText() {
  var error = $("#error")
  error.children().remove();
    // 時刻をキーにして入力されたテキストを保存する
    var array = {};
    array['listKey'] = $("input:first").val();
    array['todoType'] = "list"
    //array['id'] = localStorage.getItem("listnum");
    //localStorage.setItem("listnum", array.id + 1);
    nowtime = new Date();
    var year = nowtime.getFullYear().toString();
    var month = toDoubleDigits((nowtime.getMonth() + 1)).toString();
    var day = toDoubleDigits(nowtime.getDate()).toString();
    var hour = toDoubleDigits(nowtime.getHours()).toString();
    var minute = toDoubleDigits(nowtime.getMinutes()).toString();
    var second = toDoubleDigits(nowtime.getSeconds()).toString();
    array['listDate'] = year + month + day + hour + minute + second;
    //array['listTime'] = hour + ":" + minute + ":" + second;
    listid = array.listKey;
    //alert(listid);
    localStorage.setItem(listid, JSON.stringify(array));
    //var value = JSON.parse(localStorage.getItem(listid));
    //alert(value.listkey);
    //localStorage.setItem(time, text.val());
    // テキストボックスを空にする
    //text.val("");
}

function errorCheck() {
  var error = $("#error")
  error.children().remove();
  var html = [];
  if($("input:first").val().length > 30){
    html.push("<p>リストの名称は30字以内にしてください</p>");
    error.append(html.join(''));
    return false;
  }else if($("input:first").val().length <= 0){
    html.push("<p>リスト名が入力されていません</p>");
    error.append(html.join(''));
    return false;
  }
  return true;
}

// 月や日が1桁の時に頭に0を付け足す
function toDoubleDigits(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;
}

// リストに保存されている内容を全て削除する
function clearText() {
  localStorage.clear();
  listnum = 0;
}

function addData() {
  var array = {};
  array['listKey'] = "れぽーと";
  array['todoType'] = "list";
  array['listDate'] = "20140305151039";
  listid = array.listKey;
  localStorage.setItem(listid, JSON.stringify(array));

  array['listKey'] = "おてつだい";
  array['todoType'] = "list";
  array['listDate'] = "20150305151039";
  listid = array.listKey;
  localStorage.setItem(listid, JSON.stringify(array));

  array['listKey'] = "おしごと";
  array['todoType'] = "list";
  array['listDate'] = "20160305151039";
  listid = array.listKey;
  localStorage.setItem(listid, JSON.stringify(array));
}

// ローカルストレージに保存した値を日付順にソートして再描画する
function sortDate() {
  //var forSortArray = {};
  var forSortArray = Array();
  var sortListNum = 0;
// 日付の比較
  for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
    var forSortkey = localStorage.key(i);
    var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
    if (forSortvalue.todoType == "list"){
      // listDateには「yyyy/mm/dd」が入っている
      forSortArray[sortListNum] = forSortvalue.listDate;
      //listTimeには「hh:mm:ss」が入っている
      //forSortArray[sortListNum]['time'] = forSortvalue.listTime;
      //alert(forSortArray[sortListNum]);
      //alert(sortListNum + ":" + forSortArray[sortListNum]['date'] + ":" + forSortArray[sortListNum]['time']);
      sortListNum++;
    }
  }
  forSortArray.sort(function(a, b) {
    return (a < b ? 1 : -1);
  });

  //時刻が一致しているのをLocalStorageから探して、順番に表示する
  // すでにある要素を削除する
  var list = $("#listall")
  list.children().remove();
  var html = [];
  for(i=0, arraylen=forSortArray.length; i<arraylen; i++) {
    for(var j=0; j<storagelen; j++) {
      var key = localStorage.key(j);
      var value = JSON.parse(localStorage.getItem(key));
      if(forSortArray[i] == value.listDate){
        var numFinish = countFinish(key);
        var nearLimit = sortLimit(key);
        //alert(value.listKey);
        html.push("<dl id = \"list\"><a href = \"todoadd.html/?id=" + value.listKey + "\"><h2>" + value.listKey + "</h2></a><dt>" + numFinish + "</dt><dt>〜" + nearLimit + "</dt></dl>");
      };
    }
  }
  list.append(html.join(''));
}

function countFinish(listKey) {
  //alert(listkey);
  var allFinish = 0;
  var alreadyFinish = 0;
  for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
    var todoKey = localStorage.key(i);
    var todoValue = JSON.parse(localStorage.getItem(todoKey));
    if(listKey == todoValue.listName) {
      allFinish++;
      if(todoValue.finish == "N") {
        finish = "未完了";
      }else if(todoValue.finish == "Y") {
        finish = "完了";
        alreadyFinish++;
      }else {
        //alert("Count Finish Error.");
      }
    }
  }
  if(allFinish > 0){
    return (allFinish + "個中" + alreadyFinish + "個がチェック済み");
  }else {
    return "ToDoはありません";
  }
}

function sortLimit(listKey) {
  //var forSortArray = {};
  var forSortArray = Array();
  var sortListNum = 0;
// 日付の比較
  for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
    var forSortkey = localStorage.key(i);
    var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
    if (listKey == forSortvalue.listName){
      // todoLimitには「yyyymmdd」が入っている
      forSortArray[sortListNum] = forSortvalue.todoLimit;
      //alert(forSortArray[sortListNum]);
      sortListNum++;
    }
  }
  forSortArray.sort(function(a, b) {
    return (a > b ? 1 : -1);
  });
  if (forSortArray.length > 0) {
    var todoLimit = (forSortArray[0]).slice(0, 4) + "年" + (forSortArray[0]).slice(4, 6) + "月" + (forSortArray[0]).slice(6, 8) + "日";
    return todoLimit;
  }else {
    return "";
  }

}