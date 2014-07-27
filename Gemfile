require 'google/api_client'

client=Google::APIClient.new
client.authorization.client_id='1003542821097-fukvqij1ambubq45343r8cqpskcovn4g.apps.googleusercontent.com'
client.authorization.client_secret='Oki3iPuzCH6MMdO0AuL9vtE9'
client.authorization.redirect_uri='http://hyunsik-github.github.io/'

client.authorization.scope=['https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.appdata']
client.code = params[:code] if params[:code]
client.fetch_access_token!

drive = client.discoverd_api('drive', 'v2')

file = Google::APIClient::UploadIO.new('images/7.jpg')

metadata = {
	title: 'test',
	description: 'test jpg',
	mimeType: 'image/jpeg'
}

result = client.execute(
	api_method: drive.files.insert,
	body_object: metadata,
	media: file,
	parameters:{
		'uploadType' => 'multipart'
	}
)