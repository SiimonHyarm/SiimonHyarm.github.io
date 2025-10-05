const SOUND_ICON = "https://thumbs.dreamstime.com/b/red-button-sign-stock-vector-130152563.jpg";

async function loadSounds() {
  const res = await fetch("sounds.json");
  const data = await res.json();
  return data.categories;
}

function createCategorySection(category, files, index) {
  const section = document.createElement("div");
  section.className = "category-section mb-3";

  // Unique ID for Bootstrap collapse
  const collapseId = `collapse-${index}`;

  // Category header (acts as collapse trigger)
  const header = document.createElement("div");
  header.className = "category-header";
  header.setAttribute("data-bs-toggle", "collapse");
  header.setAttribute("data-bs-target", `#${collapseId}`);
  header.setAttribute("aria-expanded", "false");
  header.setAttribute("aria-controls", collapseId);

  header.innerHTML = `
    <span class="category-title">${capitalize(category)}</span>
    <span class="toggle-icon">▼</span>
  `;

  // Sound grid (Bootstrap collapse container)
  const gridWrapper = document.createElement("div");
  gridWrapper.className = "collapse";
  gridWrapper.id = collapseId;

  const grid = document.createElement("div");
  grid.className = "sound-grid";

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

  gridWrapper.appendChild(grid);
  section.appendChild(header);
  section.appendChild(gridWrapper);

  // Rotate arrow icon when expanded
  gridWrapper.addEventListener("show.bs.collapse", () => {
    header.querySelector(".toggle-icon").textContent = "▲";
  });
  gridWrapper.addEventListener("hide.bs.collapse", () => {
    header.querySelector(".toggle-icon").textContent = "▼";
  });

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

  Object.entries(categories).forEach(([cat, files], index) => {
    const section = createCategorySection(cat, files, index);
    board.appendChild(section);
  });
})();
