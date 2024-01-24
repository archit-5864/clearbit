import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

function App() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [type, setType] = useState('');
  const [image, setImage] = useState('');

  const getSuggestions = async (value) => {
    try {
      const response = await axios.post('http://localhost:3000/autocomplete', {
        input: value,
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = async (_, { suggestionValue }) => {
    const domainMatch = suggestionValue.match(/\((.*?)\)/);
    const domain = domainMatch ? domainMatch[1] : '';
    setInput(`https://${domain}`);
  };

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const inputProps = {
    placeholder: 'Enter Company Name',
    value: input,
    onChange: (e, { newValue }) => setInput(newValue),
  };

  const handleSubmit = async () => {
    if (input.trim() === '') {
      alert('Please enter a valid company name.');
      return;
    }

    // Alert to confirm before proceeding
    // const confirmAlert = window.confirm('Proceed with fetching the avatar?');
    try {
      const response = await axios.post('http://localhost:3000/getAvatar', {
        input: input,
      });
      const { type, image } = response.data;
      setType(type);
      setImage(image);
    } catch (error) {
      alert('Error fetching avatar. Please try again.');
      console.error('Error:', error.message);
    }

  };

  return (
    <div>
      <h1>Avatar Viewer</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <button onClick={handleSubmit}>Get Avatar</button>

      {type && image && (
        <div>
          <h2>{`Type: ${type}`}</h2>
          {type === 'email' ? (
            <img src={image} alt="Gravatar" />
          ) : (
            <img src={image} alt="Website Logo" />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
