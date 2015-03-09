(function loaded() {
	//todoの名前を調べる
	getListKey();
	sortDate();
	cssButton();

	// ボタンをクリックしたときに実行するイベントを設定する
	$("#addToDo").click(
		// コールバックとしてメソッドを引数にわたす
		function () {
			if(errorCheck()){
				saveTodo();
				sortDate();
				cssButton();
			}
		});

	// todoを入力し、Enterを押しても何も起こらない
	$("#nameForm").keypress(
		function(e) {
			if(e.which == 13) {
				return false;
			}
	});

	// 日付を入力し、Enterを押してもaddtodo.clickと同じイベントが発生する
	$("#limitForm").keypress(
		function(e) {
			if(e.which == 13 && errorCheck()) {
				saveTodo();
				sortDate();
				cssButton();
			}
	});

	// 作成したtodoの完了・未完了ボタンが押されたときに実行するイベント
	$("#todoAll").on('click', '.finishButton',
		function () {
			// finishButtonのidから何番目のボタンが押されたかを調べる
			var key = $(this).attr("id");
			finishTodo($('#todoNum' + key + ' h2').text(), key);
			cssButton();
		});
})();

// ListKeyを調べる
function getListKey() {
	var list = $("#newToDo");
	list.children().remove();
	var idName = getParameter();
	list.append(idName);
}

// todoadd.html/?id=の名前を調べる
function getParameter() {
	var parameter = location.search;
	parameter = parameter.substring(4, parameter.length);
	parameter = decodeURIComponent(parameter);
	return parameter;
}

// 入力された内容が正しいかどうかをチェックする
function errorCheck() {
	// 既に表示されている文章を消す
	var error = $("#error p");
	var success = $("#success p");
	error.text("");
	success.text("");

	// 期限が「yyyy-mm-dd」となっているので切り取る
	var limitDate = Array();
	limitDate = $("#limitForm").val().split("-");
	var message;
	var numWords = $("#nameForm").val().length;

	// 30文字を超えたらエラーを出す
	if(numWords > 30) {
		message = "リストの名称は30字以内にしてください";
		error.append(message);
		return false;
	// 何も入力してなければエラーを出す
	}else if(numWords <= 0) {
		message = "ToDo名が入力されていません";
		error.append(message);
		return false;
	// 年月日それぞれが数値でなければエラーを出す
	}else if(($.isNumeric(limitDate[0])) && ($.isNumeric(limitDate[1])) && ($.isNumeric(limitDate[2]))) {
		var limitYear = parseInt(limitDate[0]);
		var limitMonth = parseInt(limitDate[1]);
		var limitDay = parseInt(limitDate[2]);
		var chackDate = new Date(limitYear, limitMonth-1, limitDay);

		// 今日の日付取得
		var nowtime = new Date();
		var nowYear = nowtime.getFullYear();
		var nowMonth = nowtime.getMonth() + 1;
		var nowDay = nowtime.getDate();

		// 今日より前だったらエラーを出す
		if(limitYear < nowYear || (limitYear == nowYear && limitMonth < nowMonth) || (limitYear == nowYear && limitMonth == nowMonth && limitDay < nowDay)) {
			message = "期限が今日より前です";
			error.append(message);
			return false;

		// 正しい年月日になっていたらtodoを作る
		}else if(chackDate.getFullYear() == limitYear && chackDate.getMonth() == limitMonth-1 && chackDate.getDate() == limitDay) {
			message = "新しいToDoが作成されました";
			success.append(message);
			return true;
		}
	}
	message = "正しい期限が入力されていません";
	error.append(message);
	return false;
}


// 入力された内容をローカルストレージに保存する
function saveTodo() {
	// 入力されたtodo名や日付を連想配列で保存する
	var hash = {};
	// todoKey：todoの名前
	var todoKey = escapeHTML($("#nameForm").val());
	// listKey：このtodoがあるリスト名
	hash['listKey'] = getParameter();
	// todoType：今回はtodoの中身なのでtodo
	hash['todoType'] = "todo"
	// todoLimit：todoの締め切り
	var limitDate = Array();
	limitDate = $("#limitForm").val().split("-");
	hash['todoLimit'] = limitDate[0] + "年" + ("0" + limitDate[1]).slice(-2) + "月" + ("0" + limitDate[2]).slice(-2) + "日";
	// todoDate：現在の日時
	nowtime = new Date();
	var year = nowtime.getFullYear();
	var month = ("0" + (nowtime.getMonth() + 1)).slice(-2);
	var day = ("0" + nowtime.getDate()).slice(-2);
	var hour = ("0" + nowtime.getHours()).slice(-2);
	var minute = ("0" + nowtime.getMinutes()).slice(-2);
	var second = ("0" + nowtime.getSeconds()).slice(-2);
	hash['todoDate'] = year + month + day + hour + minute + second;
	// finish：完了（Y）か未完了（N）か
	hash['finish'] = "N";
	localStorage.setItem(todoKey, JSON.stringify(hash));
	// テキストボックスを空にする
	$("#nameForm").val("");
	$("#limitForm").val("");
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
		if (forSortvalue.todoType == "todo") {
			forSortArray.push(forSortvalue.todoDate);
		}
	}
	// forSoatArray内で日付のソートを行う
	forSortArray.sort(function(a, b) {
		return (a < b ? 1 : -1);
	});

	// すでにあるtodoAll要素を削除する
	var list = $("#todoAll")
	list.children().remove();
	var html = [];
	var todoID = 0;
	//配列内にある時刻をLocalStorageのtodoDateから探して、順番に表示する
	for(i=0, arraylen=forSortArray.length; i<arraylen; i++) {
		for(var j=0; j<storagelen; j++) {
			key = localStorage.key(j);
			value = JSON.parse(localStorage.getItem(key));

			// todoが完了しているかどうかでボタンの文字を変更する
			if(forSortArray[i] == value.todoDate){
				var finish;
				if(value.finish == "N") {
					finish = "未完了";
				}else if(value.finish == "Y") {
					finish = "完了";
				}

			// todoDateは「yyyymmddhhmmss」となっているのでそれぞれ切り取る
			var todoDate = value.todoDate.slice(0, 4) + "年" + value.todoDate.slice(4, 6) + "月" + value.todoDate.slice(6, 8) + "日";
			html.push("<dl id=todoNum" + todoID + "><h2>" + key + "</h2><dt>期限：　"+ value.todoLimit + "</dt><dt>作成日：" + todoDate + "</dt><dd><input class=\"finishButton\" id=\"" + todoID + "\" type=\"button\" value=\""+ finish + "\"></dd></dl>");
			todoID++;
			}
		}
	}
	list.append(html.join(''));
}

// 完了・未完了ボタンにCSSプロパティを設定する
function cssButton() {
	var buttonNum = 0;
	var todoID = $('#' + buttonNum);
	// ボタンが存在しなくなるまでwhile文を回す
	while(todoID[0]) {
		todoID.css({
		"width": "150px",
		"height": "50px",
		"font-size": "1.2em",
		"color": "#fff",
		"border-style": "none",
		"border-top": "3px solid #ddd",
		"border-left": "3px solid #ddd",
		"border-right": "3px solid #bbb",
		"border-bottom": "3px solid #bbb",
		"border-radius": "10px",
		"cursor": "pointer",
		"z-index": "1"
		});
		// 完了の時はオレンジにする
		if(todoID.val() == "完了"){
			todoID.css({
			"background-color": "#ff5600"
			});
		// 未完了の時は青にする
		}else if(todoID.val() == "未完了") {
			todoID.css({
			"background-color": "#2419b2"
			});
		}
		todoID = $('#' + ++buttonNum);
	}
}

// 完了・未完了ボタンが押された時にLocalStorageの中身を更新する
function finishTodo(key, buttonNum) {
	var hash = {};
	var value = [];
	value = JSON.parse(localStorage.getItem(key));
	hash['listKey'] = value.listKey;
	hash['todoType'] = "todo"
	hash['todoLimit'] = value.todoLimit;
	hash['todoDate'] = value.todoDate;
	// 未完了から完了にする
	if(value.finish == "N") {
		hash['finish'] = "Y";
		$('#' + buttonNum).val("完了");
	// 完了から未完了にする
	}else if(value.finish == "Y") {
		hash['finish'] = "N";
		$('#' + buttonNum).val("未完了");
	}
	localStorage.setItem(key, JSON.stringify(hash));
}
