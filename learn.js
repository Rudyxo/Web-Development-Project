// ---------- MDN link helper: turns [[label, path], ...] into a row of links ----------
function mdn(links) {
  return '📖 MDN: ' + links.map(([label, path]) =>
    `<a href="https://developer.mozilla.org/en-US/docs/${path}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`
  ).join(' · ');
}

// ---------- Video cards: thumbnail preview, loads the real player only on click ----------
document.querySelectorAll('.video-card').forEach(card => {
  const id = card.dataset.video;
  const thumb = card.querySelector('.video-thumb');
  thumb.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)`;

  function play() {
    thumb.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
      title="Beginner tutorial video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }
  thumb.addEventListener('click', play);
  thumb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
});

// ---------- HTML tag explorer ----------
const tagData = {
  h1: { code: '<h1>Hello, world!</h1>', note: 'Headings run from <h1> (most important) to <h6>. Use one <h1> per page.' },
  p: { code: '<p>This is a paragraph of text.</p>', note: '<p> holds a block of text. The browser adds spacing between paragraphs automatically.' },
  a: { code: '<a href="https://github.com/Rudyxo">Visit my GitHub</a>', note: '<a> makes a link. The href attribute says where it goes.' },
  ul: { code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>', note: '<ul> is an unordered (bulleted) list; each item is an <li>. Use <ol> for numbered.' },
  button: { code: '<button>Click me</button>', note: '<button> is clickable. On its own it does nothing — JavaScript gives it behaviour.' },
  input: { code: '<input type="text" placeholder="Type here">', note: '<input> is a self-closing tag (no closing tag). The type attribute changes what it is: text, email, checkbox…' }
};
const tagCode = document.getElementById('tag-code');
const tagDemo = document.getElementById('tag-demo');
const tagNote = document.getElementById('tag-note');
tagNote.insertAdjacentHTML('afterend', '<p class="mdn-row" id="tag-mdn"></p>');
const tagMdn = document.getElementById('tag-mdn');
const tagDocs = {
  h1: [['Heading elements', 'Web/HTML/Element/Heading_Elements']],
  p: [['p element', 'Web/HTML/Element/p']],
  a: [['a element', 'Web/HTML/Element/a'], ['href attribute', 'Web/HTML/Element/a#href']],
  ul: [['ul element', 'Web/HTML/Element/ul'], ['li element', 'Web/HTML/Element/li']],
  button: [['button element', 'Web/HTML/Element/button']],
  input: [['input element', 'Web/HTML/Element/input'], ['input types', 'Web/HTML/Element/input#input_types']]
};

function showTag(name) {
  const t = tagData[name];
  tagCode.textContent = t.code;
  tagDemo.innerHTML = t.code;
  tagNote.textContent = t.note;
  tagMdn.innerHTML = mdn(tagDocs[name]);
  document.querySelectorAll('#tag-chips .chip').forEach(c => c.classList.toggle('active', c.dataset.tag === name));
}
document.querySelectorAll('#tag-chips .chip').forEach(c => c.addEventListener('click', () => showTag(c.dataset.tag)));
tagDemo.addEventListener('click', e => { if (e.target.closest('a')) e.preventDefault(); });
showTag('h1');

// ---------- CSS style lab ----------
const labBox = document.getElementById('lab-box');
const labCode = document.getElementById('lab-code');
const lab = {
  bg: document.getElementById('lab-bg'),
  radius: document.getElementById('lab-radius'),
  pad: document.getElementById('lab-pad'),
  shadow: document.getElementById('lab-shadow')
};

function updateLab() {
  const bg = lab.bg.value, r = lab.radius.value, p = lab.pad.value, s = lab.shadow.value;
  labBox.style.background = bg;
  labBox.style.borderRadius = r + 'px';
  labBox.style.padding = p + 'px';
  labBox.style.boxShadow = `0 10px ${s}px rgba(0,0,0,0.5)`;
  document.getElementById('out-radius').textContent = r + 'px';
  document.getElementById('out-pad').textContent = p + 'px';
  document.getElementById('out-shadow').textContent = s + 'px';
  labCode.textContent = `.box {\n  background: ${bg};\n  border-radius: ${r}px;\n  padding: ${p}px;\n  box-shadow: 0 10px ${s}px rgba(0,0,0,0.5);\n}`;
}
Object.values(lab).forEach(input => input.addEventListener('input', updateLab));
updateLab();

// ---------- JavaScript runner ----------
const snippets = {
  variables: ['let name = "Rudransh";', 'const year = 2026;', 'console.log("Hi, " + name);', 'console.log(`It is ${year}`);'].join('\n'),
  function: ['function add(a, b) {', '  return a + b;', '}', '', 'console.log(add(2, 3));', 'console.log(add(10, 25));'].join('\n'),
  condition: ['let score = 72;', '', 'if (score >= 90) {', '  console.log("Excellent");', '} else if (score >= 60) {', '  console.log("Pass");', '} else {', '  console.log("Try again");', '}'].join('\n'),
  loop: ['for (let i = 1; i <= 5; i++) {', '  console.log("Step " + i);', '}'].join('\n'),
  array: ['const skills = ["HTML", "CSS", "JS"];', '', 'skills.forEach(s => console.log("I know " + s));', 'console.log("Total: " + skills.length);'].join('\n')
};
const jsCode = document.getElementById('js-code');
const jsOut = document.getElementById('js-out');
document.getElementById('js-chips').closest('.explorer').insertAdjacentHTML('beforeend', '<p class="mdn-row" id="js-mdn"></p>');
const jsMdn = document.getElementById('js-mdn');
const snippetDocs = {
  variables: [['let', 'Web/JavaScript/Reference/Statements/let'], ['const', 'Web/JavaScript/Reference/Statements/const'], ['Template literals', 'Web/JavaScript/Reference/Template_literals'], ['console', 'Web/API/console']],
  function: [['function', 'Web/JavaScript/Reference/Statements/function'], ['return', 'Web/JavaScript/Reference/Statements/return']],
  condition: [['if...else', 'Web/JavaScript/Reference/Statements/if...else']],
  loop: [['for', 'Web/JavaScript/Reference/Statements/for']],
  array: [['Array', 'Web/JavaScript/Reference/Global_Objects/Array'], ['forEach', 'Web/JavaScript/Reference/Global_Objects/Array/forEach'], ['length', 'Web/JavaScript/Reference/Global_Objects/Array/length']]
};

function loadSnippet(name) {
  jsCode.value = snippets[name];
  jsOut.textContent = 'Press Run…';
  jsMdn.innerHTML = mdn(snippetDocs[name]);
  jsOut.classList.remove('error');
  document.querySelectorAll('#js-chips .chip').forEach(c => c.classList.toggle('active', c.dataset.snippet === name));
}
function runCode() {
  const lines = [];
  const fakeConsole = { log: (...args) => lines.push(args.join(' ')) };
  jsOut.classList.remove('error');
  try {
    new Function('console', jsCode.value)(fakeConsole);
    jsOut.textContent = lines.length ? lines.join('\n') : '(no output — use console.log to print something)';
  } catch (err) {
    jsOut.classList.add('error');
    jsOut.textContent = 'Error: ' + err.message;
  }
}
document.querySelectorAll('#js-chips .chip').forEach(c => c.addEventListener('click', () => loadSnippet(c.dataset.snippet)));
document.getElementById('js-run').addEventListener('click', runCode);
loadSnippet('variables');
