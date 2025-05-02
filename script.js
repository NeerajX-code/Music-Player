class Song {
  constructor(filePath, title, artist, lyrics, poster) {
    this.filePath = filePath;
    this.title = title;
    this.artist = artist;
    this.lyrics = lyrics;
    this.poster = poster;
  }
}
Song.prototype.Isplay = false;
let n = 2;
class playlist {
  constructor() {
    this.songs = [];
  }
   addSong(song){
    this.songs.push(song);
  }
  showListOfSongs() {
    this.songs.forEach((song, index) => {
       let playlistCont = document.querySelector(".playlist-cont");
       let item = document.createElement("div");
       item.setAttribute("id",index)
       item.innerHTML = `${song.title}`
       playlistCont.append(item)
    });
  }
  playSong(index) {
    let song = this.songs[index]
    if(song && !song.play) {
      song.play = true; // Set the play property to true
      let audio = new Audio(song.filePath);
      audio.play();
      console.log(`Playing: ${song.title} by ${song.artist}`);
    }
  }
  // stopSong(index) {
  //   let song = this.songs[index]
  //   if(song) {
  //     song.play = false; // Set the play property to false
  //     this.playSong(index)
  //     console.log(`Stopped: ${song.title} by ${song.artist}`);
  //   }
  // }
}
let playlist1 = new playlist();
let songs = async () => {
  try {
    let response = await fetch("./songs.json");
    let textData = await response.text();
    let data = await JSON.parse(textData); // Manually parse the JSON string
    data.forEach(val => {
      let song = new Song(val.filePath, val.title, val.artist, val.lyrics, val.poster);
      playlist1.addSong(song); // Add each song to the playlist 
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};
songs();

playlist1.showListOfSongs(); // Show the list of songs in the console

// function showPlaylist(playlist) {
//   let playlistContainer = document.querySelector(".playlist-cont");
//   playlist.forEach((song, index) => {
//     let songElement = document.createElement("div");
//     songElement.classList.add("song-item");
//     songElement.innerHTML = `
//       <img src="${song.poster}" alt="${song.title}">
//       <div class="song-info">
//         <h3>${song.title}</h3>
//         <p>${song.artist}</p>
//       </div>
//     `;
//     songElement.addEventListener("click", () => {
//       playSong(index);
//     });
//     playlistContainer.appendChild(songElement);
//   });
//   console.log("Playlist:", playlist); // Log the playlist to the console
// }

// showPlaylist(playlist1);