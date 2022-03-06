const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), getSpamMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
            console.log('Labels:');
            labels.forEach((label) => {
                console.log(`- ${label.name} ${label.id}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

function getSpamMessages(auth){
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.get({
        // Include messages from `SPAM` and `TRASH` in the results.
        includeSpamTrash: true,
        id: '17f557acf733cacc',
        // // Only return messages with labels that match all of the specified label IDs.
        // labelIds: 'placeholder-value',
        // // Maximum number of messages to return. This field defaults to 100. The maximum allowed value for this field is 500.
        // maxResults: 'placeholder-value',
        // // Page token to retrieve a specific page of results in the list.
        // pageToken: 'placeholder-value',
        // // Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, `"from:someuser@example.com rfc822msgid: is:unread"`. Parameter cannot be used when accessing the api using the gmail.metadata scope.
        // q: 'placeholder-value',
        // // The user's email address. The special value `me` can be used to indicate the authenticated user.
        userId: 'me',
      }).then(res => console.log(res.data));

      
      gmail.users.messages.list({
        // Include messages from `SPAM` and `TRASH` in the results.
        includeSpamTrash: true,
        // // Only return messages with labels that match all of the specified label IDs.
        // labelIds: ['Label_8359862494561270237', 'Label_4253887505643144354', 'INBOX'],
        // // Maximum number of messages to return. This field defaults to 100. The maximum allowed value for this field is 500.
        // maxResults: 'placeholder-value',
        // // Page token to retrieve a specific page of results in the list.
        // pageToken: 'placeholder-value',
        // // Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, `"from:someuser@example.com rfc822msgid: is:unread"`. Parameter cannot be used when accessing the api using the gmail.metadata scope.
        q: 'label:dmcc-signup-code',
        // // The user's email address. The special value `me` can be used to indicate the authenticated user.
        userId: 'me',
      }).then(res => console.log(res.data.messages[0]));
}

// PS D:\DEV\PS\DMCC\playwright> node index.js
// { id: '17f556d755ab7c4f', threadId: '17f53f930d225e68' }
// PS D:\DEV\PS\DMCC\playwright> node index.js
// { id: '17f557acf733cacc', threadId: '17f53f930d225e68' }

// var google = require('googleapis');
// var gmail = google.gmail('v1');
// var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
// oauth2Client.credentials = JSON.parse(token);
// google.options({ auth: oauth2Client }); // set auth as a global default

// gmail.users.messages.modify({
//         'userId':'me',
//         'id':emailId,
//         'resource': {
//             'addLabelIds':[],
//             'removeLabelIds': ['UNREAD']
//         }
//     }, function(err) {
//         if (err) {
//             error('Failed to mark email as read! Error: '+err);
//             return;
//         }
//         log('Successfully marked email as read', emailId);
//     });