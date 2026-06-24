import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTerminal } from './terminal.js';
import { initParallax } from './parallax.js';
import { initScene3D } from './scene3d.js';
import { initMockApi, consoleEasterEgg } from './mockApi.js';

gsap.registerPlugin(ScrollTrigger);

let ytPlayer = null;

function init() {
  consoleEasterEgg();
  initCursorGlow();
  initScrollProgress();

  loadYouTubeAPI();

  initTerminal(() => {
    initParallax();
    initScene3D();
    initMockApi();
    startYouTube();

    // Refresh ScrollTrigger after layout settles
    setTimeout(() => ScrollTrigger.refresh(), 300);
    setTimeout(() => ScrollTrigger.refresh(), 1000);
  });
}

/* ── YouTube ── */
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.async = true;
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('youtube-player', {
    videoId: '7LDf9-SV8mA',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
    },
    events: {
      onReady: (e) => {
        e.target.setVolume(30);
      },
    },
  });
};

function startYouTube() {
  if (ytPlayer && ytPlayer.playVideo) {
    doPlay();
  } else {
    const check = setInterval(() => {
      if (ytPlayer && ytPlayer.playVideo) {
        doPlay();
        clearInterval(check);
      }
    }, 200);
    setTimeout(() => clearInterval(check), 10000);
  }
}

function doPlay() {
  const promise = ytPlayer.playVideo();
  if (promise && promise.catch) {
    promise.catch(() => {
      ytPlayer.mute();
      ytPlayer.playVideo();
      showUnmuteBtn();
    });
  }
}

function showUnmuteBtn() {
  const btn = document.createElement('button');
  btn.id = 'unmute-btn';
  btn.textContent = '🔇 Activar sonido';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:10px 18px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(13,13,13,0.85);color:#e0dcef;font-family:inherit;font-size:14px;cursor:pointer;backdrop-filter:blur(6px);';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => {
    ytPlayer.unMute();
    ytPlayer.setVolume(30);
    btn.remove();
  });
}

/* ── Custom cursor glow ── */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  if (!glow || !dot) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.left = `${targetX}px`;
    dot.style.top = `${targetY}px`;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(tick);
  }
  tick();

  const interactive = document.querySelectorAll('a, button, .cmd-btn, .api-btn');
  interactive.forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('active'));
    el.addEventListener('mouseleave', () => dot.classList.remove('active'));
  });
}

/* ── Scroll progress bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
