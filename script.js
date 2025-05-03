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
let audio;
let i = document.querySelector(".play-pause i");
class playlist {
  constructor() {
    this.songs = [];
    this.range = null;
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
  loadToPlayer(index) {
    function secondToMilisecond(second) {
      let milisecond = second * 1000;
      return milisecond;
    }
    function minutesToMiliseconds(minutes) {
      let milisecond = minutes * 60 * 1000;
      return milisecond;
    }


    let song = this.songs[index];
    let img = document.querySelector(".album-poster");
    let title = document.querySelector(".song-title");
    let artist = document.querySelector(".song-artist");
    let lyricsPara = document.querySelector(".lyrics-paragraph");
    let duration = document.querySelector(".duration");
    let timeline = document.querySelector("#timeline"); //timeline for music input[range]
    let PlayPause = document.querySelector(".play-pause");
    let controls = document.querySelector(".controls");
    controls.style.position = "absolute";
    controls.style.bottom = "40px";
    controls.style.left = "42.5%";
    controls.style.transform = "scale(1.5)";
    controls.style.transition = "all 0.5s ease-in-out";
    PlayPause.innerHTML = `<i class="ri-pause-line"></i>`;
    PlayPause.setAttribute("id", index);
    img.setAttribute("src", song.poster);
    title.innerText = song.title;
    artist.innerText = song.artist;
    lyricsPara.innerText = song.lyrics;


    let dura = String(song.duration).split(".");
    console.log(dura);
    let mins = parseInt(dura[0]);
    let secs = dura[1] ? parseInt(dura[1].padEnd(2, "0")) : 0;
    // Update text duration
    duration.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;

    // Convert to total ms
    let total = minutesToMiliseconds(mins) + secondToMilisecond(secs);
    timeline.max = total;
    let current = 0;
    if (this.range) clearInterval(this.range);
    this.range = setInterval(() => {
      current += 1000; 
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
    let data = await JSON.parse(textData); 
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
  if (playlist1.songs.some((s) => s.Isplay == true)) {
    let index = playlist1.songs.findIndex((s) => s.Isplay == true);
    let song = playlist1.songs[index];
    if (index == target) {
      audio.pause();
      song.Isplay = false;
      document.querySelector(
        ".play-pause"
      ).innerHTML = `<i class="ri-play-circle-fill"></i>`;
    } else {
      audio.pause();
      song.Isplay = false;
      let newSong = playlist1.songs[target];
      audio = new Audio(newSong.filePath);
      audio.play();
      newSong.Isplay = true;
      playlist1.loadToPlayer(target);
    }
  } else {
    let index = e.target.closest(".item").id;
    let song = playlist1.songs[index];
    console.log(song);
    if (playlist1.songs.some((s) => (song == s ? s.Isplay : NaN)) == false) {
      audio = new Audio(song.filePath);
      audio.play();
      console.log(audio);
      song.Isplay = true;
    }
  }
});

document.querySelector(".play-pause").addEventListener("click", (e) => {
  let index = Number(e.target.id);
  let song = playlist1.songs[index];

  if (song.Isplay == true) {
    audio.pause();
    song.Isplay = false;
    document.querySelector(
      ".play-pause"
    ).innerHTML = `<i class="ri-play-circle-fill"></i>`;
  } else {
    audio.play();
    song.Isplay = true;
    e.target.innerHTML = "";
    document.querySelector(
      ".play-pause"
    ).innerHTML = `<i class="ri-pause-line"></i>`;
  }
});

let musicInput = document.querySelector("#music-input");
function SearchMusic() {
    let existing = document.querySelector(".found-song");
    if (existing) existing.remove();
  
    let value = document.querySelector("#music-input").value.trim().toLowerCase();
    if (value.length === 0) return;
  
    // Find all matching songs (partial match)
    let matchedSongs = playlist1.songs.filter(song =>
      song.title.toLowerCase().includes(value)
    );
  console.log(matchedSongs);
    let found = document.createElement("div");
    found.classList.add("found-song");
    found.style.position = "absolute";
    found.style.display = "flex";
    found.style.flexDirection = "column";
    found.style.alignItems = "center";
    found.style.overflowY = "scroll";
    found.style.backdropFilter = "blur(20px)";
    found.style.width = "300px";
    found.style.top = "-32px";
    found.style.left = "38%";
    found.style.padding = "2rem 1rem";
    found.style.borderRadius = "12px";
    found.style.zIndex = "1000";
    found.style.transition = "all 0.5s ease-in-out";
    document.querySelector("section").append(found);
    
    if (matchedSongs.length === 0) {
      found.innerHTML = `<h3 style="margin:auto;">Song not found</h3>`;
      return;
    }
  
    // Show all matched songs
    matchedSongs.forEach((song, index) => {
      let item = document.createElement("div");
      item.classList.add("item");
      item.setAttribute("id", index);
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "1rem";
      item.style.padding = "0.5rem";
      item.style.borderRadius = "8px";
      item.style.background = "#fff2";
  
      item.innerHTML = `
        <div class="item-img" style="width: 50px;">
          <img src="${song.poster}" style="width: 100%; border-radius: 6px;">
        </div>
        <div class="item-details">
          <h4 style="margin: 0;">${song.title}</h4>
          <p style="margin: 0; font-size: 0.85rem;">${song.artist}</p>
        </div>
      `;
      found.append(item);
    });
  
}
musicInput.addEventListener("input", () => SearchMusic());

let CategoryInput = document.querySelector("#category-input");

CategoryInput.addEventListener("input", () => {
  let value = document.querySelector("#category-input").value.trim().toLowerCase();
  console.log(value);

  let existing = document.querySelector(".found2-song");
  if (existing) existing.remove();
  if (value.length === 0) return;

  let matchedCategories = playlist1.songs.filter(song =>
    song.artist.toLowerCase() === value
  );

  console.log(matchedCategories);

  let found2 = document.createElement("div");
  found2.classList.add("found2-song");
  found2.style.position = "absolute";
  found2.style.display = "flex";
  found2.style.flexDirection = "column";
  found2.style.alignItems = "center";
  found2.style.overflowY = "scroll";
  found2.style.backdropFilter = "blur(20px)";
  found2.style.width = "480px";
  found2.style.top = "-32px";
  found2.style.left = "61.5%";
  found2.style.padding = "2rem 1rem";
  found2.style.borderRadius = "12px";
  found2.style.zIndex = "1000";
  found2.style.transition = "all 0.5s ease-in-out";
  document.querySelector("section").append(found2);

  if (matchedCategories.length === 0) {
    found2.innerHTML = `<h3 style="margin:auto;">Artist not found</h3>`;
    return;
  }
  let h1 = document.createElement("h1");
  found2.append(h1);

  matchedCategories.forEach((song, index) => {
    let item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("id", index);
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "1rem";
    item.style.padding = "0.5rem";
    item.style.borderRadius = "8px";
    item.style.background = "#fff2";

    h1.innerText = song.artist;
    h1.style.fontSize = "1.2rem";

    item.innerHTML = `
      <div class="item-img" style="width: 50px;">
        <img src="${song.poster}" style="width: 100%; border-radius: 6px;">
      </div>
      <div class="item-details">
        <h4 style="margin: 0;">${song.title}</h4>
      </div>
    `;
    found2.append(item);
  });
});
