const API_RESPONSE = {
  success: true,
  status: 200,
  message: 'Match encontrado. Tipo: conexión establecida.',
  data: {
    compatibility: 0.99,
    analysis: 'Dos personas que escriben código en el mismo repo tienen un 99% de probabilidad de hacer commits memorables juntes.',
    easter_egg: 'console.log(\u2764\ufe0f)',
    timestamp: new Date().toISOString(),
    inwed: '\u00a1Feliz D\u00eda Internacional de la Mujer en la Ingenier\u00eda! \ud83c\udf89',
  },
};

export function initMockApi() {
  const btn = document.getElementById('btn-api');
  const panel = document.getElementById('api-response');
  const jsonEl = document.getElementById('response-json');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.querySelector('span').textContent = '$ fetching...';

    // Shimmer effect on button
    btn.style.background = 'rgba(111,78,156,0.15)';

    await delay(700);

    const json = JSON.stringify(API_RESPONSE, null, 2);

    // Typewriter effect for JSON
    if (jsonEl) {
      jsonEl.innerHTML = '';
      await typeJSON(jsonEl, json);
    }

    if (panel) {
      panel.hidden = false;
      // Re-trigger animation
      panel.style.animation = 'none';
      requestAnimationFrame(() => {
        panel.style.animation = 'panelSlide 0.5s var(--ease-out-expo)';
      });
    }

    btn.querySelector('span').textContent = '$ curl -X GET /api/match';
    btn.style.background = '';
    btn.disabled = false;
  });
}

async function typeJSON(el, text) {
  const charsPerFrame = 5;
  let i = 0;

  return new Promise((resolve) => {
    function write() {
      const chunk = text.slice(i, i + charsPerFrame);
      el.innerHTML += `<code>${escapeHTML(chunk)}</code>`;
      i += charsPerFrame;
      if (i < text.length) {
        requestAnimationFrame(write);
      } else {
        resolve();
      }
    }
    write();
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function consoleEasterEgg() {
  const art = `
  %c  ██╗  ██╗██╗    ██╗███████╗██████╗
  %c  ██║  ██║██║    ██║██╔════╝██╔══██╗
  %c  ███████║██║ █╗ ██║█████╗  ██║  ██║
  %c  ██╔══██║██║███╗██║██╔══╝  ██║  ██║
  %c  ██║  ██║╚███╔███╔╝███████╗██████╔╝
  %c  ╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚═════╝
  %c  ══════════════════════════════════════
  `;

  const styles = [
    'color: #6F4E9C; font-size: 12px; font-weight: bold;',
    'color: #8B5FBF; font-size: 12px; font-weight: bold;',
    'color: #e6397f; font-size: 12px; font-weight: bold;',
    'color: #8B5FBF; font-size: 12px; font-weight: bold;',
    'color: #6F4E9C; font-size: 12px; font-weight: bold;',
    'color: #41e2c2; font-size: 12px; font-weight: bold;',
    'color: #8884a0; font-size: 11px;',
  ];

  console.log(art, ...styles);
  console.log(
    '%c\u2728 Bienvenida a los DevTools. Todo fue hecho con cari\u00f1o y cero frameworks pesados. \u2728',
    'color: #41e2c2; font-size: 14px; font-weight: bold; text-shadow: 0 0 10px rgba(65,226,194,0.3);'
  );
  console.log(
    '%c\ud83d\udd0d Tip: prob\u00e1 GET /api/match desde el sitio.',
    'color: #8B5FBF; font-size: 13px;'
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
