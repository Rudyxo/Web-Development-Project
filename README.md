# Rudransh — Code & Teach

A multi-page portfolio website that doubles as a beginner-friendly lesson in **HTML, CSS and JavaScript**. Every page is both a real feature and an explanation of how it's built. Nothing is hidden: view the source and learn from it.

Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no audio files.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-7c5cff?style=for-the-badge)](https://web-development-project-indol.vercel.app/)

## Features

- **Multi-page site** with a shared navbar that highlights the current page
- **Learn page** with a tab for each of HTML, CSS and JavaScript. Each tab has:
  - a plain-English explanation
  - annotated syntax breakdowns
  - something interactive to play with
  - a beginner video that shows a thumbnail preview and loads the player only when clicked
  - links to the matching [MDN Web Docs](https://developer.mozilla.org/) pages for going deeper
- **Interactive lessons**
  - *HTML tag explorer*: click a tag to see its code and its rendered result
  - *CSS style lab*: sliders and a colour picker change a box live while the CSS code rewrites itself
  - *JavaScript runner*: pick an example or edit the code, press Run, see the output
- **Live playground**: type HTML and CSS and watch the preview update as you type
- **Sound**: a typing blip on the homepage typewriter and a toggleable ambient background pad that drifts through a chord progression. All audio is synthesized with the Web Audio API, so there are no audio files. The on/off choice is saved with `localStorage`.
- **Scroll-reveal animations** using `IntersectionObserver`
- **Responsive layout** built with Flexbox and CSS Grid

## Pages

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Animated hero with a typewriter effect and links to the other pages |
| Learn | `learn.html` | HTML / CSS / JS lessons, interactive demos, videos, MDN links |
| Playground | `playground.html` | Live HTML + CSS editor with instant preview |
| Projects | `projects.html` | Project cards |
| About | `about.html` | Bio and social links |

## Project structure

```
Web-Development-Project/
├── index.html
├── learn.html
├── playground.html
├── projects.html
├── about.html
├── style.css      # shared styles, theme variables, navbar, layout
├── learn.css      # styles specific to the Learn page
├── script.js      # shared JS: audio, nav highlight, typewriter, tabs, playground, scroll reveal
├── learn.js       # Learn page JS: video cards, tag explorer, style lab, JS runner
└── README.md
```

## Run it locally

**Option 1: VS Code Live Server (recommended)**

1. Install the *Live Server* extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.


**Option 2: Python**

```bash
git clone https://github.com/Rudyxo/Web-Development-Project.git
cd Web-Development-Project
python -m http.server 8000
```

Then open <http://localhost:8000>.

> **Why not just double-click `index.html`?** The site mostly works that way, but YouTube often refuses to play embedded videos on pages opened from `file://`. Running it through a local server fixes that. The video thumbnails also need an internet connection.

## Deployment

Deployed on [Vercel](https://vercel.com) straight from this repo. It's a static site, so no build settings are needed. Every push to `main` redeploys automatically.

## Customising

- **Colours:** edit the CSS variables at the top of `style.css` (`--accent`, `--accent-2`, `--bg`, and so on).
- **Typewriter phrases:** the `phrases` array in `script.js`.
- **Background music:** the `chordProgression` array in `script.js`. Each inner array is one chord, given as note frequencies in Hz.
- **Projects:** duplicate or edit the `<article class="project-card">` blocks in `projects.html`.
- **Videos:** change the `data-video` ID (the part after `youtu.be/`) on a `.video-card` in `learn.html`.

## What you can learn from the code

| Concept | Where to look |
|---------|---------------|
| DOM selection and events | `script.js`, `learn.js` |
| Web Audio API (oscillators, gain, LFOs) | `script.js`, the audio section |
| `localStorage` | `script.js`, the music toggle |
| `IntersectionObserver` | `script.js`, scroll reveal |
| Template literals and `srcdoc` | `script.js`, live playground |
| `new Function()` with a fake `console` | `learn.js`, JS runner |
| CSS Grid, Flexbox, custom properties | `style.css`, `learn.css` |

## Author

**Rudransh Grover**, aspiring software engineer at Scaler School of Technology.

- GitHub: [@Rudyxo](https://github.com/Rudyxo)
- LinkedIn: [rudransh-grover](https://www.linkedin.com/in/rudransh-grover-a08a15386/)
- Instagram: [@rudransh_notfound](https://www.instagram.com/rudransh_notfound/)
- Email: rudranshgroverWork@gmail.com

## Acknowledgements

- Reference links point to [MDN Web Docs](https://developer.mozilla.org/).
- The embedded lessons are third-party beginner videos on YouTube. All credit goes to their creators.
