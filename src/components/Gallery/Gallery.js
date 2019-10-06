import React, { useState, useEffect } from 'react';
import './Gallery.css';
import downloadImage from './images/group-2-copy-17@3x.png';
import cx from 'classnames';
import { ReactBnbGallery } from 'react-bnb-gallery';
const axios = require('axios').default;
var JSZip = require('jszip');
var JSZipUtils = require('jszip-utils');
var saveAs = require('file-saver');

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'api-version': '1.0',
  'x-api-key': 'eRyFkruJWy3cgIpWRSBpL5wGLiG9EjmZ4YqdVvIk',
  'X-Incode-Hardware-Id':
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJXRUJfQVBQX0FETUlOI92iwicm9sZSI6IkFETUlOIiwiZXhwIjoxNTc3NjM5MDYxLCJpYXQiOjE1Njk4NTk0NjF9.DKD1S8MbhZ_dmbVOFCzWwfWz4ngJDvBJgL9h6n3Oe7I54'
};

function Images({ isActive, photos, onClick }) {
  return photos.map(item => (
    <div className="iconContainer">
      <img
        src={item.resizedPhotoUrl}
        className={cx('gallery__img', { selected: item.selected })}
        key={item.photoId}
        onClick={() => {
          onClick(item.index);
        }}
        alt=""
      />
      <div className={isActive ? 'downloadImage' : null}>
        <a href={item.originalPhotoUrl} download>
          <img src={downloadImage} className="downloadIcon" alt="" />
        </a>
      </div>
    </div>
  ));
}

function Header({ isActive, onClick, selected }) {
  return (
    <div>
      <header
        className={cx('main-head', { active: isActive })}
        onClick={onClick}
      >
        {isActive ? 'Cancel' : 'Select photos'}
      </header>
      <DownloadButton arrayItems={selected}></DownloadButton>
    </div>
  );
}

function Gallery() {
  const [isActive, setActive] = useState(false);
  const [itemsToSelect, setSelected] = useState([]);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    axios
      .get(
        'https://photoshare-stage-api.incodesmile.com/photoshare/photos/get?uuid=cb46f769-e3ec-423b-bc94-f2ab251c1fba',
        { headers }
      )
      .then(response => {
        response.data.photos.forEach((element, index) => {
          element.index = index;
          element.selected = false;
          element.photo = element.resizedPhotoUrl;
        });
        setSelected(response.data.photos);
      });
  }, []);

  const toggleGallery = phIndex => {
    if (!galleryOpened) setPhotoIndex(phIndex);
    setGalleryOpened(!galleryOpened);
  };

  const toggleActive = () => {
    setActive(!isActive);
    if (isActive) cleanSelections();
  };

  function handleSelect(i) {
    const test = itemsToSelect;
    test[i].selected = !test[i].selected;
    setSelected([...test]);

    if (test[i].selected) setSelectedItems([...selectedItems, test[i]]);
    else
      setSelectedItems(
        selectedItems.filter(item => test[i].selected !== item.selected)
      );
  }

  const cleanSelections = () => {
    itemsToSelect.map(item => (item.selected = false));
    setSelectedItems([]);
  };

  return (
    <div className="Gallery">
      <div className="wrapper">
        <Header
          isActive={isActive}
          onClick={toggleActive}
          selected={selectedItems}
        />
        <div className="galleryDiego">
          <Images
            photos={itemsToSelect}
            onClick={isActive ? handleSelect : toggleGallery}
            isActive={isActive}
          />
        </div>
        <Slideshow
          galleryOpened={galleryOpened}
          onClick={toggleGallery}
          photos={itemsToSelect}
          index={photoIndex}
        ></Slideshow>
      </div>
    </div>
  );
}

function Slideshow({ galleryOpened, onClick, photos, index }) {
  return (
    <ReactBnbGallery
      show={galleryOpened}
      photos={photos}
      onClose={onClick}
      activePhotoIndex={index}
    />
  );
}

function DownloadButton({ arrayItems }) {
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

  function multipleDownload() {
    let zip = new JSZip();

    arrayItems.forEach((item, index) => {
      if (item.selected) {
        zip.file('file' + index + '.jpg', urlToPromise(item.originalPhotoUrl), {
          binary: true
        });
      }
    });

    zip.generateAsync({ type: 'blob' }).then(function callback(blob) {
      saveAs(blob, 'example.zip');
    });
  }

  return (
    <p onClick={multipleDownload}>
      {'Download ' + arrayItems.length + ' images'}
    </p>
  );
}

export default Gallery;
