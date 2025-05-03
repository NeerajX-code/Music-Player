class Song {
  constructor(filePath, title, artist, lyrics, poster, duration) {
    this.filePath = filePath;
    this.title = title;
    this.artist = artist;
    this.lyrics = lyrics;
    this.poster = poster;
    this.duration = duration;
    this.Isplay = false;
  }
}

let n = 2;
let audio ;
let i = document.querySelector(".play-pause i");
class playlist {
  constructor() {
    this.songs = [];
  }
  addSong(song) {
    this.songs.push(song);
  }
  showListOfSongs() {
    this.songs.forEach((song, index) => {
      let playlistCont = document.querySelector(".playlist-cont");
      let item = document.createElement("div");
      item.classList.add("item");
      item.setAttribute("id", index);
      item.innerHTML = `<div class="item-img"> <img src="${song.poster}"> </div> <div class="item-details"><h3>${song.title}</h3><p>${song.artist}</div>`;
      playlistCont.append(item);
    });
  }
  loadToPlayer(index){
    function secondToMilisecond(second){
      let milisecond = second * 1000;
      return milisecond;
    }
    function minutesToMiliseconds(minutes){
      let milisecond = minutes * 60 * 1000;
      return milisecond;
    }
     let song = this.songs[index];
     let img = document.querySelector(".album-poster");
     let title = document.querySelector(".song-title");
     let artist = document.querySelector(".song-artist");
     let lyricsPara = document.querySelector(".lyrics-paragraph");
     let duration = document.querySelector(".duration");
     let timeline = document.querySelector("#timeline");
     let PlayPause = document.querySelector(".play-pause");
     let controls = document.querySelector(".controls");
     controls.style.position = "absolute";
      controls.style.bottom = "40px";
      controls.style.left = "42.5%";
      controls.style.transform = "scale(1.5)";
      controls.style.transition = "all 0.5s ease-in-out";
      PlayPause.innerHTML = `<i class="ri-pause-line"></i>`;
      PlayPause.setAttribute("id",index);
      img.setAttribute("src", song.poster);
      title.innerText = song.title;
      artist.innerText = song.artist;
      lyricsPara.innerText = song.lyrics;
      let dura = String(song.duration).split(".");
      let mins = parseInt(dura[0]);
      let secs = dura[1] ? parseInt(dura[1].padEnd(2, "0")) : 0;
    
      // Update text duration
      duration.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;
    
      // Convert to total ms
      let total = minutesToMiliseconds(mins) + secondToMilisecond(secs);
      timeline.max = total;
      let current = 0;
    
      let range = setInterval(() => {
        current += 1000; // increase by 1 second (1000ms)
        if (current > total) {
          clearInterval(range);
          timeline.value = 0;
          audio.pause();
          song.play = false;
        } else {
          timeline.value = current;
        }
      }, 1000);
  }
  }

let playlist1 = new playlist();
let songs = async () => {
  try {
    let response = await fetch("./songs.json");
    let textData = await response.text();
    let data = await JSON.parse(textData); // Manually parse the JSON string
    data.forEach((val) => {
      let song = new Song(
        val.filePath,
        val.title,
        val.artist,
        val.lyrics,
        val.poster,
        val.duration
      );
      playlist1.addSong(song); // Add each song to the playlist
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};
songs();

const showMusic = () => {
  console.log("hello");
  playlist1.showListOfSongs();
  // Show the list of songs in the console
};

window.addEventListener("load", () => {
  showMusic();
});
document.querySelector(".playlist-cont").addEventListener("click", (e) => {
  let target = e.target.closest(".item").id;
  console.log(target);
  playlist1.loadToPlayer(target);
  if (playlist1.songs.some((s) => s.Isplay==true)) {
    let index = playlist1.songs.findIndex((s) => s.Isplay == true);
    let song = playlist1.songs[index];
    if (index == target)  {
      audio.pause();
      song.Isplay = false;
      document.querySelector(".play-pause").innerHTML = `<i class="ri-play-circle-fill"></i>`;
    }
    else{
    audio.pause();
    song.Isplay = false;
    let newSong = playlist1.songs[target];
    audio = new Audio(newSong.filePath);
    audio.play();
    newSong.Isplay = true;
    playlist1.loadToPlayer(target);
    document.querySelector(".play-pause").innerHTML = `<i class="ri-pause-line"></i>`;
    }
  }
  else{
  let index = e.target.closest(".item").id;
  let song = playlist1.songs[index];
  console.log(song);
  if (playlist1.songs.some((s) => song==s? s.Isplay:NaN)==false) {
    audio = new Audio(song.filePath);
    audio.play();
    song.Isplay = true;
  }
  else{
    audio.pause();
    song.Isplay = false;
  }
}
});

 document.querySelector(".play-pause").addEventListener("click", (e) => {
  console.log("Hello from play-pause");
  let index = Number(e.target.id);
  console.log(typeof(index));
  let song = playlist1.songs[index];
  console.log(song);
  if (song.Isplay == true) {
    audio.pause();
    song.Isplay = false;
    document.querySelector(".play-pause").innerHTML = `<i class="ri-play-circle-fill"></i>`;
  }
  else{
    audio.play();
    song.Isplay = true;
    e.target.innerHTML = "";
    document.querySelector(".play-pause").innerHTML = `<i class="ri-pause-line"></i>`;
  }

});