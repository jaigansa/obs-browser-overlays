// Function to fetch channel data from the backend
async function fetchChannelData() {
  try {
    const response = await fetch('/get-channel-data');  // Backend endpoint

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data) {
      console.log(data);
      return {
        avatarUrl: data.avatarUrl,
        title: data.title,
        subscribers: formatCount(data.subscribers),
        views: formatCount(data.views),
        videos: data.videos,
      };
    } else {
      console.log('Channel data not found or no data available.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching channel data:', error.message);
    return null;
  }
}

// Function to format large numbers
function formatCount(number) {
  if (number < 1000) {
    return number.toString();
  }
  const suffixes = ['k', 'M', 'B', 'T'];
  let suffixIndex = -1;
  let formattedNumber = number;

  while (formattedNumber >= 1000 && suffixIndex < suffixes.length - 1) {
    suffixIndex++;
    formattedNumber /= 1000;
  }

  return formattedNumber.toFixed(1) + suffixes[suffixIndex];
}

// Select DOM elements
const avatarDiv = document.getElementById('avatar-image');
const titleDiv = document.getElementById('channel-title');
const subscribersDiv = document.getElementById('subscribers-count');
const totalChannelViewsDiv = document.getElementById('total-channel-views');
const totalChannelVideosDiv = document.getElementById('total-channel-videos');

// Function to populate the DOM
async function updateChannelInfo() {
  const channelData = await fetchChannelData();

  if (channelData) {
    const { avatarUrl, title, subscribers, views, videos } = channelData;

    // Update the DOM
    avatarDiv.innerHTML = `<img src="${avatarUrl}" alt="Avatar Image" class="rounded-full" />`;
    titleDiv.textContent = title;
    subscribersDiv.textContent = subscribers;
    totalChannelViewsDiv.textContent = views;
    totalChannelVideosDiv.textContent = videos;
  }
}

// Initialize the data fetch on load
window.onload = updateChannelInfo;
