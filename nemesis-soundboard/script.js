// v0.13
const SOUND_ICON = "https://thumbs.dreamstime.com/b/red-button-sign-stock-vector-130152563.jpg";

async function loadSounds() {
  const res = await fetch("sounds.json");
  const data = await res.json();
  return data.categories; // { category: [files] }
}

function createCategorySection(category, files) {
  const section = document.createElement("div");
  section.className = "category-section mb-3";

  // Header
  const header = document.createElement("div");
  header.className = "category-header";
  header.innerHTML = `
    <span class="category-title">${capitalize(category)}</span>
    <span class="toggle-icon">▼</span>
  `;

  // Sound buttons grid
  const grid = document.createElement("div");
  grid.className = "sound-grid collapse";
  grid.id = `collapse-${category}`;

  files.forEach(file => {
    const name = file.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const prettyName = capitalizeWords(name);

    const btn = document.createElement("button");
    btn.className = "sound-btn text-center";
    btn.innerHTML = `
      <img src="${SOUND_ICON}" alt="${prettyName}" class="sound-img">
      <span class="sound-label">${prettyName}</span>
    `;
    btn.onclick = () => new Audio(`sounds/${category}/${file}`).play();
    grid.appendChild(btn);
  });

  // Toggle expand/collapse
  header.onclick = () => {
    const isShown = grid.classList.contains("show");
    document.querySelectorAll(".sound-grid.show").forEach(g => g.classList.remove("show"));
    document.querySelectorAll(".toggle-icon").forEach(i => (i.textContent = "▼"));
    if (!isShown) {
      grid.classList.add("show");
      header.querySelector(".toggle-icon").textContent = "▲";
    } else {
      grid.classList.remove("show");
      header.querySelector(".toggle-icon").textContent = "▼";
    }
  };

  section.appendChild(header);
  section.appendChild(grid);
  return section;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

(async function init() {
  const categories = await loadSounds();
  const board = document.getElementById("soundboard");
  board.innerHTML = "";

  Object.entries(categories).forEach(([cat, files]) => {
    const section = createCategorySection(cat, files);
    board.appendChild(section);
  });
})();