import { useState, useEffect, useRef } from "react";

const FONT = `'Pretendard','Apple SD Gothic Neo',-apple-system,BlinkMacSystemFont,sans-serif`;
const FONT_EN = `'SF Pro Display','Helvetica Neue',${FONT}`;

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useFadeIn(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, y = 36, duration = 1.1, style = {} }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
      transition: `opacity ${duration}s cubic-bezier(.25,.1,.25,1) ${delay}s, transform ${duration}s cubic-bezier(.25,.1,.25,1) ${delay}s`,
      willChange: "opacity, transform",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ══════════ NAV ══════════ */
function Nav({ scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 max(24px,4vw)", height: 52,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(0,0,0,.92)" : "transparent",
      transition: "background .5s ease",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "1px solid transparent",
      fontFamily: FONT,
    }}>
      <div onClick={() => scrollTo("hero")}
        style={{ fontWeight: 800, fontSize: 17, color: "#f5f5f7", cursor: "pointer", letterSpacing: "-.03em" }}>깔</div>
      <div style={{ display: "flex", gap: 32, fontSize: 12.5, fontWeight: 500, color: "rgba(245,245,247,.8)" }}>
        {[["소개","about"],["활동","how"],["혜택","perks"],["지원","join"],["문의","contact"]].map(([l,id]) => (
          <span key={id} onClick={() => scrollTo(id)}
            style={{ cursor: "pointer", transition: "color .3s" }}
            onMouseEnter={e => e.target.style.color = "#f5f5f7"}
            onMouseLeave={e => e.target.style.color = "rgba(245,245,247,.8)"}>{l}</span>
        ))}
      </div>
    </nav>
  );
}

/* ══════════ HERO ══════════ */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  return (
    <section id="hero" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", background: "#000",
      paddingBottom: 120,
    }}>
      <div className="hero-bg" style={{
        position: "absolute", inset: 0,
        opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease",
      }}>
        <div className="hero-orb" style={{
          position: "absolute", width: "70vmax", height: "70vmax", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,60,.12) 0%, transparent 55%)",
          left: "15%", top: "10%",
        }} />
        <div className="hero-orb" style={{
          position: "absolute", width: "60vmax", height: "60vmax", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(60,120,255,.1) 0%, transparent 55%)",
          right: "10%", bottom: "10%",
        }} />
      </div>

      {/* Bottom fade to smooth transition */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
        background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
        <div className={loaded ? "anim-fade-up anim-d1" : "anim-hidden"} style={{
          fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 700,
          letterSpacing: ".18em", fontFamily: FONT_EN,
          background: "linear-gradient(90deg,#f7c948,#f0a030,#e07828,#d05a28,#a855f7,#6d5bf7,#2997ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>KNUAF HIP-HOP CLUB</div>

        <div className={loaded ? "anim-fade-up anim-d2" : "anim-hidden"} style={{
          fontSize: "clamp(110px,24vw,280px)", fontWeight: 900,
          letterSpacing: "-.06em", lineHeight: 1, fontFamily: FONT, color: "#f5f5f7", marginTop: 16,
        }}>깔</div>

        <div className={loaded ? "anim-fade-up anim-d3" : "anim-hidden"} style={{
          fontSize: "clamp(20px,3vw,34px)", fontWeight: 800,
          letterSpacing: "-.03em", lineHeight: 1.3, fontFamily: FONT, marginTop: 24,
          background: "linear-gradient(90deg,#f7c948,#e8a030,#d06828,#a855f7,#6d5bf7,#2997ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          한농대 유일 힙합 동아리.
        </div>

        <div className={loaded ? "anim-fade-up anim-d4" : "anim-hidden"} style={{ marginTop: 48 }}>
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

/* ══════════ ABOUT ══════════ */
function AboutSection() {
  return (
    <section id="about" style={{
      background: "#000", padding: "100px max(24px,10vw) 120px",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <FadeIn y={44} duration={1.3}>
          <h2 className="text-reveal" style={{
            fontSize: "clamp(52px,9vw,108px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT, color: "#f5f5f7",
          }}>일단 핵심부터.</h2>
        </FadeIn>

        <FadeIn delay={0.15} y={0} duration={1}>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,.08)", margin: "56px 0" }} />
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
          gap: "36px 56px",
        }}>
          <FadeIn delay={0.2} y={40} duration={1.2}>
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
          </FadeIn>
          <FadeIn delay={0.35} y={40} duration={1.2}>
            <p style={{
              fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.7,
              color: "rgba(245,245,247,.6)", fontWeight: 400, fontFamily: FONT,
            }}>
              각자 한 주 동안 가장 즐겨 들었거나 새로 찾아낸 노래를 공유합니다.
              노래를 고른 이유에 대해 가볍게 이야기를 나누며, 리스너들끼리
              자연스럽게 교류하는 자리입니다.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ══════════ HOW ══════════ */
function HowSection() {
  const items = [
    { num: "01", icon: "🎵", title: "한 곡 고르기", desc: "이번 주에 가장 많이 들은 곡, 새로 발견한 곡 — 무엇이든." },
    { num: "02", icon: "🔊", title: "같이 듣기", desc: "스피커 + 무손실 음원. 베이스가 생명이니까." },
    { num: "03", icon: "💬", title: "이야기", desc: "왜 이 곡인지, 어떤 부분이 좋은지. 부담 없이." },
    { num: "04", icon: "🤝", title: "연결", desc: "취향을 나누다 보면 통하는 사람을 만나게 됩니다." },
  ];

  return (
    <section id="how" style={{
      background: "#000", padding: "120px max(24px,10vw) 120px",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <FadeIn y={44} duration={1.3}>
          <h2 className="text-reveal" style={{
            fontSize: "clamp(48px,8vw,96px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT, color: "#f5f5f7",
          }}>이렇게 진행돼요.</h2>
        </FadeIn>

        <FadeIn delay={0.15} y={0} duration={1}>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,.08)", margin: "56px 0 44px" }} />
        </FadeIn>

        {items.map((item, i) => (
          <FadeIn key={item.num} delay={0.12 + i * 0.12} y={28} duration={1.1}>
            <StepRow item={item} />
          </FadeIn>
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
        transition: "background .4s ease",
      }}>
      <div style={{
        fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 600,
        color: hovered ? "#2997ff" : "rgba(245,245,247,.25)",
        fontFamily: FONT_EN, paddingTop: 4, transition: "color .5s ease",
      }}>{item.num}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{
            fontSize: "clamp(24px,3vw,32px)",
            transform: hovered ? "scale(1.12)" : "scale(1)",
            transition: "transform .5s cubic-bezier(.25,.1,.25,1)",
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

/* ══════════ SPEAKER ══════════ */
function SpeakerSection() {
  const [ref, visible] = useFadeIn(0.1);

  return (
    <section style={{
      padding: "120px max(24px,8vw) 140px", background: "#000", overflow: "hidden",
    }}>
      <div ref={ref} style={{
        maxWidth: 980, margin: "0 auto",
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0) scale(1)" : "translate3d(0,50px,0) scale(0.94)",
        transition: "all 1.4s cubic-bezier(.25,.1,.25,1)",
      }}>
        <div style={{ position: "relative", marginBottom: 56 }}>
          <div style={{
            width: "min(280px,52vw)", height: "min(280px,52vw)",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #282828 0%, #3c3c3c 15%, #232323 30%, #373737 50%, #1e1e1e 65%, #323232 80%, #282828 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: visible
              ? "0 0 120px rgba(247,201,72,.1), 0 0 130px rgba(168,85,247,.06), 0 0 160px rgba(41,151,255,.05), inset 0 0 80px rgba(0,0,0,.7)"
              : "inset 0 0 80px rgba(0,0,0,.7)",
            transition: "box-shadow 2.5s ease",
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
                boxShadow: "0 0 6px rgba(255,255,255,.18), inset 0 1px 10px rgba(0,0,0,.4)",
              }} />
            </div>
            <div style={{ position: "absolute", inset: "5%", borderRadius: "50%", border: "1px solid rgba(255,255,255,.04)", pointerEvents: "none" }} />

            {visible && [
              { d: 0, c: "247,201,72", off: -14 },
              { d: .6, c: "168,85,247", off: -32 },
              { d: 1.2, c: "41,151,255", off: -50 },
            ].map((r, i) => (
              <div key={i} style={{
                position: "absolute", inset: r.off, borderRadius: "50%",
                border: `1.5px solid rgba(${r.c},.2)`,
                animation: `speakerPulse 2.8s ease-out infinite ${r.d}s`,
              }} />
            ))}
          </div>
        </div>

        <h3 className="text-reveal" style={{
          fontSize: "clamp(34px,6vw,72px)", fontWeight: 900,
          letterSpacing: "-.05em", lineHeight: 1.12, fontFamily: FONT, marginBottom: 16,
        }}>
          <span style={{ color: "#f5f5f7" }}>베이스가 생명.</span><br />
          <span style={{
            background: "linear-gradient(90deg,#f7c948,#e8a030,#a855f7,#6d5bf7,#2997ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>제대로 된 사운드.</span>
        </h3>
        <p style={{
          fontSize: "clamp(15px,1.8vw,19px)",
          color: "rgba(245,245,247,.4)", fontWeight: 500, fontFamily: FONT,
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

/* ══════════ PERKS ══════════ */
function PerksSection() {
  const perks = [
    {
      emoji: "🍿",
      title: "간식 · 음료\n무한 제공",
      desc: "모임마다 먹을 거 걱정은 없습니다.\n음악에만 집중하세요.",
      accent: "#f7c948",
    },
    {
      emoji: "🎪",
      title: "학기별\n특별 활동",
      desc: "힙플페 같은 힙합 페스티벌,\n같이 가요.",
      accent: "#e07828",
    },
    {
      emoji: "🎁",
      title: "동아리\n전용 굿즈",
      desc: "스티커, 키링 등\n깔 멤버만의 소장품.",
      accent: "#a855f7",
    },
    {
      emoji: "📸",
      title: "이번 주\nOO의 픽",
      desc: "멤버별 선곡 프로필을\n인스타에 소개합니다.",
      accent: "#2997ff",
    },
  ];

  return (
    <section id="perks" style={{
      background: "#000", padding: "120px max(24px,10vw) 140px",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <FadeIn y={44} duration={1.3}>
          <h2 className="text-reveal" style={{
            fontSize: "clamp(48px,8vw,96px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT, color: "#f5f5f7",
          }}>멤버 혜택.</h2>
        </FadeIn>

        <FadeIn delay={0.12} y={20} duration={1}>
          <p style={{
            fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 500,
            color: "rgba(245,245,247,.45)", fontFamily: FONT,
            marginTop: 20, marginBottom: 56, letterSpacing: "-.01em",
          }}>깔에 들어오면 이런 것들이 기다리고 있어요.</p>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(220px,100%),1fr))",
          gap: 16,
          alignItems: "stretch",
        }}>
          {perks.map((perk, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.1} y={36} duration={1.1} style={{ height: "100%" }}>
              <PerkCard perk={perk} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PerkCard({ perk }) {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const idCounter = useRef(0);

  const spawnParticles = () => {
    const newParticles = Array.from({ length: 12 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      const size = 16 + Math.random() * 18;
      return {
        id: idCounter.current++,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: Math.random() * 360 - 180,
        size,
        delay: Math.random() * 0.15,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 900);
  };

  return (
    <div
      onMouseEnter={() => { setHovered(true); spawnParticles(); }}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => { setHovered(true); spawnParticles(); }}
      style={{
        background: hovered
          ? `linear-gradient(165deg, ${perk.accent}12 0%, rgba(255,255,255,.06) 40%, rgba(255,255,255,.03) 100%)`
          : "rgba(255,255,255,.03)",
        borderRadius: 24,
        padding: "clamp(32px,4vw,44px) clamp(24px,3vw,32px)",
        border: `1px solid ${hovered ? perk.accent + '30' : 'rgba(255,255,255,.06)'}`,
        cursor: "default",
        transition: "all .5s cubic-bezier(.25,.1,.25,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        position: "relative",
        overflow: "visible",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${perk.accent}${hovered ? '18' : '08'} 0%, transparent 70%)`,
        transition: "background .5s ease",
        pointerEvents: "none",
      }} />

      {/* Emoji with particle burst */}
      <div style={{ position: "relative", width: "fit-content", marginBottom: 24 }}>
        {/* Main emoji */}
        <div style={{
          fontSize: 48,
          transform: hovered ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)",
          transition: "transform .5s cubic-bezier(.25,.1,.25,1)",
          display: "inline-block",
          position: "relative", zIndex: 2,
        }}>
          {perk.emoji}
        </div>

        {/* Particles */}
        {particles.map((p) => (
          <span key={p.id} style={{
            position: "absolute",
            left: 20, top: 20,
            fontSize: p.size,
            pointerEvents: "none",
            zIndex: 1,
            animation: `emojiBurst .75s cubic-bezier(.25,.1,.25,1) ${p.delay}s forwards`,
            opacity: 0,
            ['--tx']: `${p.x}px`,
            ['--ty']: `${p.y}px`,
            ['--rot']: `${p.rotation}deg`,
          }}>
            {perk.emoji}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "clamp(22px,2.8vw,28px)", fontWeight: 800,
        color: "#f5f5f7", letterSpacing: "-.03em",
        lineHeight: 1.25, fontFamily: FONT,
        marginBottom: 14, whiteSpace: "pre-line",
      }}>
        {perk.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6,
        color: "rgba(245,245,247,.45)", fontFamily: FONT,
        whiteSpace: "pre-line", marginTop: "auto",
      }}>
        {perk.desc}
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: "10%", right: "10%",
        height: 2, borderRadius: 1,
        background: `linear-gradient(90deg, transparent, ${perk.accent}${hovered ? '50' : '00'}, transparent)`,
        transition: "background .5s ease",
      }} />
    </div>
  );
}

/* ══════════ JOIN ══════════ */
function JoinSection() {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <section id="join" style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center",
      background: "#000", padding: "120px max(24px,8vw)",
    }}>
      <div style={{ maxWidth: 800 }}>
        <FadeIn y={20} duration={1}>
          <div style={{
            fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 700,
            letterSpacing: ".2em", fontFamily: FONT_EN,
            color: "rgba(245,245,247,.3)", marginBottom: 24,
          }}>NOW RECRUITING</div>
        </FadeIn>

        <FadeIn delay={0.12} y={50} duration={1.4}>
          <h2 className="text-reveal" style={{
            fontSize: "clamp(52px,10vw,120px)", fontWeight: 900,
            lineHeight: 1.02, letterSpacing: "-.06em", fontFamily: FONT, marginBottom: 32,
          }}>
            <span style={{ color: "#f5f5f7" }}>너의 플리,</span><br />
            <span style={{
              background: "linear-gradient(90deg,#f7c948,#e8a030,#d06828,#a855f7,#6d5bf7,#2997ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>들려줘.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.28} y={32} duration={1.2}>
          <p style={{
            fontSize: "clamp(16px,2vw,21px)", lineHeight: 1.65,
            color: "rgba(245,245,247,.5)", fontFamily: FONT,
            maxWidth: 500, margin: "0 auto",
          }}>
            잘하실 필요도, 랩이나 프로듀싱 경험이 있을 필요도 없습니다.<br />
            힙합을 좋아하고 즐기시는 분이라면 누구든 환영합니다.
          </p>
        </FadeIn>

        <FadeIn delay={0.42} y={24} duration={1.1}>
          <div style={{
            marginTop: 48, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 16,
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
                transition: "all .5s cubic-bezier(.25,.1,.25,1)",
              }}>멤버 신청하기 <span style={{ fontWeight: 400 }}>→</span></a>
            <span style={{ fontSize: 13, color: "rgba(245,245,247,.2)", fontFamily: FONT }}>네이버 폼으로 연결됩니다</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ══════════ CONTACT ══════════ */
function ContactSection() {
  const [dmHover, setDmHover] = useState(false);
  const [followHover, setFollowHover] = useState(false);

  return (
    <section id="contact" style={{
      background: "#000", padding: "120px max(24px,10vw) 120px",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <FadeIn y={44} duration={1.3}>
          <h2 className="text-reveal" style={{
            fontSize: "clamp(48px,8vw,96px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-.05em", fontFamily: FONT, color: "#f5f5f7",
          }}>문의.</h2>
        </FadeIn>

        <FadeIn delay={0.15} y={0} duration={1}>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,.08)", margin: "56px 0" }} />
        </FadeIn>

        <FadeIn delay={0.2} y={36} duration={1.2}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
            gap: 24,
          }}>
            {/* Contact info */}
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

            {/* Instagram DM card */}
            <div style={{
              background: "rgba(255,255,255,.04)", borderRadius: 20,
              padding: "clamp(28px,4vw,40px)",
              border: "1px solid rgba(255,255,255,.06)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              position: "relative", overflow: "hidden",
            }}>
              {/* Insta gradient glow top-right */}
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 180, height: 180, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(225,48,108,.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative" }}>
                {/* Header with icon */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "linear-gradient(135deg, #833AB4 0%, #C13584 30%, #E1306C 50%, #F77737 70%, #FCAF45 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#f5f5f7", fontFamily: FONT }}>@knuaf_kkal</div>
                    <div style={{ fontSize: 13, color: "rgba(245,245,247,.4)", fontFamily: FONT }}>KNUAF HIP-HOP CLUB</div>
                  </div>
                </div>

                <p style={{
                  fontSize: "clamp(17px,2vw,20px)", fontWeight: 600,
                  color: "#f5f5f7", fontFamily: FONT, lineHeight: 1.4,
                  marginBottom: 10,
                }}>
                  궁금한 건 DM으로 편하게 물어보세요.
                </p>
                <p style={{
                  fontSize: 14, color: "rgba(245,245,247,.35)", fontFamily: FONT, lineHeight: 1.5,
                }}>
                  동아리 소식, 멤버 선곡 프로필도 인스타에서 확인할 수 있어요.
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
                <a href="https://www.instagram.com/knuaf_kkal" target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setDmHover(true)} onMouseLeave={() => setDmHover(false)}
                  style={{
                    flex: 1, minWidth: 140,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: dmHover
                      ? "linear-gradient(135deg, #9B3FC1 0%, #D1358A 30%, #E8367A 50%, #F88040 70%, #FCBA50 100%)"
                      : "linear-gradient(135deg, #833AB4 0%, #C13584 30%, #E1306C 50%, #F77737 70%, #FCAF45 100%)",
                    color: "#fff", borderRadius: 14, padding: "15px 20px",
                    fontSize: 15, fontWeight: 700, textDecoration: "none",
                    transform: dmHover ? "scale(1.02)" : "scale(1)",
                    boxShadow: dmHover ? "0 4px 28px rgba(225,48,108,.35)" : "0 2px 10px rgba(225,48,108,.15)",
                    transition: "all .45s cubic-bezier(.25,.1,.25,1)",
                    fontFamily: FONT,
                  }}>
                  {/* DM icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  DM 보내기
                </a>
                <a href="https://www.instagram.com/knuaf_kkal" target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setFollowHover(true)} onMouseLeave={() => setFollowHover(false)}
                  style={{
                    flex: 1, minWidth: 140,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: followHover ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.08)",
                    color: "#f5f5f7", borderRadius: 14, padding: "15px 20px",
                    fontSize: 15, fontWeight: 600, textDecoration: "none",
                    border: "1px solid rgba(255,255,255,.12)",
                    transform: followHover ? "scale(1.02)" : "scale(1)",
                    transition: "all .45s cubic-bezier(.25,.1,.25,1)",
                    fontFamily: FONT,
                  }}>
                  팔로우하기
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ══════════ FOOTER ══════════ */
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

/* ══════════ APP ══════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: "#000", color: "#f5f5f7", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#000;overflow-x:hidden;-webkit-overflow-scrolling:touch}
        ::selection{background:rgba(41,151,255,.3);color:#fff}

        /* ── Text animation classes ── */
        .anim-hidden {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
        }
        .anim-fade-up {
          animation: fadeUp 1.3s cubic-bezier(.25,.1,.25,1) forwards;
        }
        .anim-d1 { animation-delay: .2s; opacity: 0; }
        .anim-d2 { animation-delay: .45s; opacity: 0; }
        .anim-d3 { animation-delay: .75s; opacity: 0; }
        .anim-d4 { animation-delay: 1.05s; opacity: 0; }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translate3d(0, 28px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* ── Section heading float ── */
        .text-reveal {
          animation: headingFloat 4s ease-in-out infinite;
        }
        @keyframes headingFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -14px, 0) scale(1.01); }
        }

        @keyframes emojiBurst {
          0% {
            transform: translate3d(0, 0, 0) scale(0.3) rotate(0deg);
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--tx), var(--ty), 0) scale(1) rotate(var(--rot));
            opacity: 0;
          }
        }

        /* Desktop: blur orbs */
        @media(min-width:769px){
          .hero-orb{filter:blur(80px)}
        }
        /* Mobile: no blur */
        @media(max-width:768px){
          .hero-orb{filter:none;opacity:.7}
          section{padding-left:20px!important;padding-right:20px!important}
        }
      `}</style>
      <Nav scrolled={scrolled} />
      <HeroSection />
      <AboutSection />
      <HowSection />
      <SpeakerSection />
      <PerksSection />
      <JoinSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
