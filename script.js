const fileMeta = {
  about: {
    path: "src/about.tsx",
    status: "about.tsx",
    command: "$ cat src/about.tsx",
    output: "Loaded profile, summary, and current focus."
  },
  experience: {
    path: "src/experience.md",
    status: "experience.md",
    command: "$ less src/experience.md",
    output: "Opened experience history and impact notes."
  },
  projects: {
    path: "src/projects.json",
    status: "projects.json",
    command: "$ open src/projects.json",
    output: "Rendered featured project cards and tech stack tags."
  },
  skills: {
    path: "src/skills.ts",
    status: "skills.ts",
    command: "$ node src/skills.ts",
    output: "Compiled technical skills and tooling."
  },
  education: {
    path: "docs/education.txt",
    status: "education.txt",
    command: "$ cat docs/education.txt",
    output: "Displayed academic background and coursework."
  },
  community: {
    path: "docs/community.log",
    status: "community.log",
    command: "$ tail docs/community.log",
    output: "Loaded leadership and volunteering records."
  },
  contact: {
    path: "docs/contact.sh",
    status: "contact.sh",
    command: "$ ./docs/contact.sh",
    output: "Ready to connect via email, LinkedIn, phone, or GitHub."
  }
};

const appShell = document.querySelector(".app-shell");
const panels = document.querySelectorAll(".editor-panel");
const openers = document.querySelectorAll("[data-open]");
const currentFile = document.querySelector("[data-current-file]");
const statusFile = document.querySelector("[data-status-file]");
const terminalLog = document.querySelector("[data-terminal-log]");
const commandChips = document.querySelectorAll("[data-command]");
const sidebarButtons = document.querySelectorAll(".js-open-sidebar");
const closeSidebarButton = document.querySelector(".js-close-sidebar");
const terminalButtons = document.querySelectorAll(".js-toggle-terminal");
const folderToggles = document.querySelectorAll(".folder-toggle");

function appendTerminalLine(text, className = "") {
  if (!terminalLog) return;

  const line = document.createElement("div");
  line.className = `terminal-line ${className}`.trim();
  line.textContent = text;
  terminalLog.appendChild(line);

  while (terminalLog.children.length > 8) {
    terminalLog.removeChild(terminalLog.firstElementChild);
  }

  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function setActiveFile(target) {
  const meta = fileMeta[target];
  if (!meta) return;

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.classList.toggle("active", isActive);
  });

  openers.forEach((button) => {
    button.classList.toggle("active", button.dataset.open === target);
  });

  if (currentFile) {
    currentFile.textContent = meta.path;
  }

  if (statusFile) {
    statusFile.textContent = meta.status;
  }
}

function openFile(target, emitTerminal = true) {
  const meta = fileMeta[target];
  if (!meta) return;

  setActiveFile(target);

  if (emitTerminal) {
    appendTerminalLine(meta.command, "command");
    appendTerminalLine(meta.output);
  }

  if (window.innerWidth <= 960) {
    appShell.classList.remove("sidebar-open");
  }
}

openers.forEach((button) => {
  button.addEventListener("click", () => {
    openFile(button.dataset.open);
  });
});

commandChips.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.command;
    openFile(target);
    appShell.classList.remove("terminal-collapsed");
  });
});

sidebarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appShell.classList.toggle("sidebar-open");
  });
});

if (closeSidebarButton) {
  closeSidebarButton.addEventListener("click", () => {
    appShell.classList.remove("sidebar-open");
  });
}

terminalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appShell.classList.toggle("terminal-collapsed");
  });
});

folderToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const group = toggle.closest(".tree-group");
    if (!group) return;

    const collapsed = group.classList.toggle("collapsed");
    toggle.classList.toggle("open", !collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });
});

function syncResponsiveChrome() {
  if (window.innerWidth > 960) {
    appShell.classList.add("sidebar-open");
  } else {
    appShell.classList.remove("sidebar-open");
  }
}

window.addEventListener("resize", syncResponsiveChrome);
syncResponsiveChrome();
setActiveFile("about");
