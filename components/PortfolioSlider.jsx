'use client';

import { useState, useEffect, useRef } from 'react';

const projects = [
  {
    status: "LIVE · 2026",
    category: "ENTERPRISE · INTERNAL SOFTWARE",
    title: "Servall",
    subtitle: "Operations Suite · Multi-Branch Command Center",
    desc: "One system replacing six spreadsheets and a dozen phone calls. Every branch, every technician, every job — visible in real time, from a single screen.",
    stat: "3.5× faster ticket resolution across 12 branches.",
    video: "/videos/p1.mp4",
    accent: "#F5A5A5",
    bg: "#7A1414"
  },
  {
    status: "LIVE · 2026",
    category: "ENTERTAINMENT · WEBSITE",
    title: "L&T Tunes",
    subtitle: "Brand Website · Sound-First Web Experience",
    desc: "A site built to be felt before it's read. Rhythm in the scroll, texture in the type — a digital front door that sounds like the brand behind it.",
    stat: "Full brand launch shipped in 6 weeks.",
    video: "/videos/p2.mp4",
    accent: "#DDDDDD",
    bg: "#0B0B0B"
  },
  {
    status: "LIVE · 2026",
    category: "TEXTILES · DIGITAL MARKETING",
    title: "Sanskar Handloom",
    subtitle: "Digital Marketing · Heritage Craft, New Audience",
    desc: "Generations-old handloom craft, translated for a scroll-first audience — without losing the hand that made it. Campaigns built around the story, not just the sale.",
    stat: "2.8× online orders in one festive season.",
    video: "/videos/p3.mp4",
    accent: "#EBC69A",
    bg: "#4A2818"
  },
  {
    status: "LIVE · 2026",
    category: "LUXURY RETAIL · CRM SOFTWARE",
    title: "Sajvaar Diamonds",
    subtitle: "Internal CRM · Client Intelligence",
    desc: "Built for a business where the relationship outlasts the receipt. Every preference, occasion, and follow-up tracked across a client's lifetime — not just their last visit.",
    stat: "Every client, every carat, one dashboard.",
    video: "/videos/p4.mp4",
    accent: "#B7CBEE",
    bg: "#0F2444"
  },
  {
    status: "LIVE · 2026",
    category: "RETAIL OPERATIONS · STORE MANAGEMENT",
    title: "Square Parts",
    subtitle: "Store Management Software · Servall Network",
    desc: "Inventory, billing, and stock alerts unified into one system — built for the counter, not the boardroom. Every store now runs like the best-performing one.",
    stat: "Reconciliation time cut from hours to minutes.",
    video: "/videos/p5.mp4",
    accent: "#B4E0C3",
    bg: "#153322"
  },
  {
    status: "LIVE · 2026",
    category: "EDTECH · LEARNING PLATFORM",
    title: "Servall LMS",
    subtitle: "Learning Management System · Workforce Training",
    desc: "Onboarding, rebuilt as a habit instead of a binder. Courses, progress, and certification tracked for every technician, at every branch, automatically.",
    stat: "Onboarding time cut in half network-wide.",
    video: "/videos/p6.mp4",
    accent: "#D6BCF0",
    bg: "#2A1A4A"
  }
];

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

export default function PortfolioSlider() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = projects.length;
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrolled = -rect.top;
      let progress = scrolled / scrollableHeight;
      progress = Math.min(Math.max(progress, 0), 0.9999);

      const idx = Math.floor(progress * total);
      setCurrent(Math.min(idx, total - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    const total = projects.length;
    const scrollableHeight = el.offsetHeight - window.innerHeight;
    const targetY = el.offsetTop + (idx / total) * scrollableHeight + 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="ps-scroll-container"
      style={{ height: `${projects.length * 100}vh`, '--stage-bg': projects[current]?.bg || '#0A0A0A' }}
    >
      <div className="ps-stage">
        <div className="ps-frame">
          <div className="ps-navdots">
            {projects.map((proj, idx) => (
              <button
                key={idx}
                className={idx === current ? 'active' : ''}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{ '--dot-accent': proj.accent }}
              />
            ))}
          </div>

          {projects.map((p, idx) => (
            <Slide key={idx} p={p} idx={idx} current={current} />
          ))}

          <div className="ps-counter">
            {pad(current + 1)} / {pad(projects.length)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ps-scroll-container {
          position: relative;
          width: 100%;
        }
        .ps-stage {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          background: var(--stage-bg, #0A0A0A);
          transition: background 800ms cubic-bezier(0.22, 1, 0.36, 1);
          color: #f2ede2;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 60px;
          overflow: hidden;
        }
        .ps-frame {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: min(78vh, 720px);
          overflow: hidden;
          border-radius: 6px;
        }
        .ps-navdots {
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 200;
        }
        .ps-navdots button {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 1px solid rgba(230, 225, 212, 0.18);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: all 0.35s ease;
        }
        .ps-navdots button.active {
          background: var(--dot-accent, #f2ede2);
          border-color: var(--dot-accent, #f2ede2);
          box-shadow: 0 0 0 3px rgba(242, 237, 226, 0.12);
        }
        .ps-counter {
          position: absolute;
          right: 0;
          bottom: -38px;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: #9fae9f;
          z-index: 200;
        }
        @media (max-width: 900px) {
          .ps-stage {
            padding: 24px 16px;
            height: 100vh;
            /* modern viewport unit that accounts for mobile browser chrome */
            height: 100svh;
          }
          .ps-frame {
            height: calc(100svh - 48px);
            max-width: 100%;
          }
          .ps-navdots { display: none; }
          .ps-counter { font-size: 10px; bottom: -28px; }
        }
      `}</style>
    </div>
  );
}

function Slide({ p, idx, current }) {
  const [videoFailed, setVideoFailed] = useState(false);

  const isWaiting = idx > current;
  const transform = isWaiting ? 'translateY(100%)' : 'translateY(0)';

  return (
    <div
      className="ps-slide"
      style={{
        transform,
        zIndex: idx + 1,
        '--accent': p.accent,
        '--bg': p.bg || '#10201b',
      }}
    >
      <div className="ps-media">
        {!videoFailed ? (
          <video autoPlay muted loop playsInline onError={() => setVideoFailed(true)}>
            <source src={p.video} type="video/mp4" />
          </video>
        ) : (
          <div className="ps-fallback" />
        )}
        <div className="ps-badge">
          <span className="ps-dot" />
          {p.status}
        </div>
      </div>

      <div className="ps-copy">
        <div className="ps-eyebrow">
          <span className="ps-rule" />
          {p.category}
        </div>
        <h1 className="ps-title">{p.title}</h1>
        <div className="ps-subtitle">{p.subtitle}</div>
        <p className="ps-desc">{p.desc}</p>
        <div className="ps-stat">{p.stat}</div>
        <a className="ps-cta" href="#">
          DISCOVER CASE STUDY <span className="ps-arrow">→</span>
        </a>
      </div>

      <style jsx>{`
        .ps-slide {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 64px;
          align-items: center;
          background: var(--bg, #10201b);
          box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.35);
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
          will-change: transform;
          padding: 0 4px;
        }
        .ps-media {
          position: relative;
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
          background: linear-gradient(135deg, #1c2b24, #0e1712);
        }
        .ps-media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ps-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, #1e3229, #142019 45%, #24382c);
          background-size: 220% 220%;
          animation: ps-drift 14s ease-in-out infinite;
        }
        @keyframes ps-drift {
          0% { background-position: 0% 30%; }
          50% { background-position: 100% 70%; }
          100% { background-position: 0% 30%; }
        }
        .ps-media::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35) 100%);
          pointer-events: none;
        }
        .ps-badge {
          position: absolute;
          left: 18px;
          top: 18px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 10px;
          background: rgba(15, 22, 18, 0.55);
          border: 1px solid rgba(230, 225, 212, 0.18);
          border-radius: 999px;
          backdrop-filter: blur(6px);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #f2ede2;
          font-weight: 500;
        }
        .ps-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6fbf73;
          box-shadow: 0 0 8px 1px #6fbf73;
        }
        .ps-copy { padding-right: 20px; }
        .ps-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #9fae9f;
          font-size: 12px;
          letter-spacing: 0.18em;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 26px;
        }
        .ps-rule {
          width: 34px;
          height: 1px;
          background: var(--accent);
        }
        .ps-title {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: clamp(46px, 6vw, 76px);
          line-height: 1.02;
          letter-spacing: -0.01em;
          margin-bottom: 18px;
          color: #f2ede2;
        }
        .ps-subtitle {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 19px;
          color: var(--accent);
          margin-bottom: 26px;
        }
        .ps-desc {
          font-size: 15.5px;
          line-height: 1.65;
          color: #f2ede2;
          opacity: 0.86;
          max-width: 460px;
          margin-bottom: 14px;
        }
        .ps-stat {
          font-size: 13.5px;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 30px;
          letter-spacing: 0.01em;
        }
        .ps-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding-top: 22px;
          border-top: 1px solid rgba(230, 225, 212, 0.18);
          width: 100%;
          max-width: 460px;
          color: #f2ede2;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
        }
        .ps-arrow { transition: transform 0.3s ease; }
        .ps-cta:hover .ps-arrow { transform: translateX(6px); }

        @media (max-width: 900px) {
          .ps-slide {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 0;
            align-items: stretch;
            grid-template-rows: 240px 1fr;
          }
          .ps-media { height: 100%; }
          .ps-copy {
            padding: 4px 4px 20px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .ps-eyebrow {
            font-size: 10px;
            letter-spacing: 0.16em;
            margin-bottom: 14px;
            gap: 10px;
          }
          .ps-eyebrow .ps-rule { width: 22px; }
          .ps-title {
            font-size: clamp(30px, 8vw, 42px);
            line-height: 1.05;
            margin-bottom: 10px;
          }
          .ps-subtitle {
            font-size: 14px;
            margin-bottom: 14px;
          }
          .ps-desc {
            font-size: 14px;
            line-height: 1.55;
            margin-bottom: 12px;
            max-width: 100%;
          }
          .ps-stat {
            font-size: 12px;
            margin-bottom: 18px;
          }
          .ps-cta {
            font-size: 11px;
            padding-top: 14px;
            max-width: 100%;
          }
          .ps-badge {
            font-size: 9.5px;
            padding: 4px 10px 4px 8px;
          }
        }
        @media (max-width: 900px) {
          .ps-stage { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}
