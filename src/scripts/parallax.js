import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  const shapes = document.querySelectorAll('.floating-shape');

  // ── Parallax layers with rotation ──
  layers.forEach((layer) => {
    const depth = parseFloat(layer.dataset.depth) || 0.2;
    const moveY = depth * 400;
    const moveX = depth * 60;
    const rotate = depth * 3;

    gsap.fromTo(
      layer,
      { y: 0, x: 0, rotation: 0 },
      {
        y: moveY,
        x: moveX,
        rotation: rotate,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  // ── Floating shapes: subtle drift ──
  shapes.forEach((shape, i) => {
    gsap.to(shape, {
      y: () => gsap.utils.random(-30, 30),
      x: () => gsap.utils.random(-20, 20),
      rotation: () => gsap.utils.random(-15, 15),
      duration: 3 + i * 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.3,
    });
  });

  // ── Hero text reveal ──
  const lines = document.querySelectorAll('.line');
  gsap.fromTo(
    lines,
    { opacity: 0, y: 40, rotateX: 15 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.25,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top 60%',
        end: 'top 30%',
        toggleActions: 'play none none none',
      },
    }
  );

  // ── Hero content fade out on scroll ──
  gsap.fromTo(
    '#hero-content',
    { opacity: 1, scale: 1, filter: 'blur(0px)' },
    {
      opacity: 0.15,
      scale: 0.92,
      filter: 'blur(2px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom 30%',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    }
  );

  // ── Scroll indicator ──
  gsap.to('#scroll-indicator', {
    opacity: 0,
    y: -20,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top 15%',
      end: 'top 45%',
      scrub: 1,
    },
  });

  // ── Content blocks: staggered reveal with perspective ──
  const blocks = document.querySelectorAll('.content-block');
  blocks.forEach((block) => {
    const paragraphs = block.querySelectorAll('p');
    const heading = block.querySelector('h2');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 88%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    });

    if (heading) {
      tl.fromTo(
        heading,
        { opacity: 0, y: 30, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' }
      );
    }

    if (paragraphs.length) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.2'
      );
    }
  });

  // ── Closing reveal with scale ──
  gsap.fromTo(
    '.closing-content',
    { opacity: 0, y: 60, scale: 0.95, rotateX: 8 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.closing-content',
        start: 'top 88%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Refresh ScrollTrigger after layout settles
  ScrollTrigger.refresh();
}
