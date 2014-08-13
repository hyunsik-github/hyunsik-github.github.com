var WHAT="what";
var WHOG="whog";
var WHOM="whom";

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

var WHEN= {
    key : "when",
    label : LABEL_WHEN, 
    callback : function () {
        var dWhen = document.getElementById('div_when');
        dWhen.innerHTML = "<label onclick='showDataInput(this)'>" + WHEN.label + ": <input type='date' id='date' /></label>";      
        document.getElementById('date').valueAsDate = new Date();  
        WHERE.callback();
    }
};

var WHERE = {
    key : "where",
    label : LABEL_WHEN, 
    callback : function (value) {			

        var dWhat = document.getElementById('div_what');		
        dWhat.innerHTML = "<label onclick='makeNewText(this.parentElement)'>" + LABEL_WHAT + ": </label>";

        menus = APPDATA[value];
        if(menus == 'undefined' || menus == null) {
            makeNewText(dWhat);
        } else {			
            for(var key in menus) {
                dWhat.innerHTML += "<input type='button' name='div_what_button' value='" + key + " (" + menus[key] + "원)' onclick='setMenu(\"" + key + "\")'>"; 
            }
        }

        document.getElementById('div_help_label').innerHTML = MSG_SELECT_WHAT;
    }
};

function showContent(callback) {
    data = {};
	callback();
//    var dWhen = document.getElementById('div_when');
//    
//    dWhen.innerHTML = "<label onclick='showDataInput(this)'>" + LABEL_WHEN + ": <input type='date' id='date' /></label>";      
//    document.getElementById('date').valueAsDate = new Date();

//    showRestaurant();
}

function showRestaurant() {
    var dWhere = document.getElementById('div_where');
    dWhere.className = WHERE.key;
    dWhere.innerHTML += "<label onclick='makeNewText(this.parentElement)'>" + LABEL_WHERE + ": </label>"; 

    if(restaurants == 'undefined' || restaurants == null) {
        makeNewText(dWhere);
    } else {
        for(var index in restaurants) {
            dWhere.innerHTML += "<input type='button' name='div_where_button' value='" + restaurants[index] + "' onclick='showMenu(this.value)'>"; 
        }			
    }		
    document.getElementById('div_help_label').innerHTML = MSG_SELECT_WHERE;
}

function showMenu(restaurant) {
    //setToggle(restaurant);

    var dWhat = document.getElementById('div_what');		
    dWhat.innerHTML = "<label onclick='makeNewText(this.parentElement)'>" + LABEL_WHAT + ": </label>";

    menus = APPDATA[restaurant];
    if(menus == 'undefined' || menus == null) {
        makeNewText(dWhat);
    } else {			
        for(var key in menus) {
            dWhat.innerHTML += "<input type='button' name='div_what_button' value='" + key + " (" + menus[key] + "원)' onclick='setMenu(\"" + key + "\")'>"; 
        }
    }

    document.getElementById('div_help_label').innerHTML = MSG_SELECT_WHAT;
}

/*function setToggle(restaurant) {
		if(data[WHERE[key]] == restaurant) {
			console.log(restaurant + " is OFF");
			data[WHERE[key]] = null;
			for(var index in restaurants) {
				document.getElementById(restaurants[index]).readOnly = false;
			}
		}
		else {
			data[WHERE[key]] = restaurant;
			for(var index in restaurants) {
				if(restaurant[index] != restaurant) {
					document.getElementById(restaurants[index]).readOnly = true;
				} else {
					console.log(restaurant + " is ON");
				}
			}
		}
	}*/

function setMenu(menu) {
    selectedMenu = menu;
    if(!(data.hasOwnProperty(menu))){
        data[menu] = [];
    }
    showGroup();    
}

function showGroup() {
    var dGroup = document.getElementById('div_whog'); 
    dGroup.innerHTML = "<label onclick='showDataInput(this, showMember)'>" + LABEL_WHO_GROUP + ":</label>";
    dGroup.innerHTML += "<input type='button' value='All' id='all' onclick='showMember(this.value)'>";   
    for(var index in groups) {
        dGroup.innerHTML += "<input type='button' value='" + groups[index] + "' id='" + groups[index] + "' onclick='showMember(this.value)'>"; 
        document.getElementById('div_help_label').innerHTML = MSG_SELECT_WHO_GROUP;
    }
}

function showMember(group) {
    var dMember = document.getElementById('div_whom');   
    dMember.innerHTML = "<label onclick='showDataInput(this)'>" + LABEL_WHO_MEMBER + ":</label>";
    var memberArray;
    if("All" == group) {
        memberArray = members;
    } else {
        memberArray = APPDATA[group];
    }

    for(var index in memberArray) {
        dMember.innerHTML += "<input type='button' value='" + memberArray[index] + "' id='" + memberArray[index] + "' onclick='addMemberData(this.value)'>"; 
    }
    document.getElementById('div_help_label').innerHTML = MSG_SELECT_WHO_MEMBER;
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
function makeNewText(doc) {
    var name = doc.id + "_text";
    var button_cnt = document.getElementsByName(doc.id + "_button").length;
    var text_cnt = document.getElementsByName(name).length;
    var newText = "<input type='text' name='" + name + "' id='" + name + (text_cnt + 1) + "' onkeypress='keychecker(event, this)'>";

    if(button_cnt == 0 && text_cnt == 0) {
        doc.innerHTML += newText;
    } else {			
        if(flag[doc.id] == "+") {
            flag[doc.id] = "-";  
            var child = document.getElementById(name + (text_cnt));
            doc.removeChild(child);				
        } else {
            flag[doc.id] = "+";  
            doc.innerHTML += newText;
        }
    }
}

function showDataInput(element) {
    var doc = element.parentElement;
    if(flag[doc.id] == "+") {
        flag[doc.id] = "-";  
        var child = document.getElementById('input_'+doc.id);
        doc.removeChild(child);
        child = document.getElementById('confirm_'+doc.id);
        doc.removeChild(child);
    } else {
        flag[doc.id] = "+";  
        doc.innerHTML += "<input type='text' id='input_" + doc.id + "' onkeypress='keychecker(event)'>";
        //doc.innerHTML += "<input type='button' id='confirm_" + doc.id + "' value='확인' onclick='addData(this.parentElement)'>";
    }
}

function addData(doc) {
    var key = doc.className;
    var d = document.getElementById('input_'+doc.id);
    var value = document.getElementById('input_'+doc.id).value;
    APPDATA[key].push(value);
    //save(APPDATA);
    callback(value);
}

function showResult() {
    var result = document.getElementById('result');   
    result.innerHTML = "<input type='button' value='save' onclick='save()'>";
    for(var key in menus) {		
        if(data.hasOwnProperty(key)){
            result.innerHTML += "<br>";
            result.innerHTML += data[WHERE[key]] + " : ";
            result.innerHTML += "[" + key + " : " + menus[key] + "원] - ";		

            var memberArr = data[key];

            for(var i in memberArr) {
                result.innerHTML += " " + memberArr[i];
            }
            result.innerHTML += "</br>";
        }
    }
}

function save(data) {
    var str = JSON.stringify(data);
    console.log(str);
    writeData(null, str);
    //writeData(null, data);
}

function keychecker(event, element) {
    var doc = element.parentElement;		
    if(event.keyCode == 13) {
        console.log(element.value);		
    }
}