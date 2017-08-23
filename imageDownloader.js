const fs = require('fs');
const request = require('request');

const downloadAllImage = async () => {
    let queue = [];
    for (var i = 1; i <= 100; i++) {
        const imageId = ('0000' + i).slice(-4);
        queue.push(download(`https://data.2017.gov.taipei/001/HamaTestUpload/upload/${imageId}.jpg`, `images/${imageId}.jpg`));
    }
    await Promise.all(queue);
}

const download = async function (uri, filename, callback) {
    new Promise((resolve) => {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            if (res.headers['content-type'] === 'text/html') {
                return resolve();
            }
            request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
    })
};

downloadAllImage();