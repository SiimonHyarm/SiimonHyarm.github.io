const SOUND_ICON = "https://thumbs.dreamstime.com/b/red-button-sign-stock-vector-130152563.jpg";

async function loadSounds() {
  const res = await fetch("sounds.json");
  const data = await res.json();
  return data.categories;
}

function createCategorySection(category, files, index) {
  const section = document.createElement("div");
  section.className = "category-section mb-3";

  const collapseId = `collapse-${index}`;

  // Divider line header
  const divider = document.createElement("div");
  divider.className = "category-divider";
  divider.setAttribute("data-bs-toggle", "collapse");
  divider.setAttribute("data-bs-target", `#${collapseId}`);
  divider.setAttribute("aria-expanded", "true");
  divider.setAttribute("aria-controls", collapseId);

  divider.innerHTML = `
    <span class="category-title">${capitalize(category)}</span>
    <i class="bi bi-chevron-up category-arrow rotated"></i>
  `;

  // Collapse area
  const gridWrapper = document.createElement("div");
  gridWrapper.className = "collapse show";
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
  section.appendChild(divider);
  section.appendChild(gridWrapper);

  // Arrow rotation on expand/collapse
  gridWrapper.addEventListener("show.bs.collapse", () => {
    divider.querySelector(".category-arrow").classList.add("rotated");
  });
  gridWrapper.addEventListener("hide.bs.collapse", () => {
    divider.querySelector(".category-arrow").classList.remove("rotated");
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
