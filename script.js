class Song {
  constructor(filePath, title, artist, lyrics, poster) {
    this.filePath = filePath;
    this.title = title;
    this.artist = artist;
    this.lyrics = lyrics;
    this.poster = poster;
  }
}

let playlist = [];
let songs = async () => {
  try {
    let response = await fetch("songs.json");
    let data = await response.json();
    console.log(data[0].filePath);
    let audio = new Audio(filePath);
    window.addEventListener("keypress", function () {
      audio.play();
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};

songs();
