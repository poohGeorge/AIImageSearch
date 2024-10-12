// src/components/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config';
import KeywordMultiSelectList from './KeywordMultiSelectList';
import FlagMultiSelectList from './FlagMultiSelectList';
import ProgressModal from './ProgressModal';
import ErrorModal from './ErrorModal';
import LoginModal from './LoginModal';
import '../styles.css'
import image from '../assets/image.svg'
import selected_image from '../assets/selected_image.svg'
import keyword from '../assets/keyword.svg'
import selected_keyword from '../assets/selected_keyword.svg'
import flag from '../assets/flag.svg'
import selected_flag from '../assets/selected_flag.svg'
import upload from '../assets/upload.svg'
import close1 from '../assets/close1.svg';

const SearchBar = ({ onSearch }) => {
    const [folderPath, setFolderPath] = useState(''); // State to store folder path
    const [activePanel, setActivePanel] = useState('image'); // State to track which panel is active
    const [searchImage, setSearchImage] = useState(null);
    const [base64String, setBase64String] = useState('');
    const [copyImage, setCopyImage] = useState(null);
    const [filesNumber, setFilesNumber] = useState(100);
    const [searchText, setSearchText] = useState(null);
    const [keywordConfidence, setKeywordConfidence] = useState(50);
    const [searchFlag, setSearchFlag] = useState(null);
    const [flagConfidence, setFlagConfidence] = useState(50);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null); // State to manage cancel token
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const inputRef = useRef(null);
    const imageRef = useRef(null);
    const keywordRef = useRef(null);
    const flagRef = useRef(null);

    const keywordItems = [
            "person",         // Class 0
            "bicycle",        // Class 1
            "car",            // Class 2
            "motorcycle",     // Class 3
            "airplane",       // Class 4
            "bus",            // Class 5
            "train",          // Class 6
            "truck",          // Class 7
            "boat",           // Class 8
            "traffic light",  // Class 9
            "fire hydrant",   // Class 10
            "stop sign",      // Class 11
            "parking meter",  // Class 12
            "bench",          // Class 13
            "bird",           // Class 14
            "cat",            // Class 15
            "dog",            // Class 16
            "horse",          // Class 17
            "sheep",          // Class 18
            "cow",            // Class 19
            "elephant",       // Class 20
            "bear",           // Class 21
            "zebra",          // Class 22
            "giraffe",        // Class 23
            "backpack",       // Class 24
            "umbrella",       // Class 25
            "handbag",        // Class 26
            "tie",            // Class 27
            "suitcase",       // Class 28
            "frisbee",        // Class 29
            "skis",           // Class 30
            "snowboard",      // Class 31
            "sports ball",    // Class 32
            "kite",           // Class 33
            "baseball bat",   // Class 34
            "baseball glove", // Class 35
            "skateboard",     // Class 36
            "surfboard",      // Class 37
            "tennis racket",  // Class 38
            "bottle",         // Class 39
            "wine glass",     // Class 40
            "cup",            // Class 41
            "fork",           // Class 42
            "knife",          // Class 43
            "spoon",          // Class 44
            "bowl",           // Class 45
            "banana",         // Class 46
            "apple",          // Class 47
            "sandwich",       // Class 48
            "orange",         // Class 49
            "broccoli",       // Class 50
            "carrot",         // Class 51
            "hot dog",        // Class 52
            "pizza",          // Class 53
            "donut",          // Class 54
            "cake",           // Class 55
            "chair",          // Class 56
            "couch",          // Class 57
            "potted plant",   // Class 58
            "bed",            // Class 59
            "dining table",   // Class 60
            "toilet",         // Class 61
            "tv",             // Class 62
            "laptop",         // Class 63
            "mouse",          // Class 64
            "remote",         // Class 65
            "keyboard",       // Class 66
            "cell phone",     // Class 67
            "microwave",      // Class 68
            "oven",           // Class 69
            "toaster",        // Class 70
            "sink",           // Class 71
            "refrigerator",   // Class 72
            "book",           // Class 73
            "clock",          // Class 74
            "vase",           // Class 75
            "scissors",       // Class 76
            "teddy bear",     // Class 77
            "hair drier",     // Class 78
            "toothbrush"      // Class 79
          ];

    const flagItems = [
        'JP', 'KO', 'NZ', 'RS', 'US'
    ];

    const showErrorModal = (message) => {
        setErrorMessage(message);
        setIsErrorModalOpen(true);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0]; // Get the first file from the drag event
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCopyImage(reader.result); // Set the image source to the result from FileReader
          setSearchImage(file);
          const base64String = reader.result.split(',')[1]; // Get Base64 without metadata part
          setBase64String(base64String);
        };
        reader.readAsDataURL(file); // Convert file to data URL
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Get the first file from the drag event
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCopyImage(reader.result); // Set the image source to the result from FileReader
            setSearchImage(file);
            const base64String = reader.result.split(',')[1]; // Get Base64 without metadata part
            setBase64String(base64String);
        };
          reader.readAsDataURL(file); // Convert file to data URL
        }
      };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    useEffect(() => {
        // Function to handle paste event
        const handlePaste = (event) => {
            const items = event.clipboardData.items;
      
            // Loop through clipboard items to check for image
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
      
              // If the clipboard item is an image, read it
              if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                const reader = new FileReader();
      
                reader.onload = (event) => {
                  setSearchImage(event.target.result); // Set the image data to be displayed
                  setCopyImage(event.target.result); // Set the image data to be displayed
                  const base64String = reader.result.split(',')[1]; // Get Base64 without metadata part
                  setBase64String(base64String);
                };
      
                reader.readAsDataURL(blob); // Read image as a data URL
                break;
              }
            }
          };
    
        // Add event listener for 'paste' event
        window.addEventListener('paste', handlePaste);
    
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('paste', handlePaste);
        };
      }, []);

    const handleFilesChange = (event) => {
      const newValue = event.target.value;
      if (newValue >= 1) {
        setFilesNumber(newValue); // Ensures the value is within range
      }
    };

    const handleKeywordChange = (items) => {
        setSearchText(items);
    };

    const handleFlagChange = (items) => {
        setSearchFlag(items);
    };

    const handleKeywordSliderChange = (event) => {
        setKeywordConfidence(parseInt(event.target.value)); // Update the slider value state
    };

    const handleKeywordConfidenceChange = (event) => {
        const newValue = event.target.value  === '' ? '' : parseInt(event.target.value);;
        setKeywordConfidence(newValue); // Ensures the value is within range
    };

    const getKeySliderBackground = () => {
        const percentage = (keywordConfidence / 100) * 100; // Calculate percentage
        return `linear-gradient(90deg, #fdaf2f ${percentage}%, #ddd ${percentage}%)`;
    };

    const handleFlagSliderChange = (event) => {
        setFlagConfidence(parseInt(event.target.value)); // Update the slider value state
    };

    const handleFlagConfidenceChange = (event) => {
        const newValue = event.target.value  === '' ? '' : parseInt(event.target.value);;
        setFlagConfidence(newValue); // Ensures the value is within range
    };

    const getFlagSliderBackground = () => {
        const percentage = (flagConfidence / 100) * 100; // Calculate percentage
        return `linear-gradient(90deg, #fdaf2f ${percentage}%, #ddd ${percentage}%)`;
    };

    const handleCloseImage = () => {
        setCopyImage(null);
        setSearchImage(null);
    }

    const handlePaste = async () => {
        // if (!navigator.clipboard || !navigator.clipboard.read) {
        //     console.error('Clipboard API not supported in this browser');
        //     return;
        //   }
 
        try {
          const clipboardItems = await navigator.clipboard.read();
          for (const item of clipboardItems) {
            for (const type of item.types) {
                    // Ensure the clipboard item contains an image
                if (type.startsWith('image/')) {
                const blob = await item.getType(type);
                const imageUrl = URL.createObjectURL(blob); // Convert to a URL
                setCopyImage(imageUrl); // Set the image URL to the state
                }
            }
          }
        } catch (err) {
          console.error('Failed to read clipboard contents: ', err);
        }
      };

    // const handlePasteImage = async () => {
    //     try {
    //         // Read the clipboard items
    //         const clipboardItems = await navigator.clipboard.read();
    //         for (const item of clipboardItems) {
    //             // Look for clipboard items of type 'image'
    //             for (const type of item.types) {
    //                 if (type.startsWith('image/')) {
    //                     // Retrieve the image blob from the clipboard
    //                     const blob = await item.getType(type);

    //                     // Create an image element to display the clipboard image
    //                     const img = document.createElement('img');
    //                     img.src = URL.createObjectURL(blob);
    //                     console.log("img_src", URL.createObjectURL(blob));
    //                     dispatch(changeImgSrc({ src: URL.createObjectURL(blob) }));
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Failed to read from clipboard: ', error);
    //     }
    // }

    const handleIndexInput = () => {
        document.getElementById('index-file-input').click();
    };
    
    // Panel content
    const renderPanel = () => {
        switch (activePanel) {
            case 'image':
                return (
                    <div className="image-panel">
                        <div className='support-container'>
                            <p>Supported file types: .jpg, .jpeg, .png, .bmp, .tiff, .webp.</p>
                        </div>
                        <div className='container' ref={imageRef}>
                        {copyImage ? (
                                <div className='drop-container'>
                                    <img id='droped-image' src={copyImage} alt="Dropped" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    <button className='close-button' onClick={handleCloseImage}><img id='close-image' src={close1} alt='close-image'/></button>
                                </div>
                            ) : (
                            <div className='input-container'>
                                <div 
                                    className="drop-zone" 
                                    onDrop={handleDrop} 
                                    onDragOver={handleDragOver}
                                >
                                    <div>
                                        <img id='upload-image' src={upload} alt='' />
                                        <p className='align-text'>Drag & drop</p>
                                    </div>
                                </div>
                                <div className='choose-container'>
                                    <div>
                                        <p className='align-text'>Or choose a file</p>
                                    </div>
                                    <div>
                                        <button id='browse-button' onClick={handleIndexInput}>Browse your files</button>
                                        <input
                                            id="index-file-input"
                                            type="file"
                                            accept="image/*" 
                                            onChange={handleImageUpload} // Capture the folder
                                            hidden
                                        />
                                    </div>
                                    <div>
                                        <button id='paste-button' onClick={handlePaste}>Paste from clipboard</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        </div>
                        <div className='setting-container'>
                            <p>Files to search (The Minimum value is 1.)</p>
                            <div className='files-input'>
                                <input
                                    id="query-files-input"
                                    type="number"
                                    value={filesNumber}
                                    onChange={handleFilesChange}
                                />
                                <p>files</p>
                            </div>
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className="keyword-panel">
                        <div className='support-container'>
                            <p>Select keywords to search</p>
                        </div>
                            <KeywordMultiSelectList options={keywordItems} onSelectionChange={handleKeywordChange} ref={keywordRef}/>
                        <div className='setting-container'>
                            <p>Confidence threshold (%)</p>
                            <div className='files-input'>
                                {/* Slider */}
                                <div className='slide-container'>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={keywordConfidence}
                                    onChange={handleKeywordSliderChange}
                                    style={{ background: getKeySliderBackground() }}
                                    />
                                    <div className='slide-label'>
                                        <p id='start-label'>0</p>
                                        <p id='end-label'>100</p>
                                    </div>
                                </div>
                                <input
                                    id="keyword-confidence"
                                    type="number"
                                    min="0" 
                                    max="100" 
                                    value={keywordConfidence}
                                    onChange={handleKeywordConfidenceChange}
                                />
                                <p>%</p>
                            </div>
                        </div>
                    </div>
                );
            case 'flags':
                return (
                    <div className="flag-panel">
                        <div className='support-container'>
                            <p>Select flags to search</p>
                        </div>
                            <FlagMultiSelectList options={flagItems} onSelectionChange={handleFlagChange} ref={flagRef}/>
                        <div className='setting-container'>
                            <p>Confidence threshold (%)</p>
                            <div className='files-input'>
                                {/* Slider */}
                                <div className='slide-container'>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={flagConfidence}
                                    onChange={handleFlagSliderChange}
                                    style={{ background: getFlagSliderBackground() }}
                                    />
                                    <div className='slide-label'>
                                        <p id='start-label'>0</p>
                                        <p id='end-label'>100</p>
                                    </div>
                                </div>
                                <input
                                    id="flag-confidence"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={flagConfidence}
                                    onChange={handleFlagConfidenceChange}
                                />
                                <p>%</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSearch = async (username, password) => {
        // Create a cancel token
        const source = axios.CancelToken.source();
        setCancelTokenSource(source); // Save the cancel token to state

        console.log('FolderPath: ', folderPath);
        console.log('ImageFiles: ', filesNumber);
        console.log('SearchText: ', searchText);
        console.log('TextConfidence: ', keywordConfidence);
        console.log('SearchFlag: ', searchFlag);
        console.log('FlagConfidence: ', flagConfidence);
        console.log('base64String: ', base64String);

        let payload = {
            smb_path: folderPath,
            username: username,
            password: password,
            prompt_type: activePanel
        };

        if (folderPath === '') {
            // alert('Input Folder Path to Search.');
            inputRef.current.focus();
            return;
        }
        else {
            console.log('activePanel: ', activePanel);
            switch (activePanel) {
                case 'image':
                    if (searchImage == null) {
                        // alert('Input Image.');
                        imageRef.current.focus();
                        showErrorModal('Select image to search.'); // Show error modal
                        return;
                    }
                    else {
                        // payload.prompt = '\\\\192.168.140.239\\image_search_test\\' + searchImage.name;
                        payload.prompt = base64String;
                        payload.conf_thres = filesNumber;
                        payload.classes = '';
                    }
                    break;
                case 'text':
                    if (searchText == null) {
                        // alert('Input Keyword.');
                        // selectRef.current.focus(); // Focus on the multi-select if nothing is selected
                        keywordRef.current.focus();
                        return;
                    }
                    else {
                        payload.prompt = '';
                        payload.conf_thres = keywordConfidence/100;
                        payload.classes = searchText;
                    }
                    break;
                case 'flags':
                    if (searchFlag == null) {
                        // alert('Input Flag.');
                        flagRef.current.focus();
                        return;                      
                    }
                    else {
                        payload.prompt = '';
                        payload.conf_thres = flagConfidence/100;
                        payload.classes = searchFlag;
                    }
                    break;
                default:
            }
        }

        console.log('keywordConf: ', keywordConfidence/100);

        try {
            setIsSearching(true);
            setModalOpen(true);
            const response = await axios.post(`${config.backendUrl}/search`, payload, { cancelToken: source.token });

            console.log('Search Response: ', response);

            // Check if the response contains an error related to the image
            if (response.data['error']) {
                console.error('Error in image processing:', response.data['error']);
                showErrorModal(response.data['error']); // Show error modal with the error message
            } else {
                console.log('Folder path uploaded successfully', response.data);
                onSearch(folderPath, activePanel, response.data.result); // Pass the result for further processing
            }

        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Search request canceled");
            } else {
                console.error('Search request failed:', error.message || error);
                showErrorModal('SMB connection error'); // Show error modal
            }
        } finally {
            setIsSearching(false);
            setModalOpen(false);
        }
    };

    // Cancel search handler
    const handleCancel = () => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel("User canceled the search");
        // Send a request to cancel the search on the backend
        axios.post(`${config.backendUrl}/cancel_search`)
            .then(response => {
                console.log(response.data.message);
                setIsSearching(false); // Stop the modal
            })
            .catch(error => {
                console.error("Error canceling search on backend:", error);
            });
            setIsSearching(false); // Close the modal or indicate the search is stopped
        }
    };

    const handleSearchClick = () => {
        setLoginModalOpen(true); // Open the modal on search button click
    };

    const handleFolderChange = (event) => {
        const folderPath = event.target.value;
        setFolderPath(folderPath)
    }

    return (
        <div className='searchbar'>
            <div className='searchpan'>
                <div>
                    <h4>Enter search</h4>
                </div>
                <div className='index-container'>
                    <div className='images-container'>
                        <p id='indexed-images'>Path to search</p>
                    </div>
                    <div className='index-input'>
                        <input
                            id="index-text-input"
                            type='text'
                            placeholder='\\192.168.140.239\image_search_folder'
                            ref={inputRef} // Attach the ref to the input element
                            onChange={handleFolderChange}
                        />
                    </div>
                </div>
                <div className='query-container'>
                    <div className='tab-container'>
                        <button className={`tab-button ${activePanel === 'image' ? 'btn-clicked' : ''}`} onClick={() => setActivePanel('image')}>
                            <img className='tab-image' src={activePanel === 'image' ? selected_image : image} alt='tab-image' />
                            <span className='tab-label'>Image</span>
                        </button>
                        <button className={`tab-button ${activePanel === 'text' ? 'btn-clicked' : ''}`} onClick={() => setActivePanel('text')}>
                            <img className='tab-image' src={activePanel === 'text' ? selected_keyword : keyword} alt='tab-keyword' />
                            <span className='tab-label'>Keyword</span>
                        </button>
                        <button className={`tab-button ${activePanel === 'flags' ? 'btn-clicked' : ''}`} onClick={() => setActivePanel('flags')}>
                            <img className='tab-image' src={activePanel === 'flags' ? selected_flag : flag} alt='tab-flag' />
                            <span className='tab-label'>Flag</span>
                        </button>
                    </div>
                    {/* Render the panel based on active state */}
                    <div className="panel-container">
                        {renderPanel()}
                    </div>
                </div>
                <div className='search-container'>
                    <button id='search-button' onClick={handleSearchClick}>Search</button>
                    <LoginModal
                        isOpen={isLoginModalOpen}
                        onClose={() => setLoginModalOpen(false)}
                        onLogin={handleSearch}
                    />
                    { isSearching && (
                        <ProgressModal 
                            isOpen={isModalOpen}
                            onCancel={handleCancel} 
                        />
                    )}
                </div>
                {/* Include the error modal */}
                <ErrorModal 
                    isOpen={isErrorModalOpen} 
                    message={errorMessage} 
                    onClose={() => setIsErrorModalOpen(false)} 
                />
            </div>
        </div>
    );
};

export default SearchBar;
