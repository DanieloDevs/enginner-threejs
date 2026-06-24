export function initTerminal(onComplete) {
  const terminal = document.getElementById('terminal');
  const btn = document.getElementById('btn-start');
  const log = document.getElementById('terminal-log');
  const cursor = document.getElementById('cursor');
  const typed = document.getElementById('typed-command');
  const loadingBarWrap = document.getElementById('loading-bar-wrap');
  const loadingBar = document.getElementById('loading-bar');
  const cmdText = btn.querySelector('.prompt');

  const logs = [
    { text: '> Initializing environment...', delay: 150 },
    { text: '> Loading kernel modules...', delay: 200 },
    { text: '> Compiling assets...', delay: 350 },
    { text: '> Optimizing bundle...', delay: 300 },
    { text: '> Running tests ............', delay: 500 },
    { text: '> Done in 0.8s ✓', cls: 'success', delay: 400 },
  ];

  let running = false;

  async function runStart() {
    if (running) return;
    running = true;
    btn.disabled = true;
    btn.style.opacity = '0.4';
    cursor.style.display = 'none';

    await typeCommand('./start.sh');
    await delay(200);

    loadingBarWrap.classList.add('active');

    let totalDelay = 0;
    for (const line of logs) {
      totalDelay += line.delay;
    }
    let elapsed = 0;

    for (const line of logs) {
      await delay(line.delay);
      appendLog(line.text, line.cls || '');
      elapsed += line.delay;
      const progress = Math.min((elapsed / totalDelay) * 100, 95);
      loadingBar.style.width = `${progress}%`;
    }

    // Final loading bar fill
    loadingBar.style.width = '100%';
    await delay(300);
    loadingBarWrap.classList.remove('active');

    await delay(500);

    terminal.classList.add('hidden');
    setTimeout(() => {
      terminal.style.display = 'none';
    }, 1000);

    if (onComplete) onComplete();
  }

  function typeCommand(text) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        typed.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 45);
    });
  }

  function appendLog(text, cls) {
    const line = document.createElement('div');
    line.className = `log-line ${cls}`;
    line.textContent = text;
    log.appendChild(line);
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  btn.addEventListener('click', runStart);

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter' && !running) {
      runStart();
      document.removeEventListener('keydown', handler);
    }
  });

  document.addEventListener('keydown', function typeHandler(e) {
    if (running) return;
    if (e.key === 'Backspace') {
      typed.textContent = typed.textContent.slice(0, -1);
    } else if (e.key.length === 1 && e.key !== 'Enter') {
      typed.textContent += e.key;
    }
  });
}
