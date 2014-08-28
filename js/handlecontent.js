var selectedMenu;

var WHEN, WHERE, WHAT, WHOG, WHOM;
var ELS = [WHEN, WHERE, WHAT, WHOG, WHOM];
var data = {};


function initializeElements() {
    data = {};
    WHEN = {
        key : "when",
        label : LABEL_WHEN, 
        helpmsg : "",
        func : function () {
            var dWhen = document.getElementById('div_when');
            dWhen.innerHTML = "<label>" + WHEN.label + " : <input type='date' id='date' /></label>";      
            var date = new Date();
            document.getElementById('date').valueAsDate = date;
            data[WHEN.key] = date.toLocaleDateString();
            WHERE.func();
        },
        maxcnt : 1
    };

    WHERE = {
        key : "where",
        label : LABEL_WHERE, 
        helpmsg : MSG_SELECT_WHERE,
        func : function (value) {			

            var dWhere = document.getElementById('div_where');		

            //dWhere.innerHTML = "<input type='button' value='+' onclick='addText(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>"; 
            dWhere.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>"; 
            dWhere.innerHTML += "<label>" + WHERE.label + " : </label>";

            var restaurants = APPDATA[WHERE.key];
            if(restaurants == 'undefined' || restaurants == null) {
                //addText(WHERE.key, WHERE.maxcnt);
            } else {			
                for(var index in restaurants) {
                    dWhere.innerHTML += "<input type='button' name='button_where' value='" + restaurants[index] + "' onclick='setRestaurant(this.value)'>"; 
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
        func : function (selection) {
            selectedMenu = selection;

            var dWhat = document.getElementById('div_what');		
            dWhat.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHAT.key + "\", " + WHAT.maxcnt + ", \"" + selection + "\")'>"; 
            dWhat.innerHTML += "<label>" + WHAT.label + " : </label>";

            var menu = APPDATA[selection];
            if(typeof (menu) == 'undefined' || menu == null) {
                APPDATA[selection] = [];
                //addText(WHAT.key, WHAT.maxcnt, selection);
            } else {			
                for(var key in menu) {
                    dWhat.innerHTML += "<input type='button' name='button_what' value='" + key + " (" + menu[key] + "원)' onclick='setMenu(\"" + key + "\", " + menu[key] + ")'>"; 
                }
            }

            document.getElementById('div_help_label').innerHTML = WHAT.helpmsg;
        },
        maxcnt : 20
    };

    WHOG = {
        key : "whog",
        label : LABEL_WHO_GROUP,
        helpmsg : MSG_SELECT_WHO_GROUP,
        func : function () {
            var dGroup = document.getElementById('div_whog'); 
            dGroup.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHOG.key + "\", " + WHOG.maxcnt + ")'>";
            dGroup.innerHTML += "<label>" + WHOG.label + " : </label>";
            dGroup.innerHTML += "<input type='button' value='All' id='all' onclick='setGroup(this.value)'>";   
            var group = APPDATA[WHOG.key];
            if(typeof (group) == 'undefined' || group == null) {

            } else {
                for(var index in group) {
                    dGroup.innerHTML += "<input type='button' value='" + group[index] + "' id='" + group[index] + "' onclick='setGroup(this.value)'>"; 

                }
                document.getElementById('div_help_label').innerHTML = WHOG.helpmsg;
            }
        },
        maxcnt : 20
    };

    WHOM = {
        key : "whom",
        label : LABEL_WHO_MEMBER,
        helpmsg : MSG_SELECT_WHO_MEMBER,
        func : function (selection) {
            var dMember = document.getElementById('div_whom');
            dMember.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHOM.key + "\", " + WHOM.maxcnt + ", \"" + selection + "\")'>";
            dMember.innerHTML += "<label>" + LABEL_WHO_MEMBER + ":</label>";
            var member;
            if(selection == 'All') {
                member = APPDATA[WHOM.key];
            } else {
                member = APPDATA[selection];
            }

            if(typeof (member) == 'undefined' || member == null) {

            } else {
                for(var index in member) {
                    dMember.innerHTML += "<input type='button' value='" + member[index] + "' id='" + member[index] + "' onclick='setMember(this.value)'>"; 
                }
                document.getElementById('div_help_label').innerHTML = WHOM.helpmsg;
            }
        },
        maxcnt : 20
    };
}

function showContent() {    
    WHEN.func();    
}

function setRestaurant(selection) {
    data[WHERE.key] = selection;
    WHAT.func(selection);
}

function setMenu(selection, price) {
    selectedMenu = selection;
    var menu = data[WHAT.key];
    if(typeof (menu) == 'undefined' || menu == null) {
        data[WHAT.key] = {};
    }
    data[WHAT.key][selectedMenu] = price;
    /*if(!(data.hasOwnProperty(selection))){
        data[selection] = [];
    }*/
    WHOG.func();
    //showGroup();    
}

function setGroup(selection) {
    WHOM.func(selection);
}

function setMember(selection) {
    var member = data[selectedMenu];
    if(typeof (member) == 'undefined' || member == null) {
        data[selectedMenu] = [];
    }
    var isFind = false;
    for(var i in member) {
        if(member[i] == selection) {
            isFind = true;
            //TODO: change color
            break;
        }
    }
    if(isFind) {
        data[selectedMenu].pop(selection);
    } else {
        data[selectedMenu].push(selection);
    }
    showResult();
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
    for(var key in data[WHAT.key]) {		
        if(data.hasOwnProperty(key)){
            result.innerHTML += "<br>";
            result.innerHTML += data[WHERE.key] + " : ";

            result.innerHTML += "[" + key + " : " + data[WHAT.key][key] + "원] - ";		

            var memberArr = data[key];

            for(var i in memberArr) {
                result.innerHTML += " " + memberArr[i];
            }
            result.innerHTML += " 합계 : " + data[WHAT.key][key] * memberArr.length + "원";
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
            APPDATA[key].push(value);
            document.getElementById('div_help_label').innerHTML = "";
        }
    }
}

function showC() {
    console.log(APPDATA);
}

function openAddDialog() {
}