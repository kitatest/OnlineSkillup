$(loaded);

function loaded() {
	//TODOの名前を拾う
	var list = $("#new-todo");
	list.children().remove();
	var html = [];
	html.push(getParameter())
	list.append(html.join(''));

	sortDate();
	cssButton();
	//$("#limit").val("yyyy/mm/dd").css("color","#CCC").focus(
		//function() {
		//$(this).val("").css("color","#000")
	//});

	// ボタンをクリックしたときに実行するイベントを設定する
	$("#addToDo").click(
		// コールバックとしてメソッドを引数にわたす
		function () {
			if(errorCheck()){
				saveTodo();
				sortDate();
				cssButton();
			}
			//alert("リストを作成しました");
		});

	//$(".finishButton").click(
		//function () {
			//var key = $(this).attr("id");
			//finishTodo($('#todoNum' + key + ' h2').text(), key);
			//alert($(key).val());
			//cssButton();
		//});

	$("#todoall").on('click', '.finishButton',
		function () {
			var key = $(this).attr("id");
			finishTodo($('#todoNum' + key + ' h2').text(), key);
			//alert($(key).val());
			cssButton();
		});

	//$("#finishButton1").click(
		//function () {
			//finishTodo($('#todoNum1 h2').text(), 1);
	//});
}

// 入力された内容をローカルストレージに保存する
function saveTodo() {
		// 入力されたテキストを保存する
	var array = {};
	var todoName = $("#name").val();
	array['listName'] = getParameter();
	//array['todoName'] = $("#name").val();
	array['todoType'] = "todo"
	//var limitDate = Array();
	//limitDate = $("#limit").val().split("/");
	var limitDate = Array();
	limitDate = $("#limit").val().split("/");
	array['todoLimit'] = toDoubleDigits(limitDate[0]).toString() + "年" + toDoubleDigits(limitDate[1]).toString() + "月" + toDoubleDigits(limitDate[2]).toString() + "日";
	//todoListName = getParameter();
	nowtime = new Date();
	var year = toDoubleDigits(nowtime.getFullYear()).toString();
	var month = toDoubleDigits((nowtime.getMonth() + 1)).toString();
	var day = toDoubleDigits(nowtime.getDate()).toString();
	var hour = toDoubleDigits(nowtime.getHours()).toString();
	var minute = toDoubleDigits(nowtime.getMinutes()).toString();
	var second = toDoubleDigits(nowtime.getSeconds()).toString();
	array['todoDate'] = year + month + day + hour + minute + second;
	array['finish'] = "N";
	//var time = new Date();
	localStorage.setItem(todoName, JSON.stringify(array));
	//alert(array);
	// テキストボックスを空にする
	$("#name").val("");
	$("#limit").val("");
}

function errorCheck() {
	var error = $("#error");
	error.children().remove();
	var limitDate = Array();
	limitDate = $("#limit").val().split("/");
	//alert($.isNumeric(limitDate[0]));
	//alert($.isNumeric(limitDate[1]));
	//alert($.isNumeric(limitDate[2]));
	var html = [];
	if($("#name").val().length <= 0){
		html.push("<p>ToDo名が作成されていません</p>");
		error.append(html.join(''));
		return false;
	}else if(($.isNumeric(limitDate[0])) && ($.isNumeric(limitDate[1])) && ($.isNumeric(limitDate[2]))){
		var limitYear = parseInt(limitDate[0]);
		var limitMonth = parseInt(limitDate[1]);
		var limitDay = parseInt(limitDate[2]);
		var chackDate = new Date(limitYear, limitMonth-1, limitDay);

		if(limitYear < 2015) {
			html.push("<p>期限が2015年より前です</p>");
			error.append(html.join(''));
			return false;
		}else if(chackDate.getFullYear() == limitYear && chackDate.getMonth() == limitMonth-1 && chackDate.getDate() == limitDay) {
			html.push("<p>新しいToDoが作成されました</p>");
			error.append(html.join(''));
			return true;
		}
	}
	html.push("<p>正しい期限が入力されていません</p>");
	error.append(html.join(''));
	return false;
}

// todoadd.html/?id=の名前を調べる
function getParameter() {
	var parameter = location.search;
	parameter = parameter.substring(4, parameter.length);
	parameter = decodeURIComponent(parameter);
	return parameter;
}

// 月や日が1桁の時に頭に0を付け足す
function toDoubleDigits(num) {
	num += "";
	if (num.length === 1) {
		num = "0" + num;
	}
 return num;
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
		if (forSortvalue.todoType == "todo"){
			// todoLimitには「yyyymmdd」が入っている
			forSortArray[sortListNum] = forSortvalue.todoDate;
			sortListNum++;
		}
	}
	forSortArray.sort(function(a, b) {
		return (a < b ? 1 : -1);
	});

	//時刻が一致しているのをLocalStorageから探して、順番に表示する
	// すでにある要素を削除する
	var list = $("#todoall")
	list.children().remove();
	var html = [];
	var todoNum = 0;
	for(i=0, arraylen=forSortArray.length; i<arraylen; i++) {
		for(var j=0; j<storagelen; j++) {
			key = localStorage.key(j);
			value = JSON.parse(localStorage.getItem(key));
			if(forSortArray[i] == value.todoDate){
				//alert(value.listName);
				var finish;
				if(value.finish == "N") {
					finish = "未完了";
				}else if(value.finish == "Y") {
					finish = "完了";
				}
			var todoDate = value.todoDate.slice(0, 4) + "年" + value.todoDate.slice(4, 6) + "月" + value.todoDate.slice(6, 8) + "日";
			html.push("<dl id=todoNum" + todoNum + "><h2>" + key + "</h2><dt>期限：　"+ value.todoLimit + "</dt><dt>作成日：" + todoDate + "</dt><dd><input class=\"finishButton\" id=\"" + todoNum + "\" type=\"button\" value=\""+ finish + "\"></dd></dl>");
			todoNum++;
			}
		}
	}
	list.append(html.join(''));
}


function cssButton() {
	for(var i=0; i<11; i++) {
		if($('#' + i)[0] && $('#' + i).val() == "完了"){
			$('#' + i).css({
			"width": "150px",
			"height": "50px",
			"font-size": "1.2em",
			"background-color": "#ff5600",
			"color": "#fff",
			"border-style": "none",
			"border-top": "3px solid #ddd",
			"border-left": "3px solid #ddd",
			"border-right": "3px solid #bbb",
			"border-bottom": "3px solid #bbb",
			"cursor": "pointer",
			"z-index": "1"
			});
		}else if($('#' + i)[0] && $('#' + i).val() == "未完了") {
			$('#' + i).css({
			"width": "150px",
			"height": "50px",
			"font-size": "1.2em",
			"background-color": "#2419b2",
			"color": "#fff",
			"border-style": "none",
			"border-top": "3px solid #ddd",
			"border-left": "3px solid #ddd",
			"border-right": "3px solid #bbb",
			"border-bottom": "3px solid #bbb",
			"cursor": "pointer",
			"z-index": "1"
			});

		}
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
		array['finish'] = "Y";
		$('#' + buttonNum).val("完了");
	}else if(value.finish == "Y") {
		array['finish'] = "N";
		$('#' + buttonNum).val("未完了");
	}
	localStorage.setItem(key, JSON.stringify(array));
}
