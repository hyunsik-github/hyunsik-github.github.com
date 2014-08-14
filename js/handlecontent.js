var selectedMenu;

var WHEN, WHERE, WHAT, WHOG, WHOM;
var ELS = [WHEN, WHERE, WHAT, WHOG, WHOM];


function initializeElements() {
    WHEN = {
        key : "when",
        label : LABEL_WHEN, 
        helpmsg : "",
        func : function () {
            var dWhen = document.getElementById('div_when');
            dWhen.innerHTML = "<label>" + WHEN.label + " : <input type='date' id='date' /></label>";      
            document.getElementById('date').valueAsDate = new Date();  
            WHERE.func();
        },
        macxcnt : 1
    };

    WHERE = {
        key : "where",
        label : LABEL_WHERE, 
        helpmsg : MSG_SELECT_WHERE,
        func : function (value) {			

            var dWhere = document.getElementById('div_where');		

            dWhere.innerHTML = "<input type='button' value='+' onclick='addText(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>"; 
            dWhere.innerHTML += "<label>" + WHERE.label + " : </label>";

            var restaurants = APPDATA[WHERE.key];
            if(restaurants == 'undefined' || restaurants == null) {
                addText(WHERE.key, WHERE.maxcnt);
            } else {			
                for(var index in restaurants) {
                    dWhere.innerHTML += "<input type='button' name='button_where' value='" + restaurants[index] + "' onclick='showMenu(this.value)'>"; 
                }
            }

            document.getElementById('div_help_label').innerHTML = WHERE.helpmsg;
        },
        maxcnt : 1
    };

    WHAT = {
        key : "what",
        label : LABEL_WHAT,
        helpmsg : MSG_SELECT_WHAT,
        func: function (selection) {            
            selectedMenu = selection;

            var dWhat = document.getElementById('div_what');		
            dWhat.innerHTML = "<input type='button' value='+' onclick='addText(\"" + WHAT.key + "\", " + WHAT.maxcnt + ")'>"; 
            dWhat.innerHTML += "<label>" + WHAT.label + " : </label>";

            var menus = APPDATA[selection];
            if(menus == 'undefined' || menus == null) {
                addText(WHAT.key, WHAT.maxcnt);
            } else {			
                for(var key in menus) {
                    dWhat.innerHTML += "<input type='button' name='button_what' value='" + key + " (" + menus[key] + "원)' onclick='setMenu(\"" + key + "\")'>"; 
                }
            }

            document.getElementById('div_help_label').innerHTML = WHAT.helpmsg;
        },
        maxcnt : 20
    };

    WHOG = {
        key : "whog"
    };

    WHOM = {
        key : "whom"
    };
}

function showContent() {    
    WHEN.func();    
}

function showMenu(restaurant) {
    WHAT.func(restaurant);
}

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
function addText(key, max) {
    var doc = document.getElementById("div_" + key);

    var name = "text_" + key;

    //var button_cnt = document.getElementsByName("button_" + key).length;
    var text_cnt = document.getElementsByName(name).length;

    var newText = "<input type='text' name='" + name + "' id='" + name + (text_cnt + 1) + "' onkeypress='converButton(event, this, \"" + key + "\")'>";

    if(text_cnt < max) {
        doc.innerHTML += newText;
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

function converButton(event, element, key) {    
    if(event.keyCode == 13) {
        var values = APPDATA[key];
        var value = element.value;
        var doc = element.parentElement;
        var isUnique = true;

        if(typeof(values) != 'undefined' && values != null) {
            for(var index in values) {
                if(values[index] == value) {
                    isUnique = false;
                    document.getElementById('div_help_label').innerHTML = "중복 데이터가 있습니다.";
                    break;
                }
            }
        }
        if(isUnique) {
            doc.innerHTML += "<input type='button' name='button_" + key + "' value='" + value + "' onclick='showMenu(this.value)'>"; 
            var child = document.getElementById(element.id);
            doc.removeChild(child);
            document.getElementById('div_help_label').innerHTML = "";
        }
    }
}