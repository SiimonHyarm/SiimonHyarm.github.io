const SOUND_ICON = "https://thumbs.dreamstime.com/b/red-button-sign-stock-vector-130152563.jpg";

async function loadSounds() {
  const res = await fetch("sounds.json");
  const data = await res.json();
  return data.sounds;
}

function extractInfo(filePath) {
  const parts = filePath.split("/");
  const category = parts[1];
  const fileName = parts.pop().replace(/\.[^/.]+$/, "");
  const name = fileName.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return { name, category, file: filePath };
}

function renderCategories(categories) {
  const container = document.getElementById("category-buttons");
  container.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-light";
    btn.textContent = cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.category = cat;
    btn.onclick = () => filterSounds(cat);
    container.appendChild(btn);
  });
  container.querySelector('[data-category="all"]').classList.add("active");
}

function renderSounds(sounds) {
  const board = document.getElementById("soundboard");
  board.innerHTML = "";
  sounds.forEach(({ name, file }) => {
    const btn = document.createElement("button");
    btn.className = "sound-btn text-center";

    btn.innerHTML = `
      <img src="${SOUND_ICON}" alt="${name}" class="sound-img">
      <span class="sound-label">${name}</span>
    `;
    btn.onclick = () => new Audio(file).play();
    board.appendChild(btn);
  });
}

let allSounds = [];

function filterSounds(category) {
  document.querySelectorAll("#category-buttons .btn").forEach(b =>
    b.classList.toggle("active", b.dataset.category === category)
  );
  if (category === "all") renderSounds(allSounds);
  else renderSounds(allSounds.filter(s => s.category === category));
}

(async function init() {
  const soundFiles = await loadSounds();
  allSounds = soundFiles.map(extractInfo);

  const categories = ["all", ...new Set(allSounds.map(s => s.category))];
  renderCategories(categories);
  renderSounds(allSounds);
})();
