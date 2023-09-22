import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import fetchImages from './services/apiService';

import styles from './app.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  useEffect(() => {
    if (!query || !hasMoreImages) return;

    setLoading(true);

    fetchImages(query, page)
      .then((data) => {
        setImages((prevImages) => [...prevImages, ...data]);
        setHasMoreImages(data.length === 12);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, page, hasMoreImages]);

  const handleFormSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setHasMoreImages(true);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (largeImageURL) => {
    setLargeImageURL(largeImageURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader visible={true} />}
      {hasMoreImages && images.length > 0 && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;

