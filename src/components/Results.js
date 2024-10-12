// src/components/Results.js
import React, { useState } from 'react';
import config from '../config';
import DeleteModal from './DeleteModal';
import './results.css';
import del from '../assets/delete.svg';
import del2 from '../assets/delete2.svg';
import download1 from '../assets/download1.svg';
import next from '../assets/next.svg';
import prev from '../assets/prev.svg';
import close from '../assets/close.svg';
import CheckboxChecked from '../assets/checkbox_checked.svg';  // Adjust path
import CheckboxUnchecked from '../assets/checkbox_unchecked.svg';  // Adjust path
import Checkbox1Checked from '../assets/checkbox1_checked.svg';  // Adjust path
import Checkbox1Unchecked from '../assets/checkbox1_unchecked.svg';  // Adjust path

const Results = ({ folderpath, activePanel, results, setResults, previewVisible, setPreviewVisible, clickedImage, setClickedImage}) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectAll, setSelectAll] = useState(false); // State for "select all"
    const [isModalOpen, setModalOpen] = useState(false);
    const [imageIdsToDelete, setImageIdsToDelete] = useState([]);
    const [deletionType, setDeletionType] = useState(''); // Track deletion type

    // Fallback to an empty array if results is undefined
    console.log('results in Results.js', results);

    const handlePreviewImage = (image) => {
        setClickedImage(image);
        setCurrentIndex(results.findIndex(img => img.id === image.id)); // Update to find index
        setPreviewVisible(true);
    };

    // Handle selecting or deselecting images
    const handleSelectImage = (imageId) => {
        setSelectedImages((prevSelected) =>
        prevSelected.includes(imageId)
            ? prevSelected.filter((id) => id !== imageId)
            : [...prevSelected, imageId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedImages([]); // Uncheck all images
        } else {
            setSelectedImages(results.map((image) => image.id)); // Select all images
        }
        setSelectAll(!selectAll); // Toggle select all state
    };

    const handleDeleteAll = () => {
        if (selectedImages.length === 0)
            return;
        setDeletionType('all');
        setImageIdsToDelete(selectedImages);  // Set the selected images to delete
        setModalOpen(true);
    }

    // Delete handlers
    const handleCardDelete = (imageId) => {
        setImageIdsToDelete([imageId]);
        setDeletionType('card');
        setModalOpen(true);
    };

    const handlePreviewDelete = () => {
        setImageIdsToDelete([clickedImage.id]); // Assuming clickedImage contains the image to delete
        setDeletionType('preview');
        setModalOpen(true);
    };

    // Handle deleting selected images
    const handleDelete = () => {
        // Ensure imageIdsToDelete is always an array
        if (!Array.isArray(imageIdsToDelete)) {
            setImageIdsToDelete([imageIdsToDelete]);
        }
        const selectedImagePaths = results
            .filter(image => imageIdsToDelete.includes(image.id))  // Filter by selectedImages
            .map(image => image.image_path);  // Extract image_path
        console.log('imageIdsToDelete: ', imageIdsToDelete);
        console.log('selectedImagePaths: ', JSON.stringify(selectedImagePaths));
        // API call to delete selected images
        fetch(`${config.backendUrl}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedImagePaths),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete images');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Deleted successfully:', data);

            // Filter out the deleted images from the results
            let updatedResults;

            if (deletionType === 'all') {
                updatedResults = results.filter(image => !imageIdsToDelete.includes(image.id));
                setSelectedImages([]);
            } else if (deletionType === 'card' || deletionType === 'preview') {
                updatedResults = results.filter(image => image.id !== imageIdsToDelete[0]); // Delete the single image
            }
            setResults(updatedResults);
            setModalOpen(false); // Close the modal after confirming deletion

            if (clickedImage) {
                if (updatedResults.length > 0) {
                    const index = updatedResults.indexOf(clickedImage);
                    if (index === -1 ) {
                        // Ensure currentIndex is valid after deletion
                        const newIndex = currentIndex >= updatedResults.length ? updatedResults.length - 1 : currentIndex;
                        setCurrentIndex(newIndex);
                        setClickedImage(updatedResults[newIndex]); // Preview next or previous image
                    }
                    else {
                        setCurrentIndex(index);
                        setClickedImage(updatedResults[index]); // Preview next or previous image
                    }
                } else {
                    setPreviewVisible(false);
                    setClickedImage(null);
                    setCurrentIndex(0);
                }
            }
        })
        .catch((error) => {
            console.error('Error deleting images:', error);
        });
    };

    const handleDownload = async (image) => {
        const imagePath = image.image_path;
        const response = await fetch(`${config.backendUrl}/download/` + imagePath);
        
        if (!response.ok) {
            console.error('Failed to fetch image:', response.statusText);
            return;
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = imagePath.split('/').pop(); // Download image with the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the URL object
      };

    const handlePreviewDownload = async () => {

        const imagePath = results[currentIndex].image_path;
        const response = await fetch(`${config.backendUrl}/download/` + imagePath);
        
        if (!response.ok) {
            console.error('Failed to fetch image:', response.statusText);
            return;
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = imagePath.split('/').pop(); // Download image with the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the URL object
      };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        setClickedImage(results[currentIndex - 1]);
      };
    
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex));
        setClickedImage(results[currentIndex + 1]);
    };

    const handleClosePreview = () => {
        setClickedImage(null);
        setPreviewVisible(false);
    };

    function shortenPath(path, maxLength) {
        if (path.length <= maxLength) return path;
      
        const start = path.slice(0, 15); // First part of the path
        const end = path.slice(-10);     // Last part of the path
      
        return `${start}...${end}`; // Shortened path with ellipses in the middle
      }

    return (
        <>
            <div className='result-container'>
                <div className='result-title'>
                    <div className='result-files'>
                        <div className='results-container'>
                            <p>Results : {results == null ? 0 : results.length} files</p>
                        </div>
                        <img
                            id='all-check'
                            title="Select/Unselect all"
                            src={selectAll ? CheckboxChecked : CheckboxUnchecked} // Use checked or unchecked icon
                            alt="Select all"
                            onClick={handleSelectAll}
                            style={{ cursor: 'pointer' }} // Change to pointer for clickable behavior
                        />
                    </div>
                    <div>
                        <img className='delete-button' title="Remove selected" src={del} alt='' disabled={selectedImages.length === 0}  onClick={handleDeleteAll}/>
                        <DeleteModal 
                            isOpen={isModalOpen} 
                            onClose={() => setModalOpen(false)} 
                            onConfirm={handleDelete} 
                        />
                    </div>
                </div>
                { results.length > 0 ? (
                    <div className='view-container'>
                        <div className={`image-cards-container ${clickedImage ? 'reduced-width' : ''}`}>
                            {results.map((image, index) => (
                                <div className="image-card" >
                                    <div className='image-container'>
                                        <img className='image' src={`${config.backendUrl}/image/` + image.image_path} alt={index} onClick={() => handlePreviewImage(image)}/>
                                    </div>
                                    <div className='overlay'>
                                        <img
                                            className='card-checkbox'
                                            src={selectedImages.includes(image.id) ? Checkbox1Checked : Checkbox1Unchecked} // Use checked or unchecked icon
                                            alt="Select"
                                            onClick={() => handleSelectImage(image.id)}
                                            style={{ cursor: 'pointer' }} // Make it clickable
                                        />
                                        { activePanel === 'image' && (
                                            <div className='image-score'>{image.distance.toString().slice(0, 8)}</div>
                                        )}
                                    </div>

                                    {/* Hover buttons */}
                                    <div className="hover-buttons">
                                        <button className="hover-button delete" title="Remove" onClick={() => handleCardDelete(image.id)}><img className='hover-image' src={del2} alt='delete'/></button>
                                        <button className="hover-button download" title="Download" onClick={() => handleDownload(image)}><img className='hover-image' src={download1} alt='download'/></button>
                                    </div>
                                        
                                    <div className='filename-div'>
                                        <p id='filename-p'>{shortenPath(image.filename, 25)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Image Preview */}
                        {results.length > 0 && previewVisible && (
                            <div className="fixed-preview">
                                <div className='preview-title'>
                                    <div className='preview-filename-container'>
                                        <h4 className='preview-filename'>{shortenPath(clickedImage.filename, 35)}</h4>
                                    </div>
                                    <div className='preview-buttons'>
                                        <button className="preview-button download" title="Download" onClick={handlePreviewDownload}><img src={download1} alt='download'/></button>
                                        <button className="preview-button delete" title="Remove" onClick={handlePreviewDelete}><img src={del2} alt='delete'/></button>
                                        <button className="preview-button prev" title="Prev" onClick={handlePrev} disabled={currentIndex === 0}><img src={prev} alt='prev'/></button>
                                        <button className="preview-button next" title="Next" onClick={handleNext} disabled={currentIndex === results.length - 1}><img src={next} alt='next'/></button>
                                    </div>
                                    <div className='preview-close'>
                                        <img className='close-preview' src={close} alt='' onClick={handleClosePreview} />
                                    </div>
                                </div>
                                <img src={`${config.backendUrl}/image/` + clickedImage.image_path} alt="Not supported" className="preview-image" />
                                <div className='preview-info'>
                                    <div className='preview-quantity'>
                                        { activePanel === 'image' && (
                                            <div className='preview-score'>{clickedImage.distance.toString().slice(0, 8)}</div>
                                        )}
                                        <div className='preview-resolution'>{clickedImage.resolution}</div>
                                    </div>
                                    <div className='preview-filepath'>
                                        <p>{folderpath}\{clickedImage.image_path}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                <div className='noresult-container'>
                    <h1>No Result</h1>
                </div>

                )}
            </div>
        </>
    );
};

export default Results;
