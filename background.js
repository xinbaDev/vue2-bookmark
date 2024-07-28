BACKUP_ENDPOINT = "https://fincatalyst.cc/" + process.env.BOOKMARKID 
USER = "xinba"
PASSWD = process.env.PASSWD

var needBackup = false;

chrome.bookmarks.onChanged.addListener((i, record) => {
    needBackup = true;
});

chrome.bookmarks.onRemoved.addListener((i, record) => {
    needBackup = true;
});

chrome.bookmarks.onCreated.addListener((i, record) => {
    needBackup = true;
});

setInterval(uploadBookmarks, 1000);

function uploadBookmarks() {
    if (needBackup) {
        chrome.bookmarks.getTree((booklist) => {
            bookmark_html = htmlForNode(booklist[0]);
            upload(bookmark_html);
        });
        needBackup = false;
    }
}

function encodeBasicAuth(username, password) {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    return `Basic ${encodedCredentials}`;
}
  
function upload(form) {
    const formData = new FormData();
    formData.append("c", form);

    fetch(BACKUP_ENDPOINT, {
        method: 'POST',
        headers: new Headers({ 'Authorization': encodeBasicAuth(USER, PASSWD) }),
        body: formData
    }).then((response) => response.json()).then((data) => {
        console.log('uploaded:', data);
    }).catch((error) => {
        console.error('Error uploading:', error);
    });
}

function htmlForNode(node) {
    if ('url' in node) {
        return htmlForUrlNode(node);
    } else if ('children' in node) {
        return htmlForParentNode(node);
    } else {
        return '';
    }
}

// {
//     "dateAdded": 1663329827000,
//     "id": "7",
//     "index": 1,
//     "parentId": "5",
//     "title": "Bounties - Layer3",
//     "url": "https://beta.layer3.xyz/bounties"
// }
function htmlForUrlNode(node) {
    if (!node['url'].startsWith("javascript:")) {
        return '<DT><A HREF="' + sanitize(node['url']) + '"' +  ' ADD_DATE="' + node['dateAdded']/1000 +'">' + sanitize(node['title']) + '</A>\n';
        //return '<DT><a href="' + sanitize(node['url']) + '">' + sanitize(node['title']) + '</a>\n';
    } else {
        return '';
    }
}

function htmlForParentNode(node) {
    return '<DT><H3>' + sanitize(node['title']) + '</H3>\n<DL><p>\n' +
        node['children'].map(htmlForNode).join('') +
        '</DL><p>\n';
}

function sanitize(input) {
    if (input) {
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
    } else {
        return "bookmarks";
    }
}


// async function fetchFaviconAsBase64(url) {
//     const faviconUrl = 'chrome://favicon/' + url;
//     const response = await fetch(faviconUrl);
//     const blob = await response.blob();

//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             const base64data = reader.result;
//             resolve(base64data);
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//     });
// }