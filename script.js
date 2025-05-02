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
  playSong(index) {
    let song = this.songs[index];
    let audio = new Audio(song.filePath);
    if (song && !song.play) {
      song.play = true; // Set the play property to true
      audio.play();
      console.log(`Playing: ${song.title} by ${song.artist}`);
    }
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
      img.setAttribute("src", song.poster);
      title.innerText = song.title;
      artist.innerText = song.artist;
      lyricsPara.innerText = song.lyrics;
      let dura = String(song.duration).split(".");
      if (dura[1] == undefined) {
        dura[1] = "00";
      } else if (dura[1].length == 1) {
        dura[1] = `${dura[1]}0`;
      }
      else{
        duration.innerText = `${dura[0]}:${dura[1]}`;
      }
      let total = secondToMilisecond(dura[0]) + minutesToMiliseconds(dura[1]);
      console.log(total);
      let current = 0;
      let Onepercent = total * 1 / 100;
      console.log(Onepercent);
    let range =  setInterval(() =>{
        console.log("hello");
        current +=Onepercent/10;
        timeline.value = current;
        timeline.max = total;
        console.log(current) 
        if (current >= total) {
          current = 0;
          timeline.value = 0;
          audio.pause();
          song.play = false;
          range = clearInterval(range);
        }
      },1000);

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
  let index = e.target.closest(".item").id;
  playlist1.loadToPlayer(index);
  playlist1.playSong(index);
});
