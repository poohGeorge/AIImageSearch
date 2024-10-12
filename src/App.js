import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Results from './components/Results';
import './styles.css';

function App() {
  const [folderPath, setFolderPath] = useState();
  const [activePanel, setActivePanel] = useState();
  const [results, setResults] = useState([]);
  const [clickedImage, setClickedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleSearch = (folderPath, activePanel, searchData) => {
    setFolderPath(folderPath); // Use real search results from API
    setActivePanel(activePanel); // Use real search results from API
    setResults(searchData); // Use real search results from API
    setPreviewVisible(false);
    setClickedImage(null);
  };

  return (
    <div>
      <Header />
      <div className='body-container'>
        <SearchBar onSearch={handleSearch} />
        <Results folderpath={folderPath} activePanel={activePanel}
          results={results} setResults={setResults}
          previewVisible={previewVisible} setPreviewVisible={setPreviewVisible}
          clickedImage={clickedImage} setClickedImage={setClickedImage}
        />
      </div>
    </div>
  );
}

export default App;
