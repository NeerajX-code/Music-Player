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

let audio;
let current;
let currentIndex = 0;
let i = document.querySelector(".play-pause i");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

class playlist {
  constructor() {
    this.songs = [];
    this.range = null;
    this.currentTime = 0;
  }
  addSong(song) {
    this.songs.push(song);
  }
  showListOfSongs() {
    let playlistCont = document.querySelector(".playlist-cont");
    playlistCont.innerHTML = `<div class="music-loader">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`;
    let loader = document.querySelector(".music-loader");
    loader.style.display = "block";
    playlistCont.style.display = "flex";
    playlistCont.style.alignItems = "center";
    playlistCont.style.justifyContent = "center";
    setTimeout(() => {
      loader.style.display = "none";
      playlistCont.style.display = "block";
      this.songs.forEach((song, index) => {
        let item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("id", index);
        item.innerHTML = `<div class="item-img"> <img src="${song.poster}"> </div> <div class="item-details"><h3>${song.title}</h3><p>${song.artist}</div>`;
        playlistCont.append(item);
      });
    }, 2500);
  }
  loadToPlayer(index) {
    document.querySelector(".pulse").style.display = "none";
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
    let lyrics = document.querySelector(".lyrics");

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
    let Previndex =
      index == 0 ? Number(this.songs.length) - 1 : Number(index) - 1;
    console.log(Previndex);
    let Nextindex =
      index == Number(this.songs.length) - 1 ? 0 : Number(index) + 1;
    console.log(Nextindex);
    prev.setAttribute("id", Previndex);
    next.setAttribute("id", Nextindex);
    lyrics.style.display = "flex";
    lyrics.style.alignItems = "center";
    lyrics.style.justifyContent = "center";
    lyricsPara.innerHTML = `
    <div class="music-loader">
       <span></span>
       <span></span>
       <span></span>
       <span></span>
       <span></span>
       <span></span>
       <span></span>
     </div>`;
    setTimeout(() => {
      lyrics.style.display = "block";
      lyrics.style.overflowY = "scroll";
      lyrics.style.padding = "1rem";
      lyricsPara.innerText = song.lyrics;
    }, 2500);
    getRandomBlueGreyBackground();
    let dura = String(song.duration).split(".");
    let mins = parseInt(dura[0]);
    let secs = dura[1] ? parseInt(dura[1].padEnd(2, "0")) : 0;
    // Update text duration
    duration.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;

    // Convert to total ms
    let total = minutesToMiliseconds(mins) + secondToMilisecond(secs);
    timeline.max = total;
    playlist1.range = setInterval(() => {
      playlist1.currentTime += 1000;
      if (playlist1.currentTime > audio.duration * 1000) {
        clearInterval(playlist1.range);
        timeline.value = 0;
        audio.pause();
        song.Isplay = false;
      } else {
        timeline.value = playlist1.currentTime;
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
  playlist1.showListOfSongs();
  // Show the list of songs in the console
};
function getRandomBlueGreyBackground() {
  const colors = [
    `rgba(0, 123, 255, 0.2)`, // Soft Blue
    `rgba(108, 117, 125, 0.15)`, // Soft Grey
    `rgba(40, 167, 69, 0.2)`, // Soft Green
    `rgba(255, 193, 7, 0.15)`, // Soft Yellow
    `rgba(220, 53, 69, 0.15)`, // Soft Red
    `rgba(111, 66, 193, 0.2)`, // Soft Purple
    `rgba(23, 162, 184, 0.15)`, // Soft Cyan
  ];
  const shuffled = colors.sort(() => 0.5 - Math.random());
  console.log(shuffled);
  const selected = shuffled.slice(0, 3);
  const gradient = `linear-gradient(135deg, ${selected.join(", ")})`;

  let top = document.querySelector(".top");
  top.style.background = gradient;
}

window.addEventListener("load", () => {
  showMusic();
});
function ClickItems(e) {
  let itemElement = e.target.closest(".item");
  if (!itemElement) return; // Exit if no .item element is found

  let target = itemElement.id;
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
      getRandomBlueGreyBackground();
    }
  } else {
    let index = itemElement.id;
    let song = playlist1.songs[index];
    playlist1.loadToPlayer(index);
    if (playlist1.songs.some((s) => (song == s ? s.Isplay : NaN)) == false) {
      audio = new Audio(song.filePath);
      audio.play();
      song.Isplay = true;
    }
  }
}

document.querySelector(".play-pause").addEventListener("click", (e) => {
  let index = Number(e.target.closest(".play-pause").id);
  let song = playlist1.songs[index];

  if (song.Isplay) {
    audio.pause();
    song.Isplay = false;
    clearInterval(playlist1.range);
    e.target.closest(".play-pause").innerHTML = `<i class="ri-play-circle-fill"></i>`;
  } else {
    let songIndex = playlist1.songs.findIndex((s) => s.title == song.title);
    audio.currentTime = playlist1.currentTime / 1000;
    if (audio) audio.pause();
    audio = new Audio(song.filePath);
    playlist1.range = setInterval(() => {
      playlist1.currentTime += 1000;
      if (playlist1.currentTime > audio.duration * 1000) {
        clearInterval(playlist1.range);
        timeline.value = 0;
        audio.pause();
        song.Isplay = false;
      } else {
        timeline.value = playlist1.currentTime;
      }
    }, 1000);
    audio.play();
    song.Isplay = true;
    e.target.closest(".play-pause").innerHTML = `<i class="ri-pause-line"></i>`;
    if (songIndex !== index) {
      playlist1.loadToPlayer(index);
      getRandomBlueGreyBackground();
    }
  }
});

let musicInput = document.querySelector("#music-input");
let searchBtn = document.querySelector("#searchBtn");
function SearchMusic() {
  let existing = document.querySelector(".found-song");
  if (existing) existing.remove();

  let value = document.querySelector("#music-input").value.trim().toLowerCase();
  if (value.length === 0) {
    searchBtn.setAttribute("class", "ri-search-line");
    return;
  }

  // Find all matching songs (partial match)
  let matchedSongs = playlist1.songs.filter((song) =>
    song.title.toLowerCase().includes(value)
  );
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
  searchBtn.setAttribute("class", "ri-close-line");
  // Show all matched songs
  matchedSongs.forEach((song, index) => {
    let item = document.createElement("div");
    item.classList.add("item");
    let idx = playlist1.songs.findIndex((s) => s.title == song.title);
    item.setAttribute("id", idx);
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

document.addEventListener("DOMContentLoaded", () => {
  const songElement = document.querySelector("main");
  if (songElement) {
    songElement.addEventListener("click", (e) => ClickItems(e));
  }
});
let CategoryInput = document.querySelector("#category-input");

CategoryInput.addEventListener("input", () => {
  let value = document
    .querySelector("#category-input")
    .value.trim()
    .toLowerCase();

  let existing = document.querySelector(".found2-song");
  if (existing) existing.remove();
  if (value.length === 0) {
    searchBtn.setAttribute("class", "ri-search-line");
    return;
  }

  let matchedCategories = playlist1.songs.filter(
    (song) => song.artist.toLowerCase() === value
  );


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

  searchBtn.setAttribute("class", "ri-close-line");
  if (matchedCategories.length === 0) {
    found2.innerHTML = `<h3 style="margin:auto;">Artist not found</h3>`;
    return;
  }
  let h1 = document.createElement("h1");
  found2.append(h1);
  matchedCategories.forEach((song, index) => {
    let item = document.createElement("div");
    item.classList.add("item");
    let idx = playlist1.songs.findIndex((s) => s.artist == song.artist);
    item.setAttribute("id", idx);
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

searchBtn.addEventListener("click", () => {
  searchBtn.addEventListener("click", () => {
    let found = document.querySelector(".found-song");
    let found2 = document.querySelector(".found2-song");
  
    if (musicInput.value.length > 0 || CategoryInput.value.length > 0) {
      musicInput.value = "";
      CategoryInput.value = "";
  
      if (found) found.remove();
      if (found2) found2.remove();
  
      searchBtn.setAttribute("class", "ri-search-line");
    }
  });
});

prev.addEventListener("click", (e) => {
  if (audio) audio.pause();
  let index = Number(document.querySelector(".play-pause").getAttribute("id"));
  let prevIndex = index === 0 ? playlist1.songs.length - 1 : index - 1;
  let prevSong = playlist1.songs[prevIndex];
  audio = new Audio(prevSong.filePath);
  audio.play();
  prevSong.Isplay = true;
  document.querySelector(".play-pause").setAttribute("id", prevIndex);
  playlist1.loadToPlayer(prevIndex);
  getRandomBlueGreyBackground();
});

next.addEventListener("click", (e) => {
  if (audio) audio.pause();
  let index = Number(document.querySelector(".play-pause").getAttribute("id"));
  let nextIndex = index === playlist1.songs.length - 1 ? 0 : index + 1;
  let nextSong = playlist1.songs[nextIndex];
  audio = new Audio(nextSong.filePath);
  audio.play();
  nextSong.Isplay = true;
  document.querySelector(".play-pause").setAttribute("id", nextIndex);
  playlist1.loadToPlayer(nextIndex);
  getRandomBlueGreyBackground();
});
