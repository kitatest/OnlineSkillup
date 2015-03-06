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
      saveText();
      sortDate();
      //alert("リストを作成しました");
    });

  $("form").submit(
    function() {
      saveText();
      sortDate();
  });

  $("#addButton").click(
    function(event) {
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
  if($("input:first").val().length > 5){
    alert("5文字以上になりました");
  }else if($("input:first").val().length <= 0){
    alert("入力されてません");
  }else{
    // 時刻をキーにして入力されたテキストを保存する
    var array = {};
    array['listName'] = $("input:first").val();
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
    listid = "list" + array.listName;
    //alert(listid);
    localStorage.setItem(listid, JSON.stringify(array));
    //var value = JSON.parse(localStorage.getItem(listid));
    //alert(value.listname);
    //localStorage.setItem(time, text.val());
    // テキストボックスを空にする
    //text.val("");
  }
}

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
  array['listName'] = "れぽーと";
  array['todoType'] = "list";
  array['listDate'] = "20140305151039";
  listid = "list" + array.listName;
  localStorage.setItem(listid, JSON.stringify(array));

  array['listName'] = "おてつだい";
  array['todoType'] = "list";
  array['listDate'] = "20150305151039";
  listid = "list" + array.listName;
  localStorage.setItem(listid, JSON.stringify(array));

  array['listName'] = "おしごと";
  array['todoType'] = "list";
  array['listDate'] = "20160305151039";
  listid = "list" + array.listName;
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
      key = localStorage.key(j);
      value = JSON.parse(localStorage.getItem(key));
      if(forSortArray[i] == value.listDate){
        //alert(value.listName);
       html.push("<div id = \"list\"><a href = \"todoadd.html/?id=" + value.listName + "\">" + value.listName + "</a></div>");
      };
    }
  }
  list.append(html.join(''));
}
