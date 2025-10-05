async function loadSounds() {
  const response = await fetch("sounds.json");
  const data = await response.json();
  return data.sounds;
}

function extractInfo(filePath) {
  const parts = filePath.split("/");
  const category = parts[1]; // after "sounds/"
  const fileName = parts.pop().replace(/\.[^/.]+$/, ""); // remove extension
  const name = fileName
    .replace(/[_-]/g, " ") // replace underscores/dashes
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
  return { name, category, file: filePath };
}

function renderCategories(categories) {
  const container = document.querySelector(".flex.justify-center");
  container.innerHTML = ""; // clear existing
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.className = "category-btn";
    btn.dataset.category = cat;
    btn.addEventListener("click", () => filterSounds(cat));
    container.appendChild(btn);
  });
}

function renderSounds(sounds) {
  const board = document.getElementById("soundboard");
  board.innerHTML = "";
  sounds.forEach(({ name, file }) => {
    const btn = document.createElement("button");
    btn.className = "sound-btn";
    btn.textContent = name;
    btn.onclick = () => new Audio(file).play();
    board.appendChild(btn);
  });
}

let allSounds = [];

function filterSounds(category) {
  document.querySelectorAll(".category-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.category === category)
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
