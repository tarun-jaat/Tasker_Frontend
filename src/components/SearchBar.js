import React from 'react';
import './SearchBar.css';

const SearchBar = ({ setSearchQuery }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search Task"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button className="search-button">🔍</button>
        </div>
    );
};

export default SearchBar;