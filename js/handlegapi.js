var CLIENT_ID="1003542821097-ch60bub61oa3gq84p7gv3d90std7bq1j.apps.googleusercontent.com";
var SCOPES=[
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata'
];

var APPDATA_NAME = 'data.json';
var APPDATA_META;
var APPDATA;

function handleClientLoad() {
    checkAuth();
}

function checkAuth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope' : SCOPES.join(' '), 'immediate': false}, handleAuthResult
    );
}

function executeWithDrive(callback) {
    gapi.client.load('drive', 'v2', callback);
}

function handleAuthResult(authResult) {
    if (authResult) {
        initializeElements();
        // Access token has been successfully retrieved, requests can be sent to the API

        executeWithDrive(getFileList);
        //(query, checkAppDataFile);

        //listFilesInApplicationDataFolder(checkApplicationDataFile);           
        //createApplicationDataFile();
    } else {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult
        );
    }
}

function getAppMetaData(callback) {
    var request = gapi.client.drive.files.get({
        'fileId': 'appdata'
    });
    request.execute(function(resp) {
        APPDATA_META = resp;
        console.log("Get MetaData [" + resp.title + ":" + resp.id + "]");
        callback(resp.id);
    });
}

function getFileList() { 
    //var query = '\'appdata\' in parents and title = \'' + APPDATA_NAME + '\'';
    var query = 'title = \'aaa.aaa\'';    
    var listRequest = gapi.client.drive.files.list({
        'q': query        
    });

    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                checkAppDataFile(result);
            }
        });
    };    

    retrievePageOfFiles(listRequest, []);
}

function checkAppDataFile(result) {
    var isFind = false;
    var item;
    for(var index in result) {
        item = result[index];
        if(typeof (item) != 'undefined') {
            //if(item.title == APPDATA_NAME) {
            console.log('Data Exist');
            isFind = true;
            break;
            //}
        }
    }     

    if(isFind) {        
        getFileData(item, function (response) {
            APPDATA = JSON.parse(response);            
            showContent();
        });    
    } else {
        console.log('No AppData File exist');        
        var createAppData = function (id) {
            var metadata = {
                'title': APPDATA_NAME,
                'mimeType': 'application/json',
                'parents': [{
                    'id': id
                }]
            };

            var request = gapi.client.request({
                'path': '/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'body': JSON.stringify(metadata)
            });

            request.execute(function(file) {
                console.log('AppData Created');
                //console.log(file);
            });
        };
        getAppMetaData(createAppData);
    }
}

function getFileData(file, callback) {
    var url;
    if (file.downloadUrl) {
        url = file.downloadUrl;
    } else if (file.exportLinks){
        url = file['exportLinks']['text/plain'];
    }
    //TODO:temp
    url = 'https://docs.google.com/feeds/download/documents/export/Export?id=1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs&exportFormat=txt';
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
        callback(xhr.responseText);
    };
    xhr.onerror = function() {
    };
    xhr.send();
}

function writeData(fileId, data) {  
    //TODO: remove
    fileId = '1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs';

    var request = gapi.client.drive.files.get({'fileId': '1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs'});
    request.execute(function(resp) {
        updateFile('1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs', resp, data, null);
    });
}

function updateFile(fileId, fileMetadata, data,  callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";		

    var contentType = 'application/octet-stream';

    base64Data = Base64.encode(data);


    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charest=utf-8\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        //'Content-Type: ' + contentType + '; charest=utf-8\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});

    if (!callback) {
        callback = function(file) {
            console.log(file);
        };
    }
    request.execute(callback);
}