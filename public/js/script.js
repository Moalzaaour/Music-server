//the following function is used to search for songs using the iTunes API
function searchSongs() {
    let songTitle = document.getElementById('songTitle').value;
    if (songTitle === '') {
        alert('Please enter a song title');
        return;
    }

    // Update the search query heading
    document.getElementById('searchQuery').innerText = songTitle;

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            populateSearchResults(response.results);
        }
    };
    xhr.open('GET', `/songs?title=${encodeURIComponent(songTitle)}`, true);
    xhr.send();
}

// The following function is used to handle the enter key
const ENTER = 13;
function handleKeyUp(event) {
    if (event.keyCode === ENTER) {
        document.getElementById("submit_button").click();
    }
}
// The following function is used to add a song to the playlist
function addSongToPlaylist(song) {
    // get the playlist div
    const playlist = document.getElementById('playlist');
    const row = playlist.insertRow(-1);

    // Add buttons for removing and moving songs
    const controlCell = row.insertCell(0);
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '-';
    removeBtn.addEventListener('click', function() {
        row.remove();
        savePlaylist(); // Save after removing a song
    });
    const upBtn = document.createElement('button');
    upBtn.textContent = '🔼';
    upBtn.addEventListener('click', function() {
        if(row.previousElementSibling) {
            playlist.insertBefore(row, row.previousElementSibling);
            savePlaylist(); // Save after moving a song up
        }
    });
    const downBtn = document.createElement('button');
    downBtn.textContent = '🔽';
    downBtn.addEventListener('click', function() {
        if(row.nextElementSibling) {
            playlist.insertBefore(row.nextElementSibling, row);
            savePlaylist(); // Save after moving a song down
        }
    });

    // add the buttons to the table cell
    controlCell.appendChild(removeBtn);
    controlCell.appendChild(upBtn);
    controlCell.appendChild(downBtn);

    // create the table
    const titleCell = row.insertCell(1);
    titleCell.textContent = song.trackName;

    const artistCell = row.insertCell(2);
    artistCell.textContent = song.artistName;

    const artworkCell = row.insertCell(3);
    artworkCell.innerHTML = `<img src="${song.artworkUrl60}" alt="Artwork" style="width: 60px; height: 60px;">`;
    
    // Save the playlist after adding a song
    savePlaylist(); 
}


// The following function is used to populate the search results
function populateSearchResults(songs) {
    // get the search results div
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    // Loop through the songs and add them to the search results
    songs.forEach(song => {
        const row = searchResults.insertRow(-1);

        // Add button now simply appends the song object to the playlist
        const addButtonCell = row.insertCell(0);
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.addEventListener('click', () => addSongToPlaylist(song));
        addButtonCell.appendChild(addButton);

        const titleCell = row.insertCell(1);
        titleCell.textContent = song.trackName;

        const artistCell = row.insertCell(2);
        artistCell.textContent = song.artistName;

        const artworkCell = row.insertCell(3);
        artworkCell.innerHTML = `<img src="${song.artworkUrl60}" alt="Artwork" style="width: 60px; height: 60px;">`;
    });
}

// The following function is used to save the playlist
function savePlaylist() {
    // create an array to store the songs, then loop through the playlist and add each song to the array
    const songs = [];
    const rows = document.getElementById('playlist').rows;
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        songs.push({
            trackName: cells[1].textContent,
            artistName: cells[2].textContent,
            artworkUrl60: cells[3].querySelector('img').src
        });
    }
    const playlistData = {
        songs: songs,
        expiry: new Date().getTime() + (1000 * 60 * 60 * 24) // Set expiry for 24 hours from now
    };
    // Save the playlist data to local storage
    localStorage.setItem('playlist', JSON.stringify(playlistData));
}
// The following function is used to load the playlist
function loadPlaylist() {
    const playlistData = JSON.parse(localStorage.getItem('playlist'));
    if (playlistData && playlistData.expiry > new Date().getTime()) { // Check if data exists and hasn't expired
        playlistData.songs.forEach(song => {
            addSongToPlaylist(song);
        });
    } else {
        localStorage.removeItem('playlist'); // Clear expired or invalid data
    }
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit_button').addEventListener('click', searchSongs);
    document.getElementById('songTitle').addEventListener('keyup', handleKeyUp);
    // Load the playlist when the page loads
    loadPlaylist();
});
