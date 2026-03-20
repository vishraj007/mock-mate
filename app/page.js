import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Video, Brain, BarChart3, CheckCircle2, Sparkles, Mic2, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #03070a;
          --em:  #34d399;
          --em2: #2dd4bf;
          --em3: #22d3ee;
          --em-glow: rgba(52,211,153,0.18);
          --em-border: rgba(52,211,153,0.28);
          --glass-bg: rgba(255,255,255,0.04);
          --glass-bg2: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.10);
          --glass-shine: rgba(255,255,255,0.06);
          --text: #f0faf6;
          --muted: #64748b;
          --muted2: #8ba3b0;
          --font-d: 'Syne', sans-serif;
          --font-b: 'DM Sans', sans-serif;
        }

        html { scroll-behavior: smooth; }

        .root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-b);
          overflow-x: hidden;
        }

        /* BG LAYERS */
        .bg-scene {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(140px); mix-blend-mode: screen;
          animation: blobDrift 20s ease-in-out infinite;
        }
        .blob-1 { width:700px;height:700px;top:-250px;left:-200px;
          background:radial-gradient(circle,rgba(52,211,153,0.16),transparent 70%); }
        .blob-2 { width:600px;height:600px;bottom:-150px;right:-150px;
          background:radial-gradient(circle,rgba(34,211,238,0.12),transparent 70%);
          animation-delay:-8s; }
        .blob-3 { width:450px;height:450px;top:45%;left:55%;transform:translate(-50%,-50%);
          background:radial-gradient(circle,rgba(45,212,191,0.09),transparent 70%);
          animation-delay:-14s; }
        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(50px,-40px) scale(1.06)}
          66%{transform:translate(-35px,50px) scale(0.96)}
        }
        .bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%);
        }
        .bg-noise {
          position: absolute; inset: 0; opacity: 0.45;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        }

        /* LAYOUT */
        .wrap { position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:0 36px; }

        /* NAV */
        .nav-bar {
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          background: rgba(3,7,10,0.7);
          border-bottom: 1px solid var(--glass-border);
        }
        .nav-inner {
          display:flex;align-items:center;justify-content:space-between;
          padding: 18px 0;
        }
        .nav-logo {
          font-family:var(--font-d);font-weight:800;font-size:1.45rem;
          letter-spacing:-0.03em;
          background:linear-gradient(130deg,var(--em),var(--em2));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .nav-links { display:flex;align-items:center;gap:12px; }
        .nav-pill {
          font-family:var(--font-d);font-size:0.78rem;font-weight:600;
          letter-spacing:0.06em;text-transform:uppercase;
          color:var(--muted2);text-decoration:none;
          padding:7px 16px;border-radius:8px;
          border:1px solid transparent;
          transition:all 0.2s;
        }
        .nav-pill:hover { color:var(--em);border-color:var(--em-border);background:var(--em-glow); }
        .nav-cta-btn {
          font-family:var(--font-d);font-size:0.8rem;font-weight:700;
          letter-spacing:0.04em;text-transform:uppercase;
          color:#03070a;text-decoration:none;
          padding:9px 22px;border-radius:8px;
          background:linear-gradient(135deg,var(--em),var(--em2));
          transition:all 0.25s;
          box-shadow:0 4px 20px rgba(52,211,153,0.35);
        }
        .nav-cta-btn:hover { transform:translateY(-1px);box-shadow:0 8px 30px rgba(52,211,153,0.45); }

        /* HERO */
        .hero {
          padding: 110px 0 80px;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 60px;
          align-items: center;
        }
        @media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center;}}

        .hero-badge {
          display:inline-flex;align-items:center;gap:8px;
          padding:6px 16px;border-radius:100px;
          background:var(--em-glow);border:1px solid var(--em-border);
          font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
          color:var(--em);margin-bottom:28px;
          animation:fadeUp 0.5s both;
        }
        .hero-badge svg{width:12px;height:12px;}

        .hero-h1 {
          font-family:var(--font-d);font-weight:800;
          font-size:clamp(3.2rem,7vw,6.5rem);
          line-height:0.94;letter-spacing:-0.04em;
          margin-bottom:24px;
          animation:fadeUp 0.5s 0.08s both;
        }
        .grad {
          background:linear-gradient(135deg,#34d399 0%,#2dd4bf 35%,#22d3ee 70%,#6ee7b7 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          background-size:250%;
          animation:shimmer 5s linear infinite;
        }
        @keyframes shimmer{0%{background-position:0%}100%{background-position:250%}}

        .hero-sub {
          font-size:1.05rem;color:var(--muted2);line-height:1.75;font-weight:300;
          max-width:500px;margin-bottom:40px;
          animation:fadeUp 0.5s 0.16s both;
        }
        .hero-btns {
          display:flex;gap:14px;align-items:center;flex-wrap:wrap;
          animation:fadeUp 0.5s 0.24s both;
        }

        /* BUTTONS */
        .btn-solid {
          display:inline-flex;align-items:center;gap:10px;
          font-family:var(--font-d);font-weight:700;font-size:0.95rem;letter-spacing:-0.01em;
          color:#03070a;text-decoration:none;
          padding:14px 32px;border-radius:10px;
          background:linear-gradient(135deg,var(--em),var(--em2),var(--em3));
          position:relative;overflow:hidden;
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 0 0 1px rgba(255,255,255,0.15) inset,
                     0 -3px 0 rgba(0,0,0,0.35) inset,
                     0 8px 32px rgba(52,211,153,0.4);
        }
        .btn-solid::before {
          content:'';position:absolute;inset:0;
          background:linear-gradient(160deg,rgba(255,255,255,0.3) 0%,transparent 55%);
          border-radius:10px;pointer-events:none;
        }
        .btn-solid:hover{transform:translateY(-3px) scale(1.02);
          box-shadow:0 0 0 1px rgba(255,255,255,0.15) inset,
                     0 -3px 0 rgba(0,0,0,0.35) inset,
                     0 16px 50px rgba(52,211,153,0.55);}
        .btn-solid svg{width:17px;height:17px;transition:transform 0.2s;}
        .btn-solid:hover svg{transform:translateX(3px);}

        .btn-glass {
          display:inline-flex;align-items:center;gap:8px;
          font-family:var(--font-d);font-weight:600;font-size:0.88rem;letter-spacing:0.02em;
          color:var(--text);text-decoration:none;
          padding:13px 26px;border-radius:10px;
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          background:var(--glass-bg2);border:1px solid var(--glass-border);
          transition:all 0.25s;
          box-shadow:0 1px 0 var(--glass-shine) inset;
        }
        .btn-glass:hover{background:rgba(255,255,255,0.1);border-color:var(--em-border);color:var(--em);}

        /* 3D CUBE */
        .cube-scene {
          perspective: 900px;
          display:flex;justify-content:center;align-items:center;
          height: 380px;
          animation:fadeUp 0.5s 0.3s both;
        }
        .cube-wrapper {
          position:relative;width:180px;height:180px;
          transform-style:preserve-3d;
          animation:cubeRotate 16s linear infinite;
        }
        @keyframes cubeRotate {
          0%  { transform: rotateX(20deg) rotateY(0deg) rotateZ(3deg); }
          100%{ transform: rotateX(20deg) rotateY(360deg) rotateZ(3deg); }
        }
        .cube-face {
          position:absolute;width:180px;height:180px;
          backdrop-filter:blur(20px) saturate(180%);
          -webkit-backdrop-filter:blur(20px) saturate(180%);
          border:1px solid rgba(52,211,153,0.22);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
          box-shadow:0 0 30px rgba(52,211,153,0.06) inset;
        }
        .cube-face.front  { background:rgba(52,211,153,0.09); transform:translateZ(90px); }
        .cube-face.back   { background:rgba(34,211,238,0.07); transform:rotateY(180deg) translateZ(90px); }
        .cube-face.left   { background:rgba(45,212,191,0.07); transform:rotateY(-90deg) translateZ(90px); }
        .cube-face.right  { background:rgba(52,211,153,0.07); transform:rotateY(90deg) translateZ(90px); }
        .cube-face.top    { background:rgba(34,211,238,0.06); transform:rotateX(90deg) translateZ(90px); }
        .cube-face.bottom { background:rgba(45,212,191,0.05); transform:rotateX(-90deg) translateZ(90px); }
        .cube-face-icon { color:var(--em);opacity:0.9; }
        .cube-face-icon svg { width:36px;height:36px; }
        .cube-face-label {
          font-family:var(--font-d);font-size:0.7rem;font-weight:700;
          letter-spacing:0.07em;text-transform:uppercase;color:var(--em);opacity:0.75;
          text-align:center;padding:0 12px;
        }

        /* floating glass stat cards */
        .cube-stat {
          position:absolute;
          backdrop-filter:blur(24px) saturate(200%);
          -webkit-backdrop-filter:blur(24px) saturate(200%);
          background:rgba(255,255,255,0.05);
          border:1px solid var(--glass-border);
          border-radius:14px;
          padding:12px 18px;
          box-shadow:0 8px 32px rgba(0,0,0,0.45),0 1px 0 rgba(255,255,255,0.07) inset;
          white-space:nowrap;
        }
        .cube-stat-1 { top:10px;right:-20px; animation:floatA 4s ease-in-out infinite; }
        .cube-stat-2 { bottom:20px;left:-30px; animation:floatB 5s ease-in-out infinite; }
        .cube-stat-3 { top:48%;left:-55px;transform:translateY(-50%); animation:floatA 6s ease-in-out infinite reverse; }
        @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        .stat-label{font-size:0.62rem;color:var(--muted);font-weight:500;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:3px;}
        .stat-value{font-family:var(--font-d);font-size:1.1rem;font-weight:800;color:var(--em);letter-spacing:-0.02em;}
        .stat-sub{font-size:0.62rem;color:var(--muted2);margin-top:2px;}

        /* SECTION HEADER */
        .sec-eyebrow {
          font-family:var(--font-d);font-size:0.7rem;font-weight:700;
          letter-spacing:0.16em;text-transform:uppercase;color:var(--em);
          text-align:center;margin-bottom:12px;
        }
        .sec-title {
          font-family:var(--font-d);font-weight:800;
          font-size:clamp(1.8rem,3.5vw,2.9rem);
          letter-spacing:-0.03em;text-align:center;
          line-height:1.1;margin-bottom:56px;
        }
        .sec-grad {
          background:linear-gradient(135deg,var(--em),var(--em3));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        /* FEATURES GLASS GRID */
        .feat-grid {
          display:grid;grid-template-columns:repeat(2,1fr);gap:16px;
          margin-bottom:110px;
        }
        @media(max-width:680px){.feat-grid{grid-template-columns:1fr;}}

        .feat-card {
          position:relative;overflow:hidden;border-radius:20px;
          backdrop-filter:blur(24px) saturate(180%);
          -webkit-backdrop-filter:blur(24px) saturate(180%);
          background:var(--glass-bg);
          border:1px solid var(--glass-border);
          padding:36px 32px;
          transition:all 0.35s cubic-bezier(0.23,1,0.32,1);
          box-shadow:0 1px 0 var(--glass-shine) inset, 0 20px 60px rgba(0,0,0,0.3);
          transform-style:preserve-3d;
        }
        .feat-card::before {
          content:'';position:absolute;inset:0;border-radius:20px;
          background:linear-gradient(135deg,rgba(52,211,153,0.07) 0%,transparent 60%);
          opacity:0;transition:opacity 0.35s;
        }
        .feat-card::after {
          content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent);
          opacity:0;transition:opacity 0.35s;
        }
        .feat-card:hover{
          transform:translateY(-6px) rotateX(2deg);
          border-color:rgba(52,211,153,0.3);
          box-shadow:0 1px 0 var(--glass-shine) inset,
                     0 32px 80px rgba(0,0,0,0.45),
                     0 0 40px rgba(52,211,153,0.08);
        }
        .feat-card:hover::before{opacity:1;}
        .feat-card:hover::after{opacity:1;}

        .feat-num {
          position:absolute;top:24px;right:28px;
          font-family:var(--font-d);font-size:0.68rem;font-weight:700;
          letter-spacing:0.1em;color:rgba(52,211,153,0.25);
        }
        .feat-icon-shell {
          width:54px;height:54px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          margin-bottom:22px;position:relative;
          box-shadow:0 6px 20px rgba(0,0,0,0.3),0 1px 0 rgba(255,255,255,0.08) inset;
        }
        .feat-icon-shell::before {
          content:'';position:absolute;inset:0;border-radius:14px;
          background:linear-gradient(160deg,rgba(255,255,255,0.12) 0%,transparent 60%);
        }
        .feat-icon-shell svg{width:22px;height:22px;position:relative;z-index:1;color:var(--em);}
        .feat-name{font-family:var(--font-d);font-size:1.1rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px;}
        .feat-text{font-size:0.875rem;color:var(--muted2);line-height:1.7;font-weight:300;}

        /* 3D STEP CARDS */
        .steps-section{margin-bottom:110px;}
        .steps-grid {
          display:grid;grid-template-columns:repeat(2,1fr);gap:16px;
        }
        @media(max-width:680px){.steps-grid{grid-template-columns:1fr;}}

        .step-card {
          position:relative;border-radius:22px;overflow:hidden;
          backdrop-filter:blur(28px) saturate(200%);
          -webkit-backdrop-filter:blur(28px) saturate(200%);
          background:linear-gradient(145deg,rgba(255,255,255,0.065) 0%,rgba(255,255,255,0.018) 100%);
          border:1px solid var(--glass-border);
          padding:36px 32px 32px;
          transition:all 0.4s cubic-bezier(0.23,1,0.32,1);
          transform-style:preserve-3d;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.07) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset,
            0 24px 64px rgba(0,0,0,0.35);
        }
        /* top glass shine edge */
        .step-card::before {
          content:'';position:absolute;top:0;left:15%;right:15%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent);
        }
        /* left accent bar */
        .step-card::after {
          content:'';position:absolute;left:0;top:18%;bottom:18%;width:2px;border-radius:2px;
          background:linear-gradient(180deg,var(--em),var(--em3));
          opacity:0.45;transition:all 0.35s;
        }
        .step-card:hover {
          transform:translateY(-8px) rotateX(3deg) rotateY(-1.5deg);
          border-color:rgba(52,211,153,0.28);
          background:linear-gradient(145deg,rgba(52,211,153,0.06) 0%,rgba(34,211,238,0.03) 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.07) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset,
            0 40px 100px rgba(0,0,0,0.5),
            0 0 60px rgba(52,211,153,0.1);
        }
        .step-card:hover::after{opacity:1;top:10%;bottom:10%;}

        .step-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
        .step-badge {
          font-family:var(--font-d);font-size:0.68rem;font-weight:700;
          letter-spacing:0.12em;text-transform:uppercase;
          color:var(--em);
          background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);
          padding:4px 12px;border-radius:100px;
        }
        .step-num-big {
          font-family:var(--font-d);font-size:3.8rem;font-weight:800;
          letter-spacing:-0.06em;line-height:1;
          background:linear-gradient(135deg,rgba(52,211,153,0.22),rgba(34,211,238,0.08));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          user-select:none;
        }
        .step-title{font-family:var(--font-d);font-size:1.25rem;font-weight:700;letter-spacing:-0.025em;margin-bottom:10px;}
        .step-desc{font-size:0.875rem;color:var(--muted2);line-height:1.72;font-weight:300;}

        /* GLASS EVERYTHING PANEL */
        .everything-panel {
          position:relative;border-radius:28px;overflow:hidden;
          backdrop-filter:blur(32px) saturate(200%);
          -webkit-backdrop-filter:blur(32px) saturate(200%);
          background:linear-gradient(135deg,rgba(52,211,153,0.055) 0%,rgba(34,211,238,0.025) 50%,rgba(255,255,255,0.015) 100%);
          border:1px solid var(--glass-border);
          padding:60px;
          margin-bottom:110px;
          box-shadow:0 1px 0 rgba(255,255,255,0.06) inset,0 40px 100px rgba(0,0,0,0.4);
        }
        .everything-panel::before {
          content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent);
        }
        .everything-panel::after {
          content:'';position:absolute;top:-200px;right:-200px;
          width:500px;height:500px;border-radius:50%;
          background:radial-gradient(circle,rgba(52,211,153,0.07),transparent 70%);
          pointer-events:none;
        }
        .check-grid2{display:grid;grid-template-columns:1fr 1fr;gap:32px 48px;position:relative;z-index:1;}
        @media(max-width:640px){.check-grid2{grid-template-columns:1fr;}.everything-panel{padding:36px 28px;}}
        .check-row{display:flex;gap:16px;align-items:flex-start;}
        .check-ring {
          width:36px;height:36px;flex-shrink:0;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.22);
          box-shadow:0 0 16px rgba(52,211,153,0.1);
          margin-top:1px;
        }
        .check-ring svg{width:15px;height:15px;color:var(--em);}
        .check-title2{font-family:var(--font-d);font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:5px;}
        .check-desc2{font-size:0.82rem;color:var(--muted);line-height:1.65;font-weight:300;}

        /* FOOTER CTA */
        .footer-cta {
          text-align:center;
          padding:80px 20px 100px;
          position:relative;
        }
        .footer-cta::before {
          content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);
          width:1px;height:70px;
          background:linear-gradient(180deg,transparent,rgba(52,211,153,0.4));
        }
        .fcta-h2{font-family:var(--font-d);font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-0.04em;line-height:1.05;margin-bottom:20px;}
        .fcta-sub{color:var(--muted2);font-size:1rem;margin-bottom:44px;font-weight:300;}

        /* FOOTER */
        .footer {
          position:relative;z-index:1;
          border-top:1px solid var(--glass-border);
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          background:rgba(3,7,10,0.6);
          padding:24px 36px;
          display:flex;align-items:center;justify-content:space-between;
        }
        .footer-logo{font-family:var(--font-d);font-weight:800;font-size:1rem;letter-spacing:-0.02em;
          background:linear-gradient(135deg,var(--em),var(--em2));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .footer-copy{font-size:0.75rem;color:var(--muted);}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:var(--bg);}
        ::-webkit-scrollbar-thumb{background:rgba(52,211,153,0.25);border-radius:3px;}
      `}</style>

      {/* BG */}
      <div className="bg-scene" aria-hidden>
        <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
        <div className="bg-grid"/><div className="bg-noise"/>
      </div>

      {/* NAV */}
      <nav className="nav-bar">
        <div className="wrap">
          <div className="nav-inner">
            <span className="nav-logo">MockMate</span>
            <div className="nav-links">
              <Link href="#features" className="nav-pill">Features</Link>
              <Link href="#how" className="nav-pill">How It Works</Link>
              <Link href="/sign-in" className="nav-cta-btn">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <main style={{position:"relative",zIndex:1}}>
        <div className="wrap">

          {/* HERO */}
          <section className="hero">
            <div>
              <div className="hero-badge"><Sparkles/>AI-Powered Interview Coach</div>
              <h1 className="hero-h1">
                Ace every<br/>
                <span className="grad">interview</span><br/>
                you take.
              </h1>
              <p className="hero-sub">
                AI-driven practice, real-time analysis, personalized feedback
                and performance tracking — all in one place.
              </p>
              <div className="hero-btns">
                <Link href="/sign-in" className="btn-solid">
                  Get Started Free <ArrowRight/>
                </Link>
                <Link href="#how" className="btn-glass">See how it works</Link>
              </div>
            </div>

            {/* 3D ROTATING CUBE + FLOATING STATS */}
            <div style={{position:"relative"}}>
              <div className="cube-scene">
                <div style={{position:"relative"}}>
                  <div className="cube-wrapper">
                    <div className="cube-face front">
                      <div className="cube-face-icon"><Sparkles/></div>
                      <div className="cube-face-label">AI Feedback</div>
                    </div>
                    <div className="cube-face back">
                      <div className="cube-face-icon"><Brain/></div>
                      <div className="cube-face-label">Deep Analysis</div>
                    </div>
                    <div className="cube-face left">
                      <div className="cube-face-icon"><Mic2/></div>
                      <div className="cube-face-label">Voice AI</div>
                    </div>
                    <div className="cube-face right">
                      <div className="cube-face-icon"><BarChart3/></div>
                      <div className="cube-face-label">Analytics</div>
                    </div>
                    <div className="cube-face top">
                      <div className="cube-face-icon"><Video/></div>
                      <div className="cube-face-label">Webcam</div>
                    </div>
                    <div className="cube-face bottom">
                      <div className="cube-face-icon"><Shield/></div>
                      <div className="cube-face-label">Secure</div>
                    </div>
                  </div>
                  {/* glass stat chips */}
                  <div className="cube-stat cube-stat-1">
                    <div className="stat-label">Confidence</div>
                    <div className="stat-value">88%</div>
                    <div className="stat-sub">↑ 12 pts this week</div>
                  </div>
                  <div className="cube-stat cube-stat-2">
                    <div className="stat-label">Clarity Score</div>
                    <div className="stat-value">9.1</div>
                    <div className="stat-sub">Excellent</div>
                  </div>
                  <div className="cube-stat cube-stat-3">
                    <div className="stat-label">Sessions</div>
                    <div className="stat-value">24</div>
                    <div className="stat-sub">this month</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section id="features">
            <div className="sec-eyebrow">Core Features</div>
            <h2 className="sec-title">
              Built for<br/>
              <span className="sec-grad">interview mastery</span>
            </h2>
            <div className="feat-grid">
              {[
                { n:"01", icon:<Video/>, color:"rgba(52,211,153,0.2)", bg:"rgba(52,211,153,0.09)",
                  title:"Webcam Simulation",
                  desc:"Full-screen video with live speech-to-text. Replay sessions and watch yourself exactly as an interviewer would." },
                { n:"02", icon:<Brain/>, color:"rgba(45,212,191,0.2)", bg:"rgba(45,212,191,0.09)",
                  title:"Gemini AI Feedback",
                  desc:"Per-answer scoring on clarity, depth, and confidence. Actionable improvement tips generated in seconds." },
                { n:"03", icon:<Sparkles/>, color:"rgba(34,211,238,0.2)", bg:"rgba(34,211,238,0.09)",
                  title:"Personalized Questions",
                  desc:"Paste a job description; get bespoke questions calibrated to your role, tech stack, and seniority." },
                { n:"04", icon:<BarChart3/>, color:"rgba(96,165,250,0.2)", bg:"rgba(96,165,250,0.09)",
                  title:"Performance Analytics",
                  desc:"Cross-session dashboards track growth trends, highlight weak spots, and celebrate breakthroughs." },
              ].map(({n,icon,color,bg,title,desc})=>(
                <div key={n} className="feat-card">
                  <div className="feat-num">{n}</div>
                  <div className="feat-icon-shell" style={{background:bg,border:`1px solid ${color}`}}>
                    {icon}
                  </div>
                  <div className="feat-name">{title}</div>
                  <p className="feat-text">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" className="steps-section">
            <div className="sec-eyebrow">Process</div>
            <h2 className="sec-title">How it works</h2>
            <div className="steps-grid">
              {[
                { s:"Step 01", n:"01", title:"Enter Job Details",
                  desc:"Paste a job description or fill in your role, tech stack, and experience. The AI calibrates difficulty and topic focus areas instantly." },
                { s:"Step 02", n:"02", title:"Practice Interview",
                  desc:"Answer AI-generated questions on camera with a live countdown. Speech-to-text captures your responses with high accuracy." },
                { s:"Step 03", n:"03", title:"Receive AI Feedback",
                  desc:"Get instant per-answer scores on clarity, depth, and confidence plus an overall performance summary with an improvement roadmap." },
                { s:"Step 04", n:"04", title:"Take Domain Quizzes",
                  desc:"Adaptive MCQ quizzes reinforce weak areas across 20+ technology tracks so your technical knowledge stays razor sharp." },
              ].map(({s,n,title,desc})=>(
                <div key={n} className="step-card">
                  <div className="step-header">
                    <div className="step-badge">{s}</div>
                    <div className="step-num-big">{n}</div>
                  </div>
                  <div className="step-title">{title}</div>
                  <p className="step-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* EVERYTHING YOU NEED */}
          <section className="everything-panel">
            <div className="sec-eyebrow" style={{textAlign:"left",marginBottom:10}}>Built-In</div>
            <h2 className="sec-title" style={{textAlign:"left",marginBottom:44}}>
              Everything you need<br/>
              <span className="sec-grad">to succeed</span>
            </h2>
            <div className="check-grid2">
              {[
                { title:"Secure Authentication", desc:"Powered by Clerk — safe, seamless sessions across all your devices." },
                { title:"Speech Recognition",    desc:"Advanced real-time speech-to-text for accurate answer transcription every time." },
                { title:"Detailed Reports",       desc:"Per-session and cumulative analytics with visual progress charts." },
                { title:"Technical Quizzes",      desc:"Domain-specific MCQ assessments across 20+ popular tech stacks." },
              ].map(({title,desc})=>(
                <div key={title} className="check-row">
                  <div className="check-ring"><CheckCircle2/></div>
                  <div>
                    <div className="check-title2">{title}</div>
                    <div className="check-desc2">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="footer-cta">
            <h2 className="fcta-h2">
              Ready to ace your<br/>
              <span className="sec-grad">next interview?</span>
            </h2>
            <p className="fcta-sub">Start for free. No credit card required.</p>
            <Link href="/sign-in" className="btn-solid" style={{display:"inline-flex"}}>
              Start Practicing Free <ArrowRight/>
            </Link>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-logo">MockMate</span>
        <span className="footer-copy">© {new Date().getFullYear()} MockMate. All rights reserved.</span>
      </footer>
    </div>
  );
}