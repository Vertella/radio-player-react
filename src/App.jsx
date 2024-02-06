import './App.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const Radio = () => {
  const [channels, setChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.sr.se/api/v2/channels?format=json&size=100');
        setChannels(response.data.channels.map(channel => ({
          audioUrl: channel.liveaudio.url,
          name: channel.name,
          image: channel.image,
          colorKey: `#${channel.color}`,
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search channels"
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="search-bar"
      />
      {loading ? ( // Show skeleton loader if loading state is true
        <div>
          <Skeleton height={150} count={5} />
        </div>
      ) : (
        <div className="channel-container">
          {filteredChannels.map((channel, index) => (
            <div key={index} className="channel-item" style={{ backgroundColor: channel.colorKey }}>
              <img src={channel.image} alt={channel.name} />
              <div className="channel-details">
                <h3>{channel.name}</h3>
                <audio controls>
                  <source src={channel.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {

  return (
    <div>
      <Radio />
    </div>
  );
}

export default App
