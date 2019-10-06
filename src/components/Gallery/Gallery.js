import React, { useState, useEffect } from 'react';
import './Gallery.css';
import downloadImage from './images/group-2-copy-17@3x.png';
import cx from 'classnames';
import { ReactBnbGallery } from 'react-bnb-gallery';
import axios from 'axios';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'api-version': '1.0',
  'x-api-key': 'eRyFkruJWy3cgIpWRSBpL5wGLiG9EjmZ4YqdVvIk',
  'X-Incode-Hardware-Id':
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJXRUJfQVBQX0FETUlOI92iwicm9sZSI6IkFETUlOIiwiZXhwIjoxNTc3NjM5MDYxLCJpYXQiOjE1Njk4NTk0NjF9.DKD1S8MbhZ_dmbVOFCzWwfWz4ngJDvBJgL9h6n3Oe7I54'
};

function Images({ isActive, photos, onClick }) {
  return photos.map(item => (
    <div className="iconContainer" key={item.photoId}>
      <img
        src={item.resizedPhotoUrl}
        className={cx('gallery__img', { selected: item.selected })}
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
      <header className={cx('main-head', { active: isActive })}>
        <img
          src="https://cdn.zeplin.io/5d8a3013bcf7fd15ed04e867/assets/D0F010F0-C89A-47CD-B9B5-CBB410779868.svg"
          className="logo"
          alt=""
        />
        <nav role="menu">
          <ul>
            <li>
              {isActive ? (
                <div onClick={onClick}>Cancel</div>
              ) : (
                <div onClick={onClick}>Select photos</div>
              )}
            </li>
            <li>
              <DownloadButton
                arrayItems={selected}
                isActive={isActive}
              ></DownloadButton>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

function Gallery() {
  const [isActive, setActive] = useState(false);
  const [itemsToSelect, setSelected] = useState([]);
  const [galleryOpened, setGalleryOpened] = useState(false);
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
  }

  const cleanSelections = () => {
    itemsToSelect.map(item => (item.selected = false));
  };

  return (
    <div className="Gallery">
      <Header
        isActive={isActive}
        onClick={toggleActive}
        selected={itemsToSelect}
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

function DownloadButton({ arrayItems, isActive }) {
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

  const selectedItems = arrayItems.filter(item => item.selected);

  function multipleDownload() {
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

  return (
    <div
      className={cx('button', {
        btnDisabled: isActive && !selectedItems.length
      })}
      onClick={multipleDownload}
    >
      {isActive
        ? 'Download ' + selectedItems.length + ' images'
        : 'Download All'}
    </div>
  );
}

export default Gallery;
