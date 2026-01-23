const USER_ID = "1434593822536503387";
const spotify = document.getElementById("spotify");
const ws = new WebSocket("wss://api.lanyard.rest/socket");

const fallback = document.getElementById("fallback");
const cover = document.getElementById("cover");
const song = document.getElementById("song");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");

let start = 0;
let end = 0;
let interval = null;

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: 2,
    d: { subscribe_to_id: USER_ID }
  }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (!msg.d) return;

  const data = msg.d;

  if (data.spotify) {
    fallback.style.display = "none";
    spotify.classList.remove("hidden");

    cover.src = data.spotify.album_art_url;
    song.textContent = data.spotify.song;
    artist.textContent = data.spotify.artist;

    start = data.spotify.timestamps.start;
    end = data.spotify.timestamps.end;

    clearInterval(interval);
    updateProgress();
    interval = setInterval(updateProgress, 1000);
  } else {
    spotify.classList.add("hidden");
    fallback.style.display = "block";
    fallback.textContent = "No Spotify activity";
    clearInterval(interval);
  }
};

function updateProgress() {
  const now = Date.now();
  const percent = Math.min(
    100,
    ((now - start) / (end - start)) * 100
  );
  progress.style.width = percent + "%";
}

document.addEventListener("DOMContentLoaded", () => {
  const USER_ID = "1434593822536503387";
  const API_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`;

  const dot = document.getElementById("rpcDot");
  const statusText = document.getElementById("rpcStatusText");

  const statusColor = {
    online: "#3ba55d",
    idle: "#faa61a",
    dnd: "#ed4245",
    offline: "#747f8d"
  };

  function statusLabel(s) {
    return s === "online" ? "Online"
         : s === "idle" ? "Idle"
         : s === "dnd" ? "Do Not Disturb"
         : "Offline";
  }

  async function updateStatus() {
    try {
      const res = await fetch(`${API_URL}?_=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = json.data;
      if (!data) throw new Error("No data");

      const status = data.discord_status || "offline";

      dot.style.background = statusColor[status] || statusColor.offline;
      statusText.textContent = statusLabel(status);

    } catch (e) {
      console.error("Status update failed:", e);
      dot.style.background = statusColor.offline;
      statusText.textContent = "Error";
    }
  }

  updateStatus();
  setInterval(updateStatus, 1000);
});

