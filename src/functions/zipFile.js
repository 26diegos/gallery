import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';

function zipFile(arrayItems, isActive) {
  let zip = new JSZip();

  arrayItems.forEach((item, index) => {
    if (!isActive || item.selected) {
      zip.file('file' + index + '.jpg', urlToPromise(item.originalPhotoUrl), {
        binary: true
      });
    }
  });

  zip.generateAsync({ type: 'blob' }).then(function callback(blob) {
    saveAs(blob, 'example.zip');
  });
}

function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export default zipFile;
