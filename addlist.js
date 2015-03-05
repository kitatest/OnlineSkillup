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
    array['todotype'] = "list"
    //array['id'] = localStorage.getItem("listnum");
    //localStorage.setItem("listnum", array.id + 1);
    nowtime = new Date();
    var year = nowtime.getFullYear().toString();
    var month = toDoubleDigits((nowtime.getMonth() + 1)).toString();
    var day = toDoubleDigits(nowtime.getDate()).toString();
    var hour = toDoubleDigits(nowtime.getHours()).toString();
    var minute = toDoubleDigits(nowtime.getMinutes()).toString();
    var second = toDoubleDigits(nowtime.getSeconds()).toString();
    array['listDate'] = year + "/" + month + "/" + day;
    array['listTime'] = hour + ":" + minute + ":" + second;
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

// ローカルストレージに保存した値を日付順にソートして再描画する
function sortDate() {
  var dateArray = Array();
  var timeArray = Array();
  var sortTimeArray = Array();

// 日付の比較
  for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
    var key = localStorage.key(i);
    dateArray[i] = (JSON.parse(localStorage.getItem(key))).listDate;
    timeArray[i] = (JSON.parse(localStorage.getItem(key))).listTime;
  }
  dateArray.sort(function(a, b) {
          return (a < b ? 1 : -1);
     });

// 日付が同じ場合は時間の比較
  for(i=0, arraylen=dateArray.length; i<arraylen; i++) {
    for(j=0; j<arraylen; j++) {
      if(dateArray[i] == dateArray[j] && i < j) {
        sortTimeArray[0] = timeArray[i];
        sortTimeArray[1] = timeArray[j];
        sortTimeArray.sort(function(a, b) {
          return (a < b ? 1 : -1);
        });
        timeArray[i] = sortTimeArray[0];
        timeArray[j] = sortTimeArray[1];
        //alert(i + "番目:" + timeArray[i]);
        //alert(j + "番目:" + timeArray[j]);
      }
    }
  }
  //alert(timeArray);

//時刻が一致しているのをLocalStorageから探して、順番に表示する
  // すでにある要素を削除する
  var list = $("#listall")
  list.children().remove();
  var html = [];
  for(i=0; i<arraylen; i++) {
    for(var j=0; j<storagelen; j++) {
      key = localStorage.key(j);
      value = JSON.parse(localStorage.getItem(key));
      // 同時刻にTODOが作られないことを祈る
      if(timeArray[i] == value.listTime){
        //alert(value.listName);
       html.push("<div id = \"list\"><a href = \"todoadd.html/?id=" + value.listName + "\">" + value.listName + "</a></div>");
      };
    }
  }
  list.append(html.join(''));
}
