require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Serve static files (e.g., index.html, js, css)
app.use(express.static('public'));

// Endpoint to get channel data
app.get('/get-channel-data', async (req, res) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
      params: {
        part: 'snippet,statistics',
        id: CHANNEL_ID,
        key: YOUTUBE_API_KEY
      }
    });

    const channel = response.data.items[0];

    if (channel) {
      console.log('Channel data:', channel);
      const channelData = {
        avatarUrl: channel.snippet.thumbnails.default.url,
        title: channel.snippet.title,
        subscribers: channel.statistics.subscriberCount,
        views: channel.statistics.viewCount,
        videos: channel.statistics.videoCount
      };

      res.json(channelData);
    } else {
      res.status(404).send('Channel not found');
    }
  } catch (error) {
    console.error('Error fetching channel data:', error);
    res.status(500).send('Error fetching channel data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
