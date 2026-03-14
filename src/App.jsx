import { useState, useEffect, useRef } from "react";

const FONT = `'Pretendard','Apple SD Gothic Neo',-apple-system,BlinkMacSystemFont,sans-serif`;
const FONT_EN = `'SF Pro Display','Helvetica Neue',${FONT}`;

function mix(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/*
 * Core: single RAF loop that reads scroll once per frame,
 * smoothly lerps all values, and writes directly to DOM.
 * ZERO React re-renders during scroll.
 */
function useScrollEngine(sectionRef, animatorFn, deps = []) {
  const frameRef = useRef(null);
  const smoothProgress = useRef(0);

  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (rect.height + vh);
      const target = Math.max(0, Math.min(1, raw));

      // Smooth lerp — 0.08 gives a silky trailing feel
      smoothProgress.current += (target - smoothProgress.current) * 0.08;

      // Round to avoid sub-pixel jitter
      const p = Math.round(smoothProgress.current * 1000) / 1000;

      animatorFn(p);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, deps);
}

/* ══════════════════ NAV ══════════════════ */
function Nav() {
  const ref = useRef(null);

  useEffect(() => {
    const h = () => {
      if (!ref.current) return;
      const s = window.scrollY > 30;
      ref.current.style.background = s ? "rgba(0,0,0,.82)" : "transparent";
      ref.current.style.backdropFilter = s ? "saturate(180%) blur(20px)" : "none";
      ref.current.style.WebkitBackdropFilter = s ? "saturate(180%) blur(20px)" : "none";
      ref.current.style.borderBottomColor = s ? "rgba(255,255,255,.06)" : "transparent";
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav ref={ref} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 max(24px,4vw)", height: 52,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "transparent",
      transition: "background .4s, backdrop-filter .4s",
      borderBottom: "1px solid transparent",
      fontFamily: FONT,
    }}>
      <div onClick={() => scrollTo("hero")}
        style={{ fontWeight: 800, fontSize: 17, color: "#f5f5f7", cursor: "pointer", letterSpacing: "-.03em" }}>깔</div>
      <div style={{ display: "flex", gap: 32, fontSize: 12.5, fontWeight: 500, color: "rgba(245,245,247,.8)" }}>
        {[["소개","about"],["활동","how"],["지원","join"],["문의","contact"]].map(([l,id]) => (
          <span key={id} onClick={() => scrollTo(id)}
            style={{ cursor: "pointer", transition: "color .3s" }}
            onMouseEnter={e => e.target.style.color = "#f5f5f7"}
            onMouseLeave={e => e.target.style.color = "rgba(245,245,247,.8)"}>{l}</span>
        ))}
      </div>
    </nav>
  );
}

/* ══════════════════ HERO ══════════════════ */
function HeroSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: .5, y: .5 });

  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  useScrollEngine(sectionRef, (p) => {
    if (!contentRef.current) return;
    // Map p: section goes from 0 (top of viewport) to 1 (scrolled past)
    // We want fade-out in the 0.35–0.65 range
    const t = Math.max(0, Math.min(1, (p - 0.35) / 0.3));
    const opacity = 1 - t;
    const y = t * -60;
    const scale = 1 - t * 0.15;
    contentRef.current.style.opacity = opacity;
    contentRef.current.style.transform = `translate3d(0,${y}px,0) scale(${scale})`;
  });

  const onMove = (e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  return (
    <section ref={sectionRef} id="hero" onMouseMove={onMove} style={{
      position: "relative", height: "130vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", background: "#000",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: loaded ? 1 : 0, transition: "opacity 2s ease" }}>
        <div style={{
          position: "absolute", width: "70vmax", height: "70vmax", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,60,.12) 0%, transparent 55%)",
          left: `${mouse.x*25+5}%`, top: `${mouse.y*25}%`,
          transition: "left 3s ease-out, top 3s ease-out", filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", width: "60vmax", height: "60vmax", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(60,120,255,.1) 0%, transparent 55%)",
          right: `${(1-mouse.x)*15}%`, bottom: `${(1-mouse.y)*15}%`,
          transition: "right 3.5s ease-out, bottom 3.5s ease-out", filter: "blur(100px)",
        }} />
      </div>

      <div ref={contentRef} style={{
        position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px",
        willChange: "transform, opacity",
      }}>
        <div style={{
          fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 700,
          letterSpacing: ".18em", fontFamily: FONT_EN,
          background: "linear-gradient(90deg,#f7c948,#f0a030,#e07828,#d05a28,#a855f7,#6d5bf7,#2997ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          opacity: loaded ? 1 : 0, transform: `translateY(${loaded ? 0 : 25}px)`,
          transition: "all 1s cubic-bezier(.16,1,.3,1) .2s",
        }}>KNUAF HIP-HOP CLUB</div>

        <div style={{
          fontSize: "clamp(110px,24vw,280px)", fontWeight: 900,
          letterSpacing: "-.06em", lineHeight: 1, fontFamily: FONT, color: "#f5f5f7", marginTop: 16,
          opacity: loaded ? 1 : 0, transform: `translateY(${loaded ? 0 : 40}px)`,
          transition: "all 1.2s cubic-bezier(.16,1,.3,1) .4s",
        }}>깔</div>

        <div style={{
          fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 800,
          letterSpacing: "-.04em", lineHeight: 1.3, fontFamily: FONT, marginTop: 20,
          opacity: loaded ? 1 : 0, transform: `translateY(${loaded ? 0 : 30}px)`,
          transition: "all 1s cubic-bezier(.16,1,.3,1) .7s",
        }}>
          <span style={{
            background: "linear-gradient(90deg,#f7c948,#e8a030,#d06828,#a855f7,#6d5bf7,#2997ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>같이 듣고, 같이 느끼고, 같이 깔리자.</span>
        </div>

        <div style={{
          marginTop: 48, opacity: loaded ? 1 : 0,
          transform: `translateY(${loaded ? 0 : 20}px)`,
          transition: "all 1s cubic-bezier(.16,1,.3,1) 1s",
        }}>
          <span onClick={() => scrollTo("about")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: "#2997ff", fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}>더 알아보기 ›</span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ ABOUT ══════════════════ */
function AboutSection() {
  const sectionRef = useRef(null);
  const charsRef = useRef([]);
  const lineRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const headline = "일단 핵심부터.";
  const chars = headline.split("");

  useScrollEngine(sectionRef, (p) => {
    // Char reveal
    charsRef.current.forEach((el, i) => {
      if (!el) return;
      const t = Math.max(0, Math.min(1, (p * 6 - i * 0.35) * 0.8));
      el.style.color = `rgba(245,245,247,${mix(.1, 1, t)})`;
      el.style.transform = `translate3d(0,${mix(14, 0, t)}px,0)`;
    });
    // Line
    if (lineRef.current) {
      const lt = Math.max(0, Math.min(1, (p - .32) * 5));
      lineRef.current.style.transform = `scaleX(${lt})`;
      lineRef.current.style.opacity = lt;
    }
    // Content blocks
    if (leftRef.current) {
      const t = Math.max(0, Math.min(1, (p - .42) * 4));
      leftRef.current.style.opacity = t;
      leftRef.current.style.transform = `translate3d(0,${mix(40, 0, t)}px,0)`;
    }
    if (rightRef.current) {
      const t = Math.max(0, Math.min(1, (p - .5) * 4));
      rightRef.current.style.opacity = t;
      rightRef.current.style.transform = `translate3d(0,${mix(40, 0, t)}px,0)`;
    }
  });

  return (
    <section ref={sectionRef} id="about" style={{
      background: "#000", padding: "180px max(24px,10vw) 140px", minHeight: "110vh",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "clamp(52px,9vw,108px)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT,
          display: "flex", flexWrap: "wrap",
        }}>
          {chars.map((c, i) => (
            <span key={i} ref={el => charsRef.current[i] = el}
              style={{ color: "rgba(245,245,247,.1)", display: "inline-block", willChange: "transform, color" }}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h2>

        <div ref={lineRef} style={{
          width: "100%", height: 1, background: "rgba(255,255,255,.08)",
          margin: "56px 0", transformOrigin: "left", opacity: 0,
          willChange: "transform, opacity",
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
          gap: "36px 56px",
        }}>
          <div ref={leftRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
            <h3 style={{
              fontSize: "clamp(28px,4vw,40px)", fontWeight: 800,
              color: "#f5f5f7", letterSpacing: "-.04em", lineHeight: 1.2,
              fontFamily: FONT, marginBottom: 20,
            }}>
              매주 한 번,<br />
              <span style={{
                background: "linear-gradient(90deg,#f7c948,#e8a030,#a855f7,#2997ff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>한 곡의 이야기.</span>
            </h3>
          </div>
          <div ref={rightRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
            <p style={{
              fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.7,
              color: "rgba(245,245,247,.6)", fontWeight: 400, fontFamily: FONT,
            }}>
              각자 한 주 동안 가장 즐겨 들었거나 새로 찾아낸 노래를 공유합니다.
              노래를 고른 이유에 대해 가볍게 이야기를 나누며, 리스너들끼리
              자연스럽게 교류하는 자리입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ HOW ══════════════════ */
function HowSection() {
  const sectionRef = useRef(null);
  const charsRef = useRef([]);
  const lineRef = useRef(null);
  const rowRefs = useRef([]);

  const headline = "이렇게 진행돼요.";
  const chars = headline.split("");

  const items = [
    { num: "01", icon: "🎵", title: "한 곡 고르기", desc: "이번 주에 가장 많이 들은 곡, 새로 발견한 곡 — 무엇이든." },
    { num: "02", icon: "🔊", title: "같이 듣기", desc: "스피커 + 무손실 음원. 베이스가 생명이니까." },
    { num: "03", icon: "💬", title: "이야기", desc: "왜 이 곡인지, 어떤 부분이 좋은지. 부담 없이." },
    { num: "04", icon: "🤝", title: "연결", desc: "취향을 나누다 보면 통하는 사람을 만나게 됩니다." },
  ];

  useScrollEngine(sectionRef, (p) => {
    charsRef.current.forEach((el, i) => {
      if (!el) return;
      const t = Math.max(0, Math.min(1, (p * 7 - i * 0.35) * 0.7));
      el.style.color = `rgba(245,245,247,${mix(.1, 1, t)})`;
      el.style.transform = `translate3d(0,${mix(12, 0, t)}px,0)`;
    });
    if (lineRef.current) {
      const lt = Math.max(0, Math.min(1, (p - .15) * 6));
      lineRef.current.style.transform = `scaleX(${lt})`;
      lineRef.current.style.opacity = lt;
    }
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = Math.max(0, Math.min(1, (p - .25 - i * .08) * 5));
      el.style.opacity = t;
      el.style.transform = `translate3d(${mix(-30, 0, t)}px,0,0)`;
    });
  });

  return (
    <section ref={sectionRef} id="how" style={{
      background: "#000", padding: "140px max(24px,10vw) 140px", minHeight: "130vh",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "clamp(48px,8vw,96px)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT,
          display: "flex", flexWrap: "wrap",
        }}>
          {chars.map((c, i) => (
            <span key={i} ref={el => charsRef.current[i] = el}
              style={{ color: "rgba(245,245,247,.1)", display: "inline-block", willChange: "transform, color" }}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h2>

        <div ref={lineRef} style={{
          width: "100%", height: 1, background: "rgba(255,255,255,.08)",
          margin: "56px 0 44px", transformOrigin: "left", opacity: 0,
          willChange: "transform",
        }} />

        {items.map((item, i) => (
          <div key={item.num} ref={el => rowRefs.current[i] = el}
            style={{ opacity: 0, willChange: "transform, opacity" }}>
            <StepRow item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StepRow({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(36px,5vw,60px) 1fr",
        gap: "0 clamp(16px,3vw,32px)",
        padding: "clamp(26px,3.5vw,40px) 0",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        background: hovered ? "rgba(255,255,255,.02)" : "transparent",
        transition: "background .3s",
      }}>
      <div style={{
        fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 600,
        color: hovered ? "#2997ff" : "rgba(245,245,247,.25)",
        fontFamily: FONT_EN, paddingTop: 4, transition: "color .4s",
      }}>{item.num}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{
            fontSize: "clamp(24px,3vw,32px)",
            transform: hovered ? "scale(1.15)" : "scale(1)",
            transition: "transform .4s cubic-bezier(.16,1,.3,1)",
            display: "inline-block",
          }}>{item.icon}</span>
          <h3 style={{
            fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800,
            color: "#f5f5f7", letterSpacing: "-.04em", fontFamily: FONT,
          }}>{item.title}</h3>
        </div>
        <p style={{
          fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6,
          color: "rgba(245,245,247,.5)", fontFamily: FONT, maxWidth: 480,
        }}>{item.desc}</p>
      </div>
    </div>
  );
}

/* ══════════════════ SPEAKER ══════════════════ */
function SpeakerSection() {
  const sectionRef = useRef(null);
  const speakerRef = useRef(null);
  const textRef = useRef(null);
  const subRef = useRef(null);
  const ringsRef = useRef([]);

  useScrollEngine(sectionRef, (p) => {
    // Speaker zoom
    if (speakerRef.current) {
      const st = Math.max(0, Math.min(1, p * 2.5));
      const scale = mix(.35, 1, Math.pow(st, .5));
      const op = Math.min(1, st * 2.5);
      speakerRef.current.style.transform = `translate3d(0,0,0) scale(${scale})`;
      speakerRef.current.style.opacity = op;

      // Glow via box-shadow
      const g = Math.max(0, Math.min(1, (p - .3) * 3));
      const inner = speakerRef.current.querySelector('[data-speaker-body]');
      if (inner) {
        inner.style.boxShadow = `
          0 0 ${60+g*60}px rgba(247,201,72,${g*.1}),
          0 0 ${30+g*100}px rgba(168,85,247,${g*.06}),
          0 0 ${20+g*140}px rgba(41,151,255,${g*.05}),
          inset 0 0 80px rgba(0,0,0,.7)`;
      }

      // Pulse rings
      ringsRef.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = g;
        el.style.animationPlayState = g > .2 ? "running" : "paused";
      });
    }

    // Text
    if (textRef.current) {
      const t = Math.max(0, Math.min(1, (p - .4) * 4));
      textRef.current.style.opacity = t;
      textRef.current.style.transform = `translate3d(0,${mix(40, 0, t)}px,0)`;
    }
    if (subRef.current) {
      const t = Math.max(0, Math.min(1, (p - .5) * 4));
      subRef.current.style.opacity = t;
      subRef.current.style.transform = `translate3d(0,${mix(25, 0, t)}px,0)`;
    }
  });

  return (
    <section ref={sectionRef} style={{
      padding: "140px max(24px,8vw) 160px", background: "#000",
      overflow: "hidden", minHeight: "120vh",
    }}>
      <div style={{
        maxWidth: 980, margin: "0 auto",
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
      }}>
        <div ref={speakerRef} style={{
          position: "relative", marginBottom: 56,
          opacity: 0, willChange: "transform, opacity",
        }}>
          <div data-speaker-body="true" style={{
            width: "min(280px,52vw)", height: "min(280px,52vw)",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #282828 0%, #3c3c3c 15%, #232323 30%, #373737 50%, #1e1e1e 65%, #323232 80%, #282828 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: "inset 0 0 80px rgba(0,0,0,.7)",
          }}>
            <div style={{
              width: "62%", height: "62%", borderRadius: "50%",
              background: "radial-gradient(circle at 42% 42%, #3a3a3a 0%, #161616 80%)",
              boxShadow: "inset 0 3px 30px rgba(0,0,0,.6), 0 0 2px rgba(255,255,255,.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "32%", height: "32%", borderRadius: "50%",
                background: "radial-gradient(circle at 42% 42%, #5f5f5f 0%, #2d2d2d 100%)",
                boxShadow: "0 0 4px rgba(255,255,255,.15), inset 0 1px 10px rgba(0,0,0,.4)",
              }} />
            </div>
            <div style={{ position: "absolute", inset: "5%", borderRadius: "50%", border: "1px solid rgba(255,255,255,.04)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: "2%", borderRadius: "50%", border: "1px solid rgba(255,255,255,.02)", pointerEvents: "none" }} />

            {[
              { d: 0, c: "247,201,72", off: -14 },
              { d: .6, c: "168,85,247", off: -32 },
              { d: 1.2, c: "41,151,255", off: -50 },
            ].map((r, i) => (
              <div key={i} ref={el => ringsRef.current[i] = el}
                style={{
                  position: "absolute", inset: r.off, borderRadius: "50%",
                  border: `1.5px solid rgba(${r.c},.25)`,
                  animation: `speakerPulse 2.8s ease-out infinite ${r.d}s`,
                  animationPlayState: "paused",
                  opacity: 0,
                }} />
            ))}
          </div>
        </div>

        <h3 ref={textRef} style={{
          fontSize: "clamp(34px,6vw,72px)", fontWeight: 900,
          letterSpacing: "-.05em", lineHeight: 1.12, fontFamily: FONT,
          marginBottom: 16, opacity: 0, willChange: "transform, opacity",
        }}>
          <span style={{ color: "#f5f5f7" }}>베이스가 생명.</span><br />
          <span style={{
            background: "linear-gradient(90deg,#f7c948,#e8a030,#a855f7,#6d5bf7,#2997ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>제대로 된 사운드.</span>
        </h3>
        <p ref={subRef} style={{
          fontSize: "clamp(15px,1.8vw,19px)",
          color: "rgba(245,245,247,.4)", fontWeight: 500, fontFamily: FONT,
          opacity: 0, willChange: "transform, opacity",
        }}>스피커와 무손실 음원, 동아리에서 제공합니다.</p>
      </div>

      <style>{`
        @keyframes speakerPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════ JOIN ══════════════════ */
function JoinSection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const [btnHover, setBtnHover] = useState(false);

  useScrollEngine(sectionRef, (p) => {
    const t1 = Math.max(0, Math.min(1, p * 4));
    const t2 = Math.max(0, Math.min(1, (p - .18) * 5));
    const t3 = Math.max(0, Math.min(1, (p - .3) * 5));

    if (labelRef.current) {
      labelRef.current.style.opacity = t1;
      labelRef.current.style.transform = `translate3d(0,${mix(20, 0, t1)}px,0)`;
    }
    if (headRef.current) {
      headRef.current.style.opacity = t1;
      headRef.current.style.transform = `translate3d(0,${mix(60, 0, t1)}px,0) scale(${mix(.92, 1, t1)})`;
    }
    if (descRef.current) {
      descRef.current.style.opacity = t2;
      descRef.current.style.transform = `translate3d(0,${mix(30, 0, t2)}px,0)`;
    }
    if (btnRef.current) {
      btnRef.current.style.opacity = t3;
      btnRef.current.style.transform = `translate3d(0,${mix(20, 0, t3)}px,0)`;
    }
  });

  return (
    <section ref={sectionRef} id="join" style={{
      minHeight: "115vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center",
      background: "#000", padding: "120px max(24px,8vw)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
        <div ref={labelRef} style={{
          fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 700,
          letterSpacing: ".2em", fontFamily: FONT_EN,
          color: "rgba(245,245,247,.3)", marginBottom: 24,
          opacity: 0, willChange: "transform, opacity",
        }}>NOW RECRUITING</div>

        <h2 ref={headRef} style={{
          fontSize: "clamp(52px,10vw,120px)", fontWeight: 900,
          lineHeight: 1.02, letterSpacing: "-.06em", fontFamily: FONT, marginBottom: 32,
          opacity: 0, willChange: "transform, opacity",
        }}>
          <span style={{ color: "#f5f5f7" }}>너의 플리,</span><br />
          <span style={{
            background: "linear-gradient(90deg,#f7c948,#e8a030,#d06828,#a855f7,#6d5bf7,#2997ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>들려줘.</span>
        </h2>

        <p ref={descRef} style={{
          fontSize: "clamp(16px,2vw,21px)", lineHeight: 1.65,
          color: "rgba(245,245,247,.5)", fontFamily: FONT,
          maxWidth: 500, margin: "0 auto",
          opacity: 0, willChange: "transform, opacity",
        }}>
          잘하실 필요도, 랩이나 프로듀싱 경험이 있을 필요도 없습니다.<br />
          힙합을 좋아하고 즐기시는 분이라면 누구든 환영합니다.
        </p>

        <div ref={btnRef} style={{
          marginTop: 48, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 16,
          opacity: 0, willChange: "transform, opacity",
        }}>
          <a href="https://naver.me/xQJmi12D" target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f5f5f7", color: "#000",
              borderRadius: 980, padding: "17px 42px",
              fontSize: "clamp(16px,1.6vw,18px)", fontWeight: 700,
              textDecoration: "none", fontFamily: FONT,
              transform: btnHover ? "scale(1.03)" : "scale(1)",
              boxShadow: btnHover ? "0 4px 30px rgba(245,245,247,.2)" : "0 2px 12px rgba(245,245,247,.08)",
              transition: "all .4s cubic-bezier(.16,1,.3,1)",
            }}>멤버 신청하기 <span style={{ fontWeight: 400 }}>→</span></a>
          <span style={{ fontSize: 13, color: "rgba(245,245,247,.2)", fontFamily: FONT }}>네이버 폼으로 연결됩니다</span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ CONTACT ══════════════════ */
function ContactSection() {
  const sectionRef = useRef(null);
  const charsRef = useRef([]);
  const lineRef = useRef(null);
  const cardsRef = useRef(null);
  const [kakaoHover, setKakaoHover] = useState(false);

  const chars = "문의.".split("");

  useScrollEngine(sectionRef, (p) => {
    charsRef.current.forEach((el, i) => {
      if (!el) return;
      const t = Math.max(0, Math.min(1, (p * 5 - i * 0.4) * 0.6));
      el.style.color = `rgba(245,245,247,${mix(.1, 1, t)})`;
      el.style.transform = `translate3d(0,${mix(12, 0, t)}px,0)`;
    });
    if (lineRef.current) {
      const lt = Math.max(0, Math.min(1, (p - .2) * 6));
      lineRef.current.style.transform = `scaleX(${lt})`;
      lineRef.current.style.opacity = lt;
    }
    if (cardsRef.current) {
      const t = Math.max(0, Math.min(1, (p - .35) * 4));
      cardsRef.current.style.opacity = t;
      cardsRef.current.style.transform = `translate3d(0,${mix(40, 0, t)}px,0)`;
    }
  });

  return (
    <section ref={sectionRef} id="contact" style={{
      background: "#000", padding: "140px max(24px,10vw) 120px",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "clamp(48px,8vw,96px)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT,
          display: "flex",
        }}>
          {chars.map((c, i) => (
            <span key={i} ref={el => charsRef.current[i] = el}
              style={{ color: "rgba(245,245,247,.1)", display: "inline-block", willChange: "transform, color" }}>{c}</span>
          ))}
        </h2>

        <div ref={lineRef} style={{
          width: "100%", height: 1, background: "rgba(255,255,255,.08)",
          margin: "56px 0", transformOrigin: "left", opacity: 0,
        }} />

        <div ref={cardsRef} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
          gap: 24, opacity: 0, willChange: "transform, opacity",
        }}>
          <div style={{
            background: "rgba(255,255,255,.04)", borderRadius: 20,
            padding: "clamp(28px,4vw,40px)", border: "1px solid rgba(255,255,255,.06)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(245,245,247,.3)", letterSpacing: ".06em", fontFamily: FONT_EN, marginBottom: 24 }}>CONTACT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontSize: 14, color: "rgba(245,245,247,.4)", fontFamily: FONT, marginBottom: 6, fontWeight: 500 }}>깔 부장</div>
                <div style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 800, color: "#f5f5f7", fontFamily: FONT, letterSpacing: "-.03em" }}>산업곤충전공 3학년 이준재</div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: "rgba(245,245,247,.4)", fontFamily: FONT, marginBottom: 6, fontWeight: 500 }}>연락처</div>
                <div style={{ fontSize: "clamp(18px,2vw,22px)", fontWeight: 600, color: "rgba(245,245,247,.8)", fontFamily: FONT_EN, letterSpacing: ".02em" }}>010-7540-8765</div>
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,.04)", borderRadius: 20,
            padding: "clamp(28px,4vw,40px)", border: "1px solid rgba(255,255,255,.06)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(245,245,247,.3)", letterSpacing: ".06em", fontFamily: FONT_EN, marginBottom: 24 }}>KAKAOTALK</div>
              <p style={{ fontSize: "clamp(16px,1.8vw,19px)", fontWeight: 500, color: "rgba(245,245,247,.6)", fontFamily: FONT, lineHeight: 1.5, marginBottom: 8 }}>
                오픈 카카오톡으로 편하게 문의하세요.
              </p>
              <p style={{ fontSize: 14, color: "rgba(245,245,247,.3)", fontFamily: FONT, lineHeight: 1.5 }}>
                답변이 늦을 경우 전화로 연락해 주세요.
              </p>
            </div>
            <a href="https://open.kakao.com/o/sN3edXki" target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setKakaoHover(true)} onMouseLeave={() => setKakaoHover(false)}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: kakaoHover ? "#FFE300" : "#FEE500",
                color: "#191919", borderRadius: 14, padding: "16px 24px",
                fontSize: 16, fontWeight: 700, textDecoration: "none",
                transform: kakaoHover ? "scale(1.02)" : "scale(1)",
                boxShadow: kakaoHover ? "0 4px 24px rgba(254,229,0,.25)" : "0 2px 8px rgba(254,229,0,.1)",
                transition: "all .35s cubic-bezier(.16,1,.3,1)",
                fontFamily: FONT, marginTop: 28,
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.66 6.62-.15.56-.96 3.6-.99 3.83 0 0-.02.17.09.23.11.07.24.02.24.02.31-.04 3.65-2.4 4.22-2.81.58.08 1.17.12 1.78.12 5.52 0 10-3.58 10-7.99C22 6.58 17.52 3 12 3z"/>
              </svg>
              오픈 카카오톡 문의하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ FOOTER ══════════════════ */
function Footer() {
  return (
    <footer style={{
      background: "#000", borderTop: "1px solid rgba(255,255,255,.06)",
      padding: "32px max(24px,10vw)", fontFamily: FONT,
    }}>
      <div style={{
        maxWidth: 980, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12, fontSize: 12, color: "rgba(245,245,247,.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontWeight: 800, fontSize: 14,
            background: "linear-gradient(90deg,#f7c948,#a855f7,#2997ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>깔</span>
          <span style={{ opacity: .4 }}>·</span>
          <span>KNUAF HIP-HOP CLUB</span>
        </div>
        <div style={{ color: "rgba(245,245,247,.2)" }}>© 2026</div>
      </div>
    </footer>
  );
}

/* ══════════════════ APP ══════════════════ */
export default function App() {
  return (
    <div style={{ background: "#000", color: "#f5f5f7", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#000;overflow-x:hidden}
        ::selection{background:rgba(41,151,255,.3);color:#fff}
        @media(max-width:600px){section{padding-left:20px!important;padding-right:20px!important}}
      `}</style>
      <Nav />
      <HeroSection />
      <AboutSection />
      <HowSection />
      <SpeakerSection />
      <JoinSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
