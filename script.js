class Song {
  constructor(filePath, title, artist, lyrics, poster, duration) {
    this.filePath = filePath;
    this.title = title;
    this.artist = artist;
    this.lyrics = lyrics;
    this.poster = poster;
    this.duration = duration;
    this.isPlaying = false;
  }
}

let audio = null;
let playlist1 = null;
let currentIndex = 0;
let lyricsLoadedIndex = null;
const musicPlayerBox = document.querySelector(".music-player");

class Playlist {
  constructor() {
    this.songs = [];
    this.range = null;
    this.currentTime = 0;
  }

  addSong(song) {
    this.songs.push(song);
  }

  showListOfSongs() {
    const playlistCont = document.querySelector(".playlist-cont");
    playlistCont.innerHTML = `
      <div class="music-loader">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>`;
    const loader = document.querySelector(".music-loader");
    loader.style.display = "flex";
    playlistCont.style.display = "flex";
    playlistCont.style.alignItems = "center";
    playlistCont.style.justifyContent = "center";

    setTimeout(() => {
      loader.style.display = "none";
      playlistCont.style.display = "block";
      this.songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("id", index);
        item.innerHTML = `
          <div class="item-img"><img src="${song.poster}"></div>
          <div class="item-details"><h3>${song.title}</h3><p>${song.artist}</p></div>`;
        playlistCont.append(item);
      });
    }, 1500);
  }

  loadToPlayer(index) {
    document.querySelector(".pulse").style.display = "none";

    // Clear existing interval
    if (this.range) {
      clearInterval(this.range);
      this.range = null;
    }

    // Reset currentTime and timeline
    this.currentTime = 0;
    const timeline = document.querySelector("#timeline");
    timeline.value = 0;

    const song = this.songs[index];
    const img = document.querySelector(".album-poster");
    const title = document.querySelector(".song-title");
    const artist = document.querySelector(".song-artist");
    const lyricsPara = document.querySelector(".lyrics-paragraph");
    const duration = document.querySelector(".duration");
    const playPause = document.querySelector(".play-pause");
    const controls = document.querySelector(".controls");
    const lyrics = document.querySelector(".lyrics");

    controls.style.position = "absolute";
    controls.style.bottom = "40px";
    controls.style.left = "42.5%";
    controls.style.transform = "scale(1.5)";
    controls.style.transition = "all 0.5s ease-in-out";
    playPause.innerHTML = `<i class="ri-pause-line"></i>`;
    playPause.setAttribute("id", index);
    img.setAttribute("src", song.poster);
    title.innerText = song.title;
    artist.innerText = song.artist;
    let curr = document.querySelector(".current-time");
    const prevIndex = index === 0 ? this.songs.length - 1 : index - 1;
    const nextIndex = index === this.songs.length - 1 ? 0 : index + 1;
    document.querySelector(".prev").setAttribute("id", prevIndex);
    document.querySelector(".next").setAttribute("id", nextIndex);

    lyrics.style.display = "flex";
    lyrics.style.alignItems = "center";
    lyrics.style.justifyContent = "center";
    lyricsPara.innerHTML = `
      <div class="music-loader">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>`;
    if (lyricsLoadedIndex !== index) {
      setTimeout(() => {
        lyrics.style.display = "block";
        lyrics.style.overflowY = "scroll";
        lyrics.style.padding = "1rem";
        lyricsPara.innerText = song.lyrics;
        lyricsLoadedIndex = index;
      }, 2500);
    } else {
      lyricsPara.innerText = song.lyrics;
      lyrics.style.display = "block";
      lyrics.style.overflowY = "scroll";
      lyrics.style.padding = "1rem";
    }

    getRandomBlueGreyBackground();

    const dura = String(song.duration).split(".");
    const mins = parseInt(dura[0]);
    const secs = dura[1] ? parseInt(dura[1].padEnd(2, "0")) : 0;
    const totalMs = mins * 60 * 1000 + secs * 1000;
    timeline.max = totalMs;

    // Update progress bar
    this.range = setInterval(() => {
      if (audio && !audio.paused) {
        this.currentTime = audio.currentTime * 1000;
        timeline.value = this.currentTime;
        const currentMins = Math.floor(this.currentTime / 60000);
        const currentSecs = Math.floor((this.currentTime % 60000) / 1000);
        curr.innerText = `${currentMins}:${currentSecs
          .toString()
          .padStart(2, "0")}`;
        duration.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;
        if (this.currentTime >= audio.duration * 1000) {
          clearInterval(this.range);
          this.range = null;
          timeline.value = 0;
          audio.pause();
          song.isPlaying = false;
          playPause.innerHTML = `<i class="ri-play-circle-fill"></i>`;
        }
      }
    }, 100);
  }
}

function getRandomBlueGreyBackground() {
  const colors = [
    `rgba(0, 123, 255, 0.2)`,
    `rgba(108, 117, 125, 0.15)`,
    `rgba(40, 167, 69, 0.2)`,
    `rgba(255, 193, 7, 0.15)`,
    `rgba(220, 53, 69, 0.15)`,
    `rgba(111, 66, 193, 0.2)`,
    `rgba(23, 162, 184, 0.15)`,
  ];
  const shuffled = colors.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  const gradient = `linear-gradient(135deg, ${selected.join(", ")})`;
  document.querySelector(".top").style.background = gradient;
}

async function loadSongs() {
  try {
    const response = await fetch("./songs.json");
    const textData = await response.text();
    const data = JSON.parse(textData);
    playlist1 = new Playlist();
    data.forEach((val) => {
      const song = new Song(
        val.filePath,
        val.title,
        val.artist,
        val.lyrics,
        val.poster,
        val.duration
      );
      playlist1.addSong(song);
    });
    playlist1.showListOfSongs();
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

function handleItemClick(e) {
  const itemElement = e.target.closest(".item");
  if (!itemElement) return;

  const targetIndex = parseInt(itemElement.id);
  const currentPlayingIndex = playlist1.songs.findIndex((s) => s.isPlaying);

  if (currentPlayingIndex === targetIndex) {
    audio.pause();
    playlist1.songs[targetIndex].isPlaying = false;
    document.querySelector(
      ".play-pause"
    ).innerHTML = `<i class="ri-play-circle-fill"></i>`;
    document.querySelector(".music-player").classList.remove("animate-shadow");
    clearInterval(playlist1.range);
    playlist1.range = null;
  } else {
    if (audio) audio.pause();
    if (currentPlayingIndex !== -1) {
      playlist1.songs[currentPlayingIndex].isPlaying = false;
    }
    const newSong = playlist1.songs[targetIndex];
    audio = new Audio(newSong.filePath);
    audio.play();
    document.querySelector(".music-player").classList.add("animate-shadow");
    newSong.isPlaying = true;
    playlist1.loadToPlayer(targetIndex);
    getRandomBlueGreyBackground();
  }
}

function handlePlayPause(e) {
  const button = e.target.closest(".play-pause");
  if (!button) return;
  const index = parseInt(e.target.closest(".play-pause").id);
  const song = playlist1.songs[index];
  if (audio.paused) {
    audio.play();
    
    // Restart interval to resume tracking time
    if (!playlist1.range) {
      playlist1.range = setInterval(() => {
        const timeline = document.querySelector("#timeline");
        const curr = document.querySelector(".current-time");
        const duration = document.querySelector(".duration");

        playlist1.currentTime = audio.currentTime * 1000;
        timeline.value = playlist1.currentTime;

        const currentMins = Math.floor(playlist1.currentTime / 60000);
        const currentSecs = Math.floor((playlist1.currentTime % 60000) / 1000);
        curr.innerText = `${currentMins}:${currentSecs
          .toString()
          .padStart(2, "0")}`;

        const mins = Math.floor(audio.duration / 60);
        const secs = Math.floor(audio.duration % 60);
        duration.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;

        if (playlist1.currentTime >= audio.duration * 1000) {
          clearInterval(playlist1.range);
          playlist1.range = null;
          timeline.value = 0;
          audio.pause();
          document.querySelector(".play-pause").innerHTML =
            `<i class="ri-play-circle-fill"></i>`;
        }
      }, 100);
    }

  } else {
    audio.pause();
    if (playlist1.range) {
      clearInterval(playlist1.range);
      playlist1.range = null;
    }
  }


  // If the song is currently playing
  if (song.isPlaying) {
    audio.pause();
    song.isPlaying = false;
    musicPlayerBox.classList.remove("animate-shadow");
    clearInterval(playlist1.range);
    playlist1.range = null;
    e.target.closest(".play-pause").innerHTML = `<i class="ri-play-circle-fill"></i>`;
  } else {
    if (!audio || audio.src !== location.origin + "/" + song.filePath) {
      if (audio) audio.pause();
      audio = new Audio(song.filePath);
      audio.currentTime = playlist1.currentTime / 1000;
      playlist1.songs.forEach((s) => (s.isPlaying = false));
      song.isPlaying = true;
      playlist1.loadToPlayer(index);
    }
    audio.play();
    musicPlayerBox.classList.add("animate-shadow");
    song.isPlaying = true;
    e.target.closest(".play-pause").innerHTML = `<i class="ri-pause-line"></i>`;
  }
}

function handlePrev(e) {
  if (audio) audio.pause();
  const index = parseInt(
    document.querySelector(".play-pause").getAttribute("id")
  );
  const prevIndex = index === 0 ? playlist1.songs.length - 1 : index - 1;
  const prevSong = playlist1.songs[prevIndex];
  playlist1.currentTime = 0;
  if (index !== -1) {
    playlist1.songs[index].isPlaying = false;
  }
  audio = new Audio(prevSong.filePath);
  audio.play();
  prevSong.isPlaying = true;
  document.querySelector(".play-pause").setAttribute("id", prevIndex);
  playlist1.loadToPlayer(prevIndex);
  getRandomBlueGreyBackground();
}

function handleNext(e) {
  if (audio) audio.pause();
  const index = parseInt(
    document.querySelector(".play-pause").getAttribute("id")
  );
  const nextIndex = index === playlist1.songs.length - 1 ? 0 : index + 1;
  const nextSong = playlist1.songs[nextIndex];
  playlist1.currentTime = 0;
  if (index !== -1) {
    playlist1.songs[index].isPlaying = false;
  }
  audio = new Audio(nextSong.filePath);
  audio.play();
  nextSong.isPlaying = true;
  document.querySelector(".play-pause").setAttribute("id", nextIndex);
  playlist1.loadToPlayer(nextIndex);
  getRandomBlueGreyBackground();
}

function handleSearchMusic() {
  const existing = document.querySelector(".found-song");
  if (existing) existing.remove();

  const value = document
    .querySelector("#music-input")
    .value.trim()
    .toLowerCase();
    console.log(value);
  const searchBtn = document.querySelector("#searchBtn");
  if (value.length === 0) {
    searchBtn.setAttribute("class", "ri-search-line");
    return;
  }

  const matchedSongs = playlist1.songs.filter((song) =>
    song.title.toLowerCase().includes(value)
  );
  const found = document.createElement("div");
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
  matchedSongs.forEach((song) => {
    const idx = playlist1.songs.findIndex((s) => s.title === song.title);
    const item = document.createElement("div");
    item.classList.add("item");
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
      </div>`;
    found.append(item);
  });
}

function handleCategorySearch() {
  const value = document
    .querySelector("#category-input")
    .value.trim()
    .toLowerCase();
  const searchBtn = document.querySelector("#searchBtn");
  const existing = document.querySelector(".found2-song");
  if (existing) existing.remove();

  if (value.length === 0) {
    searchBtn.setAttribute("class", "ri-search-line");
    return;
  }
  searchBtn.setAttribute("class", "ri-close-line");

  const matchedCategories = playlist1.songs.filter(
    (song) => song.artist.toLowerCase() === value
  );
  const found2 = document.createElement("div");
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

  searchBtn.setAttribute("class", "ri-close-line");
  const h1 = document.createElement("h1");
  h1.style.fontSize = "1.2rem";
  found2.append(h1);
  matchedCategories.forEach((song) => {
    const idx = playlist1.songs.findIndex((s) => s.artist === song.artist);
    h1.innerText = song.artist;
    const item = document.createElement("div");
    item.classList.add("item");
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
      </div>`;
    found2.append(item);
  });
}
document.querySelector("#music-input").addEventListener("input", () =>{
  handleSearchMusic();
  console.log("searching music");
});
document.querySelector("#category-input").addEventListener("input", () => handleCategorySearch());
window.addEventListener("load", () => {
  loadSongs();
});

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (main) {
    main.addEventListener("click", handleItemClick);
  }

  document
    .querySelector(".play-pause")
    .addEventListener("click", handlePlayPause);
  document.querySelector(".prev").addEventListener("click", handlePrev);
  document.querySelector(".next").addEventListener("click", handleNext);
  document
    .querySelector("#music-input")
    .addEventListener("input", handleSearchMusic);
  document
    .querySelector("#category-input")
    .addEventListener("input", handleCategorySearch);
  document.querySelector("#timeline").addEventListener("input", (e) => {
    if (audio) {
      const newTime = e.target.value / 1000;
      audio.currentTime = newTime;
      playlist1.currentTime = e.target.value;
    }
  });

  document.querySelector("#searchBtn").addEventListener("click", () => {
    const musicInput = document.querySelector("#music-input");
    const categoryInput = document.querySelector("#category-input");
    const found = document.querySelector(".found-song");
    const found2 = document.querySelector(".found2-song");
    const searchBtn = document.querySelector("#searchBtn");

    if (musicInput.value.length > 0 || categoryInput.value.length > 0) {
      musicInput.value = "";
      categoryInput.value = "";
      if (found) found.remove();
      if (found2) found2.remove();
      searchBtn.setAttribute("class", "ri-search-line");
    }
  });

  if (audio) {
    audio.addEventListener("ended", () => {
      document.querySelector(".next").click();
    });
    audio.addEventListener("error", () => {
      console.error("Failed to load audio:", audio.src);
      alert("Error loading song.");
      document.querySelector(".next").click();
    });
  }
});

function updateLayout() {
  let main = document.querySelector("main");

  if (parseInt(getComputedStyle(main).width) <= 550) {
    document.querySelector(".logo").innerHTML = `
      <div>
        <i class="ri-netease-cloud-music-line"></i>
        <p>MusAI</p>
      </div>
      <input type="text" id="music-input" autocomplete="off" placeholder="Search Music">`;

    document.querySelector(".nav-input").innerHTML = `
      <input type="text" id="category-input" autocomplete="off"
        placeholder="Search Music By Artist , Genres etc.">
      <i id="searchBtn" class="ri-search-line"></i>`;
  } else {
    document.querySelector(".logo").innerHTML = `
      <div>
        <i class="ri-netease-cloud-music-line"></i>
        <p>MusAI</p>
      </div>`;

    document.querySelector(".nav-input").innerHTML = `
      <input type="text" id="music-input" autocomplete="off" placeholder="Search Music">
      <input type="text" id="category-input" autocomplete="off"
        placeholder="Search Music By Artist , Genres etc.">
      <i id="searchBtn" class="ri-search-line"></i>`;
  }

  // 🔁 Re-attach event listeners after changing HTML
  document.querySelector("#music-input").addEventListener("input",()=> handleSearchMusic());
  document.querySelector("#category-input").addEventListener("input",()=> handleCategorySearch());
  document.querySelector("#searchBtn").addEventListener("click", () => {
    const musicInput = document.querySelector("#music-input");
    const categoryInput = document.querySelector("#category-input");
    const found = document.querySelector(".found-song");
    const found2 = document.querySelector(".found2-song");
    const searchBtn = document.querySelector("#searchBtn");

    if (musicInput.value.length > 0 || categoryInput.value.length > 0) {
      musicInput.value = "";
      categoryInput.value = "";
      if (found) found.remove();
      if (found2) found2.remove();
      searchBtn.setAttribute("class", "ri-search-line");
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  updateLayout(); // Run on page load
});

window.addEventListener("resize", () => {
  updateLayout(); // Run on screen resize
});
