// items per category
const CONFIG = {
  torso: {
    count: 4,
    path: "parts/torso-"
  },
  headpiece: {
    count: 3,
    path: "parts/headpiece-"
  },
  glasses: {
    count: 2,
    path: "parts/glasses-"
  },
  accessory: {
    count: 3,
    path: "parts/accessory-"
  },
  vice: {
    count: 2,
    path: "parts/vice-"
  }
};

// start with NOTHING selected
const state = {
  torso: -1,
  headpiece: -1,
  glasses: -1,
  accessory: -1,
  vice: -1
};

// hide everything at start
Object.keys(state).forEach(part => {
  const img = document.getElementById(part);
  img.style.display = "none";
});

// BUTTON LOGIC
document.querySelectorAll(".prev, .next").forEach(button => {
  button.addEventListener("click", () => {
    const part = button.dataset.part;
    const dir = button.classList.contains("prev") ? -1 : 1;

    const max = CONFIG[part].count;
    let index = state[part];

    // move index
    index += dir;

    // wrap around including NONE state (-1)
    if (index >= max) index = -1;
    if (index < -1) index = max - 1;

    state[part] = index;

    const img = document.getElementById(part);

    if (index === -1) {
      img.style.display = "none";
    } else {
      img.style.display = "block";
      img.src = `${CONFIG[part].path}${index}.png`;
    }
  });
});


// save !!

const saveBtn = document.getElementById("save");

saveBtn.addEventListener("click", async () => {
  const canvas = document.createElement("canvas");
  const width = 1598;
  const height = 1389;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff1d6";
  ctx.fillRect(0, 0, width, height);

  const layers = [
    "base-bobby",
    "torso",
    "headpiece",
    "glasses",
    "accessory",
    "vice"
  ];

  for (const id of layers) {
    const imgEl = document.getElementById(id);
    if (!imgEl || imgEl.style.display === "none") continue;

    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(
          width / img.naturalWidth,
          height / img.naturalHeight
        );

        const drawWidth = img.naturalWidth * scale;
        const drawHeight = img.naturalHeight * scale;

        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        resolve();
      };
      img.src = imgEl.src;
    });
  }

  const link = document.createElement("a");
  link.download = "bobby.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

const randomBtn = document.getElementById("random");

randomBtn.addEventListener("click", () => {
  Object.keys(CONFIG).forEach(part => {
    const img = document.getElementById(part);
    const max = CONFIG[part].count;

    const randomIndex = Math.floor(Math.random() * (max + 1)) - 1;

    state[part] = randomIndex;

    if (randomIndex === -1) {
      img.style.display = "none";
    } else {
      img.style.display = "block";
      img.src = `${CONFIG[part].path}${randomIndex}.png`;
    }
  });
});


const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => {
  Object.keys(state).forEach(part => {
    state[part] = -1;

    const img = document.getElementById(part);
    if (img) {
      img.style.display = "none";
    }
  });
});
