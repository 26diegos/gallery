import React, { useState, useEffect } from 'react';
import './Gallery.css';
import downloadImage from './images/group-2-copy-17@3x.png';
import cx from 'classnames';
import { ReactBnbGallery } from 'react-bnb-gallery';
import getImages from '../../functions/getImages';
import zipFile from '../../functions/zipFile';

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

function Gallery({ match }) {
  const [isActive, setActive] = useState(false);
  const [itemsToSelect, setSelected] = useState([]);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    getImages(match.params.uuid).then(photos => {
      setSelected(photos);
    });
  }, [match.params.uuid]);

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
      <ReactBnbGallery
        show={galleryOpened}
        onClose={toggleGallery}
        photos={itemsToSelect}
        activePhotoIndex={photoIndex}
      ></ReactBnbGallery>
    </div>
  );
}

function DownloadButton({ arrayItems, isActive }) {
  const selectedItems = arrayItems.filter(item => item.selected);

  return (
    <div
      className={cx('button', {
        btnDisabled: isActive && !selectedItems.length
      })}
      onClick={() => zipFile(arrayItems, isActive)}
    >
      {isActive
        ? 'Download ' + selectedItems.length + ' images'
        : 'Download All'}
    </div>
  );
}

export default Gallery;
