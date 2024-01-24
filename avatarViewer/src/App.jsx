import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/getAvatar', {
        input: input,
      });
      const { type, image } = response.data;
      setType(type);
      setImage(image);
    } catch (error) {
      alert("Enter Valid String ")
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h1>Avatar Viewer</h1>
      <label>
        Enter Email or Website:
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
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
