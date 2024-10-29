//require the express module
const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));

// Routes
app.get(['/mytunes.html', '/mytunes', '/index.html', '/'], (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// I used the following code from tutorial 7, but I modified it to use the iTunes API
app.get('/songs', (request, response) => {
  let title = request.query.title;
  if (!title) {
    response.json({ message: 'Please enter a song title' });
    return;
  }

  const titleWithPlusSigns = title.replace(/\s+/g, '+');
  
  const options = {
    method: "GET",
    hostname: "itunes.apple.com",
    port: null,
    // I set the limit to 20 which is part of the requirements for the assignment
    path: `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`,
    headers: {
      useQueryString: true
    }
  };

  http.request(options, function(apiResponse) {
    let songData = '';
    apiResponse.on('data', function(chunk) {
      songData += chunk;
    });
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData));
    });
  }).end();
});

// Start server
app.listen(PORT, err => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`To Test:`);
    console.log(`http://localhost:3000`);
    console.log(`http://localhost:3000/mytunes.html`);
    console.log(`http://localhost:3000/mytunes`);
    console.log(`http://localhost:3000/index.html`);
    console.log(`http://localhost:3000/`);
  }
});
