	var RESTAURANT="Restaurant";
	var GROUP="Group";
	var MEMBER="Member";
	var MENU="Menu";
	
	var restaurants;
	var menus;
	var groups;
	var members;	
		
	var selectedMenu;
	
	var data;
	var flag = {
		"where" : "",
		"what" : "",
		"who" : "",
		"member" : ""
	};
		
	function showContent() {
		data = {};
		var when = document.getElementById('when');
		when.innerHTML = "<label onclick='addData(this)'>" + LABEL_WHEN + ": <input type='date' id='date' /></label>";      
		document.getElementById('date').valueAsDate = new Date();
      
		var where = document.getElementById('where');
		where.innerHTML += "<label onclick='addData(this)'>" + LABEL_WHERE + ": </label>"; 
		
		var what = document.getElementById('what');
		var who = document.getElementById('who');
		
		showRestaurant();
	}
    
    function showRestaurant() {
		var where = document.getElementById('where');   
		for(var index in restaurants) {
			where.innerHTML += "<input type='button' value='" + restaurants[index] + "' id='" + restaurants[index] + "' onclick='showMenu(this.value)'>"; 
		}
		document.getElementById('helpLabel').innerHTML = MSG_SELECT_WHERE;
    }
    
    function showMenu(restaurant) {
		setToggle(restaurant);
		var what = document.getElementById('what');
		menus = APPDATA[restaurant];
		what.innerHTML = "<label onclick='addData(this)'>" + LABEL_WHAT + ": </label>";
		for(var key in menus) {
			what.innerHTML += "<input type='button' value='" + key + " (" + menus[key] + "원)' id='" + restaurant + "_" + key + "' onclick='setMenu(\"" + key + "\")'>"; 
		}
		document.getElementById('helpLabel').innerHTML = MSG_SELECT_WHAT;
	}
	
	function setToggle(restaurant) {
		if(data[RESTAURANT] == restaurant) {
			console.log(restaurant + " is OFF");
			data[RESTAURANT] = null;
			for(var index in restaurants) {
				document.getElementById(restaurants[index]).readOnly = false;
			}
		}
		else {
			data[RESTAURANT] = restaurant;
			for(var index in restaurants) {
				if(restaurants[index] != restaurant) {
					document.getElementById(restaurants[index]).readOnly = true;
				} else {
					console.log(restaurant + " is ON");
				}
			}
		}
	}
  
	function setMenu(menu) {
		selectedMenu = menu;
		if(!(data.hasOwnProperty(menu))){
			data[menu]=new Array();
		}
		showGroup();    
	}

    function showGroup() {
		var who = document.getElementById('who'); 
		who.innerHTML = "<label onclick='addData(this)'>" + LABEL_WHO_GROUP + ":</label>";
		who.innerHTML += "<input type='button' value='All' id='all' onclick='showMember(this.value)'>";   
		for(var index in groups) {
			who.innerHTML += "<input type='button' value='" + groups[index] + "' id='" + groups[index] + "' onclick='showMember(this.value)'>"; 
        document.getElementById('helpLabel').innerHTML = MSG_SELECT_WHO_GROUP;
		}
    }
    
    function showMember(group) {
		var member = document.getElementById('member');   
		member.innerHTML = "<label onclick='addData(this)'>" + LABEL_WHO_MEMBER + ":</label>";
		var memberArray;
		if("All" == group) {
			memberArray = members;
		} else {
			memberArray = APPDATA[group];
		}
    
		for(var index in memberArray) {
			member.innerHTML += "<input type='button' value='" + memberArray[index] + "' id='" + memberArray[index] + "' onclick='addMemberData(this.value)'>"; 
		}
		document.getElementById('helpLabel').innerHTML = MSG_SELECT_WHO_MEMBER;
    }
	
	function addMemberData(member) {
		var memberArr = data[selectedMenu];
		var isFind = false;
		for(var i in memberArr) {
			if(memberArr[i] == member) {
				isFind = true;
				break;
			}
		}
		if(!isFind) {
			memberArr.push(member);
		}
		showResult();
	}
	
	function removeMemberData(member) {
		var memberArr = data[selectedMenu];
		var isFind = false;
		var index;
		for(var i in memberArr) {
			if(memberArr[i] == member) {
				isFind = true;
				index = i;
				break;
			}
		}
		if(isFind) {
			memberArr.splice(index, 1);
		}
	}

	function addData(element) {
        var doc = element.parentElement;
        if(flag[doc.id] == "+") {
			flag[doc.id] = "-";  
			var child = document.getElementById('input'+doc.id);
			doc.removeChild(child);
			child = document.getElementById('confirm'+doc.id);
			doc.removeChild(child);
        } else {
         	flag[doc.id] = "+";  
			doc.innerHTML += "<input type='text' id='input" + doc.id + "'>";
    	    doc.innerHTML += "<input type='button' id='confirm'" + doc.id + "' value='확인'>";
        }
	}
	
	function showResult() {
		var result = document.getElementById('result');   
		result.innerHTML = "";
		for(var key in menus) {		
			if(data.hasOwnProperty(key)){
				result.innerHTML += "<br>";
				result.innerHTML += data[RESTAURANT] + " : ";
				result.innerHTML += "[" + key + " : " + menus[key] + "원] - ";		
				
				var memberArr = data[key];
				
				for(var i in memberArr) {
					result.innerHTML += " " + memberArr[i];
				}
				result.innerHTML += "</br>";
			}
		}
	}