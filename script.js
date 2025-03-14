document.getElementById('videoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get user inputs
  const videoLink = document.getElementById('videoLink').value.trim();
  const videoTitle = document.getElementById('videoTitle').value.trim() || 'Untitled Video';

  // Extract video ID from the link
  const videoId = extractVideoId(videoLink);
  if (!videoId) {
    displayResult('Invalid YouTube link. Please try again.');
    return;
  }

  // Generate Markdown code
  const markdown = generateMarkdown(videoId, videoTitle);

  // Display the result
  displayResult(markdown);
});

function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function generateMarkdown(videoId, title) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  return `# ${title}\n\n![Video Thumbnail](${thumbnailUrl})\n\n[Watch on YouTube](${youtubeUrl})`;
}

function displayResult(content) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<pre>${content}</pre>`;
}

// API Key

async function fetchVideoDetails(videoId) {
  const apiKey = 'YOUR_API_KEY';
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.items.length > 0) {
      return data.items[0].snippet.title;
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
  return null;
}

// Form submission

document.getElementById('videoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const videoLink = document.getElementById('videoLink').value.trim();
  let videoTitle = document.getElementById('videoTitle').value.trim();

  const videoId = extractVideoId(videoLink);
  if (!videoId) {
    displayResult('Invalid YouTube link. Please try again.');
    return;
  }

  if (!videoTitle) {
    videoTitle = await fetchVideoDetails(videoId) || 'Untitled Video';
  }

  const markdown = generateMarkdown(videoId, videoTitle);
  displayResult(markdown);
});
