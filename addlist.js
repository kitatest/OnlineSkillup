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
	// 「リスト作成」ボタンクリック時に実行するイベント
	$("#addList").click(
		function () {
			// エラーがなければリスト名を保存し、日付順にソートする
			if(errorCheck()){
				saveText();
				sortDate();
			}
		});

	// リストを入力し、Enterを押してもaddlist.clickと同じイベントが発生する
	$("form").submit(
		function () {
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

// 入力された内容が正しいかどうかをチェックする
function errorCheck() {
	var error = $("#error");
	var success = $("#success");
	error.children().remove();
	success.children().remove();
	var html = [];
	// 30文字を超えたらエラーを出す
	if($("#addForm").val().length > 30){
		html.push("<p>リストの名称は30字以内にしてください</p>");
		error.append(html.join(''));
		return false;
	// 何も入力してなければエラーを出す
	}else if($("#addForm").val().length <= 0){
		html.push("<p>リスト名が入力されていません</p>");
		error.append(html.join(''));
		return false;
	}
	// 正しく入力されていれば追加された通知を出す
	html.push("<p>新しいToDoリストが追加されました</p>");
	success.append(html.join(''));
	return true;
}


// 入力された内容をローカルストレージに保存する
function saveText() {
	// エラーメッセージが事前にあれば消す
	var error = $("#error")
	error.children().remove();
	// 入力されたリスト名や日付を連想配列で保存する
	var array = {};
	// listKey：リストの名前
	array['listKey'] = $("#addForm").val();
	// todoType：listとtodoの2種類
	array['todoType'] = "list"
	// 現在時刻を文字列にしてlistDateに保存する
	nowtime = new Date();
	var year = nowtime.getFullYear().toString();
	var month = toDoubleDigits((nowtime.getMonth() + 1)).toString();
	var day = toDoubleDigits(nowtime.getDate()).toString();
	var hour = toDoubleDigits(nowtime.getHours()).toString();
	var minute = toDoubleDigits(nowtime.getMinutes()).toString();
	var second = toDoubleDigits(nowtime.getSeconds()).toString();
	array['listDate'] = year + month + day + hour + minute + second;
	// 連想配列をJSON形式に変換してLocalStorageに保存する
	listid = array.listKey;
	localStorage.setItem(listid, JSON.stringify(array));
	// テキストボックスを空にする
	$("#addForm").val("");
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
	var forSortArray = Array();
	var sortListNum = 0;
	// listにあるlistDateを別の配列forSortArrayに格納する
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var forSortkey = localStorage.key(i);
		var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
		if (forSortvalue.todoType == "list"){
			forSortArray[sortListNum] = forSortvalue.listDate;
			sortListNum++;
		}
	}
	// forSoatArray内で日付のソートを行う
	forSortArray.sort(function(a, b) {
		return (a < b ? 1 : -1);
	});

	// すでにあるlistAll内の要素を削除する
	var list = $("#listAll")
	list.children().remove();
	//配列内にある時刻をLocalStorageのlistDateから探して、順番に表示する
	var html = [];
	for(i=0, arraylen=forSortArray.length; i<arraylen; i++) {
		for(var j=0; j<storagelen; j++) {
			var key = localStorage.key(j);
			var value = JSON.parse(localStorage.getItem(key));
			if(forSortArray[i] == value.listDate){
				var numFinish = countFinish(key);
				var nearLimit = sortLimit(key);
				html.push("<dl id = \"list\"><a href = \"todoadd.html/?id=" + value.listKey + "\"><h2>" + value.listKey + "</h2></a><dt>" + numFinish + "</dt><dt>〜" + nearLimit + "</dt></dl>");
			}
		}
	}
	list.append(html.join(''));
}

// 現在完了しているToDoの数を表示する
function countFinish(listKey) {
	//alert(listkey);
	var allFinish = 0;
	var alreadyFinish = 0;
	// LocalStorageにあるlistkeyとlistNameが一致するtodoを探す
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var todoKey = localStorage.key(i);
		var todoValue = JSON.parse(localStorage.getItem(todoKey));
		// todoの中にあるfinishを確認して合計数と完了数をカウントする
		if(listKey == todoValue.listName) {
			allFinish++;
			if(todoValue.finish == "N") {
				finish = "未完了";
			}else if(todoValue.finish == "Y") {
				finish = "完了";
				alreadyFinish++;
			}
		}
	}
	// 1個以上あればチェック数を示した文字列を返す
	if(allFinish > 0){
		return (allFinish + "個中" + alreadyFinish + "個がチェック済み");
	}else {
		return "ToDoはありません";
	}
}

// list内にあるtodoで一番早い締め切りを探す
function sortLimit(listKey) {
	var forSortArray = Array();
	var sortListNum = 0;
// 日付の比較
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var forSortkey = localStorage.key(i);
		var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
		if (listKey == forSortvalue.listName){
			forSortArray[sortListNum] = forSortvalue.todoLimit;
			sortListNum++;
		}
	}
	forSortArray.sort(function(a, b) {
		return (a > b ? 1 : -1);
	});
	if (forSortArray.length > 0) {
		return forSortArray[0];
	}else {
		return "";
	}

}