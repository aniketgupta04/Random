const pages = [...document.querySelectorAll(".page")];
const audio = document.getElementById("site-audio");
const musicToggle = document.getElementById("music-toggle");
let currentPageId = "page-1";
let pageHistory = [];
let userStartedMusic = false;

function showPage(id, addToHistory = true) {
  if (!document.getElementById(id) || id === currentPageId) return;

  if (addToHistory) {
    pageHistory.push(currentPageId);
  }

  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  currentPageId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  const previousPageId = pageHistory.pop();

  if (previousPageId) {
    showPage(previousPageId, false);
  }
}

function updateMusicButton(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}

function playMusicAfterInteraction() {
  if (!audio || userStartedMusic) return;

  userStartedMusic = true;
  audio.play()
    .then(() => updateMusicButton(true))
    .catch(() => updateMusicButton(false));
}

document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", () => {
    playMusicAfterInteraction();
    const nextPageNumber = Number(currentPageId.replace("page-", "")) + 1;
    showPage(`page-${Math.min(nextPageNumber, 6)}`);
  });
});

document.querySelectorAll(".back-btn").forEach(button => {
  button.addEventListener("click", goBack);
});

document.getElementById("open-envelope").addEventListener("click", event => {
  playMusicAfterInteraction();
  event.currentTarget.classList.toggle("open");
});

document.getElementById("yes-btn").addEventListener("click", () => {
  playMusicAfterInteraction();
  showPage("page-yes");
});

document.getElementById("no-btn").addEventListener("click", () => {
  playMusicAfterInteraction();
  showPage("page-no");
});

document.querySelectorAll(".restart").forEach(button => {
  button.addEventListener("click", () => {
    pageHistory = [];
    showPage("page-1", false);
  });
});

musicToggle.addEventListener("click", () => {
  if (!audio) return;

  userStartedMusic = true;

  if (audio.paused) {
    audio.play()
      .then(() => updateMusicButton(true))
      .catch(() => updateMusicButton(false));
  } else {
    audio.pause();
    updateMusicButton(false);
  }
});

if (audio) {
  audio.addEventListener("pause", () => updateMusicButton(false));
  audio.addEventListener("play", () => updateMusicButton(true));
  audio.addEventListener("error", () => {
    musicToggle.hidden = true;
  });
}
