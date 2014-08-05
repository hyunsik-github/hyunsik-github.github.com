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
			// Access token has been successfully retrieved, requests can be sent to the API
			executeWithDrive(getAppData);
			//listFilesInApplicationDataFolder(checkApplicationDataFile);           
			//createApplicationDataFile();
		} else {
			// No access token could be retrieved, force the authorization flow.
			gapi.auth.authorize(
				{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult
			);
		}
    }
	
	function getAppData() {
		var request = gapi.client.drive.files.get({
			'fileId': 'appdata'
		});
		request.execute(function(resp) {
			APPDATA_META = resp;
			console.log(resp.title + ':' + APPDATA_META.id);
			getDataFromAppData();
		});
    }
	
	function getDataFromAppData() {     
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
					checkData(result);
				}
			});
		}
		//var query = '\'appdata\' in parents and title = \'' + APPDATA_NAME + '\'';
		var query = 'title = \'aaa.aaa\'';
		var listRequest = gapi.client.drive.files.list({
			'q': query        
		});
		retrievePageOfFiles(listRequest, []);
    }
	
	function checkData(result) {
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
        getFileContent(item, function (response) {
			APPDATA = JSON.parse(response);
			for(var key in APPDATA) {   
				if(GROUP == key) {
					groups = APPDATA[key];
				} else if(MEMBER == key) {
					members = APPDATA[key];
				} else if(RESTAURANT == key) {
					restaurants = APPDATA[key];
				}
				//console.log(key + ":" + APPDATA[key]);
			}
			showContent();
		});    
	} else {
        console.log('No Data File');
        var createData = function () {
			var metadata = {
				'title': 'data.json',
				'mimeType': 'application/json',
				'parents': [{
				'id': APPDATA_META.id
				}]
			};

			var request = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'POST',
				'params': {'uploadType': 'multipart'},
				'body': JSON.stringify(metadata)
			});
          
			request.execute(function(file) {
				console.log('Data Created');
				console.log(file);
			});
        }
        createData();
      }
    }
	
	function getFileContent(file, callback) {
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
		var content = new Array(data.length);
		for (var i = 0; i < content.length; i++) {
			content[i] = data.charCodeAt(i);
			console.log(ca[i]);
		}

		var byteArray = new Uint8Array(content);
		var blob = new Blob([byteArray], {type: 'text/plain'});
		var request = gapi.client.drive.files.get({'fileId': '1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs'});
		request.execute(function(resp) {
			updateFile('1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs', resp, blob, null);
		});
    }
	
	function updateFile(fileId, fileMetadata, blob,  callback) {
		const boundary = '-------314159265358979323846';
		const delimiter = "\r\n--" + boundary + "\r\n";
		const close_delim = "\r\n--" + boundary + "--";

		var reader = new FileReader();
		reader.readAsBinaryString(fileData);
		reader.onload = function(e) {
			var contentType = fileData.type || 'application/octet-stream';
			// Updating the metadata is optional and you can instead use the value from drive.files.get.
			var base64Data = btoa(reader.result);
			var multipartRequestBody =
				delimiter +
				'Content-Type: application/json\r\n\r\n' +
				JSON.stringify(fileMetadata) +
				delimiter +
				'Content-Type: ' + contentType + '\r\n' +
				'Content-Transfer-Encoding: base64\r\n' +
				'\r\n' +
				base64Data +
				close_delim;

			var request = gapi.client.request({
				'path': '/upload/drive/v2/files/' + id,
				'method': 'PUT',
				'params': {'uploadType': 'multipart', 'alt': 'json'},
				'headers': {
					'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
				},
				'body': multipartRequestBody});
			if (!callback) {
				callback = function(file) {
					console.log(file)
				};
			}
			request.execute(callback);
		}
    }