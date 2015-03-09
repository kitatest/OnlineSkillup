(function loaded() {
	sortDate();

	//リスト全削除ボタン
	$("#clearButton").click(
		function() {
			clearText();
			sortDate();
			alert("リストを全削除しました");
	});
	// 「リスト作成」ボタンクリック時に実行するイベント
	$("#addList").click(
		function() {
			// エラーがなければリスト名を保存し、日付順にソートする
			if(errorCheck()) {
				saveText();
				sortDate();
			}
		});

	// リストを入力し、Enterを押してもaddlist.clickと同じイベントが発生する
	$("#addForm").keypress(
		function(e) {
			if(e.which == 13 && errorCheck()) {
				saveText();
				sortDate();
			}
	});

})();

// 入力された内容が正しいかどうかをチェックする
function errorCheck() {
	// 既に表示されている文章を消す
	var error = $("#error p");
	var success = $("#success p");
	error.text("");
	success.text("");

	var message;
	var numWords = $("#addForm").val().length;
	// 30文字を超えたらエラーを出す
	if(numWords > 30) {
		message = "リストの名称は30字以内にしてください";
		error.append(message);
		return false;
	// 何も入力してなければエラーを出す
	}else if(numWords <= 0) {
		message = "リスト名が入力されていません";
		error.append(message);
		return false;
	}
	// 正しく入力されていれば追加された通知を出す
	message = "新しいToDoリストが追加されました";
	success.append(message);
	return true;
}


// 入力された内容をローカルストレージに保存する
function saveText() {
	// 入力されたリスト名や日付を連想配列で保存する
	var hash = {};
	// listKey：リストの名前
	hash['listKey'] = escapeHTML($("#addForm").val());
	// todoType：今回はリストなのでlist
	hash['todoType'] = "list"
	// 現在時刻を文字列にしてlistDateに保存する
	var nowtime = new Date();
	var year = nowtime.getFullYear();
	var month = ("0" + (nowtime.getMonth() + 1)).slice(-2);
	var day = ("0" + nowtime.getDate()).slice(-2);
	var hour = ("0" + nowtime.getHours()).slice(-2);
	var minute = ("0" + nowtime.getMinutes()).slice(-2);
	var second = ("0" + nowtime.getSeconds()).slice(-2);
	hash['listDate'] = year + month + day + hour + minute + second;
	// 連想配列をJSON形式に変換してLocalStorageに保存する
	localStorage.setItem(hash.listKey, JSON.stringify(hash));
	// テキストボックスを空にする
	$("#addForm").val("");
}

// HTMLエスケープ
function escapeHTML(html) {
  return jQuery('<div>').text(html).html();
}

// ローカルストレージに保存した日付を早い順にソートして再描画する
function sortDate() {
	var forSortArray = Array();
	// listにあるlistDateを別の配列forSortArrayに格納する
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var forSortkey = localStorage.key(i);
		var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
		if (forSortvalue.todoType == "list") {
			forSortArray.push(forSortvalue.listDate);
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
			if(forSortArray[i] == value.listDate) {
				var numFinish = countFinish(key);
				var nearLimit = sortLimit(key);
				html.push("<dl id = \"list\"><a href = \"todoadd.html?id=" + value.listKey + "\"><h2>" + value.listKey + "</h2></a><dt>" + numFinish + "</dt><dt>〜" + nearLimit + "</dt></dl>");
			}
		}
	}
	list.append(html.join(''));
}

// 現在完了しているToDoの数を表示する
function countFinish(listKey) {
	var allTodo = 0;
	var alreadyFinish = 0;
	// LocalStorageにあるlistkeyとlistKeyが一致するtodoを探す
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var todoKey = localStorage.key(i);
		var todoValue = JSON.parse(localStorage.getItem(todoKey));
		// todoの中にあるfinishを確認して合計数と完了数をカウントする
		if(listKey == todoValue.listKey && todoValue.todoType == "todo") {
			allTodo++;
			if(todoValue.finish == "Y") {
				alreadyFinish++;
			}
		}
	}
	// 1個以上あればチェック数を示した文字列を返す
	if(allTodo >0 && allTodo == alreadyFinish){
		return ("全てチェック済み");
	}else if(allTodo > 0) {
		return (allTodo + "個中" + alreadyFinish + "個がチェック済み");
	}else {
		return "ToDoはありません";
	}
}

// list内にあるtodoで一番早い締め切りを探す
function sortLimit(listKey) {
	var forSortArray = Array();
	// listKeyと同じ名前のtodoのlistKeyからlistLimitを別の配列forSortArrayに格納する
	for(var i=0, storagelen=localStorage.length; i<storagelen; i++) {
		var forSortkey = localStorage.key(i);
		var forSortvalue = JSON.parse(localStorage.getItem(forSortkey));
		if(listKey == forSortvalue.listKey && forSortvalue.todoType == "todo") {
			forSortArray.push(forSortvalue.todoLimit);
		}
	}
	// forSoatArray内で日付のソートを行う
	forSortArray.sort(function(a, b) {
		return (a > b ? 1 : -1);
	});
	// 1つでもあれば一番近いlimitを表示する
	if(forSortArray.length > 0) {
		return forSortArray[0];
	// なければ空白にする
	}else {
		return "";
	}
}