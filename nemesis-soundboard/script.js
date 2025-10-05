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
  const menu = document.getElementById("categoryMenu");
  menu.innerHTML = "";

  categories.forEach(cat => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    a.href = "#";
    a.onclick = (e) => {
      e.preventDefault();
      document.getElementById("categoryDropdown").textContent = a.textContent;
      filterSounds(cat);
    };
    li.appendChild(a);
    menu.appendChild(li);
  });
}

function renderSounds(sounds) {
  const board = document.getElementById("soundboard");
  board.innerHTML = "";
  if (sounds.length === 0) {
    board.innerHTML = `<p class="text-secondary text-center">No sounds found in this category.</p>`;
    return;
  }

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
  const filtered = allSounds.filter(s => s.category === category);
  renderSounds(filtered);
}

(async function init() {
  const soundFiles = await loadSounds();
  allSounds = soundFiles.map(extractInfo);

  const categories = [...new Set(allSounds.map(s => s.category))];
  renderCategories(categories);
})();