import { useState, useEffect, useRef } from "react";

// Hook para animación de reveal al hacer scroll
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// Hook para contador animado
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const numeric = parseFloat(target);
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * numeric));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numeric);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// Componente Stat animado
function AnimatedStat({ num, label, suffix = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const numeric = parseFloat(num.replace(/[^0-9.]/g, ""));
  const count = useCounter(numeric, 1200, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={styles.heroStat}>
      <div style={styles.heroStatNum}>
        {count}{suffix}
      </div>
      <div style={styles.heroStatLabel}>{label}</div>
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const navLinks = [
    { href: "#predictions", label: "Predicciones" },
    { href: "#features", label: "Funciones" },
    { href: "#live", label: "En Vivo" },
    { href: "#oracle", label: "Scouter Oracle" },
    { href: "#data", label: "Datos" },
    { href: "#gallery", label: "Capturas" },
  ];

  return (
    <div style={styles.root}>
      {/* ===================== HEADER ===================== */}
      <header style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <a href="#top" style={styles.navLogo} aria-label="Scouter home">
            {/* TODO: Reemplazar con /assets/img/app-icon.svg real */}
            <div style={styles.appIconFallback}>⚽</div>
            <span style={styles.wordmark}>Scouter</span>
          </a>

          <ul style={styles.navLinks}>
            {navLinks.map((l) => (
              <li key={l.href} style={{ listStyle: "none" }}>
                <a href={l.href} style={styles.navLink}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div style={styles.navCta}>
            <a href="#install" style={styles.btnPrimary}>Obtener la app</a>
            <button
              style={styles.burger}
              aria-label="Menú"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span style={{ ...styles.burgerLine, ...(mobileOpen ? styles.burgerLine1Open : {}) }} />
              <span style={{ ...styles.burgerLine, ...(mobileOpen ? styles.burgerLine2Open : {}) }} />
              <span style={{ ...styles.burgerLine, ...(mobileOpen ? styles.burgerLine3Open : {}) }} />
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MOBILE NAV ===================== */}
      <nav
        style={{
          ...styles.mobileNav,
          ...(mobileOpen ? styles.mobileNavOpen : {}),
        }}
        aria-label="Navegación móvil"
      >
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} style={styles.mobileNavLink} onClick={closeMenu}>
            {l.label}
          </a>
        ))}
        <a href="#install" style={styles.mobileNavCta} onClick={closeMenu}>
          Obtener la app
        </a>
      </nav>

      {/* ===================== HERO ===================== */}
      <section style={styles.hero} id="top">
        <div style={styles.heroGrid}>
          {/* Left col */}
          <div style={styles.heroLeft}>
            <span style={styles.eyebrow}>Inteligencia de fútbol con IA</span>
            <h1 style={styles.h1}>
              Apuestas de fútbol más inteligentes.{" "}
              <span style={styles.accent}>En vivo, cada minuto.</span>
            </h1>
            <p style={styles.heroParagraph}>
              Scouter combina predicciones de fútbol con IA, marcadores en vivo y análisis en tiempo real en más de 1.000 ligas, para que cada decisión esté respaldada por datos desde el pitido inicial hasta el final.
            </p>
            <div style={styles.storeBadges}>
              {/* TODO: Reemplazar con imágenes SVG reales de App Store y Google Play */}
              <a
                href="https://apps.apple.com/app/scouter-soccer-live-scores/id1569637963"
                style={styles.storeBadge}
                aria-label="Descargar en App Store"
              >
                <div style={styles.badgeFallback}>
                  <span style={styles.badgeIcon}>🍎</span>
                  <div>
                    <div style={styles.badgeSmall}>Descargar en el</div>
                    <div style={styles.badgeBig}>App Store</div>
                  </div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.artlines.scouter"
                style={styles.storeBadge}
                aria-label="Disponible en Google Play"
              >
                <div style={styles.badgeFallback}>
                  <span style={styles.badgeIcon}>▶</span>
                  <div>
                    <div style={styles.badgeSmall}>Disponible en</div>
                    <div style={styles.badgeBig}>Google Play</div>
                  </div>
                </div>
              </a>
            </div>
            <div style={styles.heroStats}>
              <AnimatedStat num="1000" suffix="+" label="Ligas cubiertas" />
              <div style={styles.heroStatDivider} />
              <AnimatedStat num="84" suffix="%" label="Precisión de tips" />
              <div style={styles.heroStatDivider} />
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>24/7</div>
                <div style={styles.heroStatLabel}>Cobertura en vivo</div>
              </div>
            </div>
          </div>

          {/* Right col — hero visual */}
          <div style={styles.heroVisual} aria-hidden="true">
            {/* Floating chips */}
            <div style={{ ...styles.floatChip, ...styles.chipXg }}>
              <div>
                <small style={styles.chipSmall}>xG en Vivo</small>
                <div style={styles.chipValue}>2.02 · 0.55</div>
              </div>
            </div>
            <div style={{ ...styles.floatChip, ...styles.chipVerdict }}>
              <span style={{ ...styles.dot, backgroundColor: "#f59e0b" }} />
              <div>
                <small style={styles.chipSmall}>Scouter Oracle · 60'</small>
                <div style={{ ...styles.chipValue, color: "#f59e0b", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                  MANTÉN TU APUESTA
                </div>
              </div>
            </div>
            <div style={{ ...styles.floatChip, ...styles.chipLive }}>
              <span style={{ ...styles.dot, backgroundColor: "#22c55e" }} />
              <div>
                <small style={styles.chipSmall}>Momentum · 71'</small>
                <div style={styles.chipValue}>Presión aumentando</div>
              </div>
            </div>
            {/* Phone mockups */}
            <div style={{ ...styles.phoneMockup, ...styles.phoneBack }}>
              {/* TODO: Reemplazar con /assets/img/screens/dark-mode.png */}
              <div style={styles.phoneScreen}>
                <PhoneDarkMockup />
              </div>
            </div>
            <div style={{ ...styles.phoneMockup, ...styles.phoneMain }}>
              {/* TODO: Reemplazar con /assets/img/screens/hot-tips.png */}
              <div style={styles.phoneScreen}>
                <PhoneHotTipsMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BAND ===================== */}
      <section style={styles.band}>
        <div style={styles.container}>
          <div style={styles.bandGrid}>
            {[
              {
                icon: <TrophyIcon />,
                title: "1.000+ competiciones",
                sub: "De la Premier League al Mundial",
                delay: 0,
              },
              {
                icon: <BoltIcon />,
                title: "Todo en tiempo real",
                sub: "Marcadores, alineaciones, eventos y alertas",
                delay: 1,
              },
              {
                icon: <TargetIcon />,
                title: "84% de precisión",
                sub: "Modelos IA entrenados con datos profundos",
                delay: 2,
              },
              {
                icon: <SparkleIcon />,
                title: "Análisis IA en juego",
                sub: "El Oracle re-evalúa tips mientras ves el partido",
                delay: 3,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal${item.delay > 0 ? ` reveal-d${item.delay}` : ""}`}
                style={styles.bandItem}
              >
                <div style={styles.bandIcon}>{item.icon}</div>
                <div>
                  <div style={styles.bandTitle}>{item.title}</div>
                  <div style={styles.bandSub}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PREDICTIONS ===================== */}
      <section style={styles.section} id="predictions">
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHead}>
            <span style={styles.eyebrow}>Tips VIP y Predicciones</span>
            <h2 style={styles.h2}>
              Una pantalla que{" "}
              <span style={styles.accent}>predice todo el partido</span>
            </h2>
            <p style={styles.sectionParagraph}>
              Abre cualquier partido y la pantalla de predicciones VIP está lista: un resumen de VIP Genius que convierte los números en acciones concretas, con un tip para cada mercado y niveles de confianza.
            </p>
          </div>

          <div className="reveal" style={styles.predStrip}>
            {[
              {
                badge: "1 · El resumen",
                // TODO: Reemplazar con /assets/img/screens/predictions-1.png
                img: null,
                mockup: <PredictionMockup1 />,
                title: "Acciones VIP Genius",
                desc: "Mejor ángulo, principales riesgos y resumen en palabras claras. No solo probabilidades: qué jugar, qué evitar y por qué.",
              },
              {
                badge: "2 · Los tips principales",
                // TODO: Reemplazar con /assets/img/screens/predictions-2.png
                img: null,
                mockup: <PredictionMockup2 />,
                title: "Un tip para cada mercado",
                desc: "Ganador, ganador primer tiempo, HT/FT, doble oportunidad y líneas de goles, con la selección Más Confiable marcada en verde.",
              },
              {
                badge: "3 · Los ángulos profundos",
                // TODO: Reemplazar con /assets/img/screens/predictions-3.png
                img: null,
                mockup: <PredictionMockup3 />,
                title: "Hasta el marcador y corners",
                desc: "Equipo que anota primero, marcador final exacto con la apuesta Más Arriesgada etiquetada honestamente, y líneas de corners. Todo con IA.",
              },
            ].map((step, i) => (
              <figure key={i} style={styles.predStep}>
                <span style={styles.predBadge}>{step.badge}</span>
                <div style={styles.predScreenWrap}>
                  {step.mockup}
                </div>
                <figcaption style={styles.predCaption}>
                  <h3 style={styles.predCaptionTitle}>{step.title}</h3>
                  <p style={styles.predCaptionText}>{step.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section style={{ ...styles.section, backgroundColor: "#0d130d" }} id="features">
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHead}>
            <span style={styles.eyebrow}>Todo en una app</span>
            <h2 style={styles.h2}>
              Diseñada para fans que se toman{" "}
              <span style={styles.accent}>cada partido en serio</span>
            </h2>
            <p style={styles.sectionParagraph}>
              Tips de apuestas de fútbol, datos en vivo e inteligencia del partido, todo en una sola app rápida.
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {[
              {
                icon: <SparkleIcon size={22} />,
                title: "Predicciones IA y Tips VIP",
                desc: "Picks diarios con IA: ganador, over/under, BTTS, mercados de primer tiempo y más, basados en forma del equipo, H2H, métricas de jugadores y tendencias.",
                delay: 0,
              },
              {
                icon: <SlipIcon />,
                title: "Generador de Boletos",
                desc: "Dile a Scouter cuántos partidos, tu nivel de riesgo y tus mercados favoritos, y construye un boleto respaldado por datos en segundos.",
                delay: 1,
              },
              {
                icon: <BellIcon />,
                title: "Marcadores en Vivo y Alertas",
                desc: "Marcadores en tiempo real, goles, alineaciones, eventos y clasificaciones, con notificaciones instantáneas para los equipos y partidos que sigues.",
                delay: 2,
              },
              {
                icon: <ChartIcon />,
                title: "Analíticas Avanzadas",
                desc: "Posesión, tiros, métricas de ataque, rendimiento de jugadores, tablas de posiciones y resultados históricos. El cuadro estadístico completo.",
                delay: 0,
              },
              {
                icon: <TrendIcon />,
                title: "Comparación de Cuotas",
                desc: "Cuotas en vivo de múltiples proveedores junto a cada predicción IA. Rastrea movimientos del mercado, detecta valor antes de que desaparezca.",
                delay: 1,
              },
              {
                icon: <PersonalizeIcon />,
                title: "Personalizada para ti",
                desc: "Sigue tus equipos, jugadores y ligas. Modo oscuro, múltiples idiomas y un feed personalizado que abre directo a lo que te importa.",
                delay: 2,
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`reveal${f.delay > 0 ? ` reveal-d${f.delay}` : ""}`}
                style={styles.fcard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={styles.fcardIcon}>{f.icon}</div>
                <h3 style={styles.fcardTitle}>{f.title}</h3>
                <p style={styles.fcardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LIVE ===================== */}
      <section style={styles.section} id="live">
        <div style={styles.container}>
          {/* Split 1 */}
          <div style={styles.split}>
            <div className="reveal" style={styles.splitCopy}>
              <span style={styles.eyebrow}>
                Inteligencia en vivo{" "}
                <span style={styles.tagNew}>Nuevo</span>
              </span>
              <h3 style={styles.h3}>
                xG en Vivo y xG a puerta, mientras el balón está en juego
              </h3>
              <p style={styles.splitParagraph}>
                Para partidos seleccionados, Scouter transmite expected goals y xG a puerta en tiempo real, para que puedas ver qué equipo está realmente creando peligro, no solo quién tiene el balón.
              </p>
              <ul style={styles.checkList}>
                {[
                  { bold: "xG en Vivo:", text: "calidad de ocasiones para ambos equipos, actualizado conforme avanza el partido" },
                  { bold: "xG a puerta:", text: "cuánto de ese peligro realmente exigió al portero" },
                  { bold: "Instantánea final:", text: "el cuadro al final del partido permanece en la página del partido" },
                ].map((item, i) => (
                  <li key={i} style={styles.checkItem}>
                    <span style={styles.checkIcon}><CheckIcon /></span>
                    <span><b style={{ color: "#e2e8f0" }}>{item.bold}</b> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal reveal-d1" style={styles.splitVisual}>
              <div style={styles.phoneMockupSmall}>
                {/* TODO: Reemplazar con /assets/img/screens/momentum-light.png */}
                <PhoneLiveMockup />
              </div>
            </div>
          </div>

          {/* Split 2 flipped */}
          <div style={{ ...styles.split, ...styles.splitFlip }}>
            <div className="reveal reveal-d1" style={styles.splitVisual}>
              <div style={styles.phoneMockupSmall}>
                {/* TODO: Reemplazar con /assets/img/screens/dark-mode.png */}
                <PhoneMomentumMockup />
              </div>
            </div>
            <div className="reveal" style={styles.splitCopy}>
              <span style={styles.eyebrow}>
                Inteligencia en vivo{" "}
                <span style={styles.tagNew}>Nuevo</span>
              </span>
              <h3 style={styles.h3}>
                Momentum del partido con índice de presión en vivo
              </h3>
              <p style={styles.splitParagraph}>
                El gráfico de momentum muestra quién está apretando para un gol, minuto a minuto. Los picos indican presión; los marcadores de goles muestran cuándo se materializó. Lee el partido como un scout.
              </p>
              <ul style={styles.checkList}>
                {[
                  { bold: "Momentum en vivo:", text: "quién domina el partido en cada momento" },
                  { bold: "Índice de presión:", text: "cuantifica las fases de ataque en un número" },
                  { bold: "Marcadores de goles:", text: "relaciona los picos de presión con los resultados" },
                ].map((item, i) => (
                  <li key={i} style={styles.checkItem}>
                    <span style={styles.checkIcon}><CheckIcon /></span>
                    <span><b style={{ color: "#e2e8f0" }}>{item.bold}</b> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ORACLE ===================== */}
      <section style={{ ...styles.section, backgroundColor: "#0d130d" }} id="oracle">
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHead}>
            <span style={styles.eyebrow}>Scouter Oracle</span>
            <h2 style={styles.h2}>
              IA que{" "}
              <span style={styles.accent}>piensa en tiempo real</span>
            </h2>
            <p style={styles.sectionParagraph}>
              El Oracle no es solo una predicción previa al partido. Re-evalúa tus tips mientras el partido avanza, alertándote cuando las condiciones cambian y tu apuesta necesita revisión.
            </p>
          </div>

          <div style={styles.oracleGrid}>
            {[
              {
                icon: "🧠",
                title: "Re-evaluación en juego",
                desc: "El Oracle monitorea cada partido y re-chequea tus tips activos con nuevos datos: goles, tarjetas, lesiones y cambio de momentum.",
              },
              {
                icon: "⚡",
                title: "Alertas instantáneas",
                desc: "Recibe una notificación cuando un tip se fortalece o debilita. Actúa en el momento preciso, no cuando ya es tarde.",
              },
              {
                icon: "📊",
                title: "Veredictos claros",
                desc: "MANTÉN TU APUESTA, CONSIDERAR CAMBIO o ACTUAR AHORA. Sin ambigüedades, solo orientación clara y accionable.",
              },
              {
                icon: "🎯",
                title: "Multiliga simultánea",
                desc: "Sigue múltiples partidos a la vez. El Oracle gestiona todo en paralelo para que no te pierdas ningún momento clave.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal"
                style={styles.oracleCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(74,222,128,0.06)";
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div style={styles.oracleEmoji}>{item.icon}</div>
                <h3 style={styles.oracleCardTitle}>{item.title}</h3>
                <p style={styles.oracleCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Oracle verdict chip demo */}
          <div className="reveal" style={styles.oracleDemo}>
            <div style={styles.oracleDemoChip}>
              <div style={styles.oracleDemoHeader}>
                <span style={styles.oracleDemoLive}>● EN VIVO</span>
                <span style={styles.oracleDemoTime}>67'</span>
              </div>
              <div style={styles.oracleDemoMatch}>Manchester City vs Liverpool</div>
              <div style={styles.oracleDemoVerdict}>
                <span style={styles.oracleVerdictBadge}>Oracle dice:</span>
                <span style={styles.oracleVerdictText}>MANTÉN TU APUESTA</span>
              </div>
              <div style={styles.oracleDemoStats}>
                <div style={styles.oracleStat}>
                  <div style={styles.oracleStatNum}>2.14</div>
                  <div style={styles.oracleStatLabel}>xG Casa</div>
                </div>
                <div style={styles.oracleStatDivider} />
                <div style={styles.oracleStat}>
                  <div style={styles.oracleStatNum}>0.72</div>
                  <div style={styles.oracleStatLabel}>xG Visita</div>
                </div>
                <div style={styles.oracleStatDivider} />
                <div style={styles.oracleStat}>
                  <div style={{ ...styles.oracleStatNum, color: "#22c55e" }}>87%</div>
                  <div style={styles.oracleStatLabel}>Confianza</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DATA ===================== */}
      <section style={styles.section} id="data">
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHead}>
            <span style={styles.eyebrow}>Datos del Partido</span>
            <h2 style={styles.h2}>
              El cuadro estadístico{" "}
              <span style={styles.accent}>completo</span>
            </h2>
            <p style={styles.sectionParagraph}>
              Detrás de cada predicción hay capas de datos: forma reciente, historial H2H, rendimiento de jugadores, métricas de liga y mucho más.
            </p>
          </div>

          <div style={styles.dataGrid}>
            {[
              { label: "Ligas cubiertas", value: "1.000+", color: "#4ade80" },
              { label: "Partidos por día", value: "500+", color: "#60a5fa" },
              { label: "Puntos de datos por partido", value: "200+", color: "#f59e0b" },
              { label: "Años de datos históricos", value: "10+", color: "#a78bfa" },
              { label: "Proveedores de cuotas", value: "20+", color: "#fb7185" },
              { label: "Precisión del modelo IA", value: "84%", color: "#4ade80" },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal"
                style={styles.dataCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = item.color + "60";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div style={{ ...styles.dataValue, color: item.color }}>{item.value}</div>
                <div style={styles.dataLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GALLERY ===================== */}
      <section style={{ ...styles.section, backgroundColor: "#0d130d" }} id="gallery">
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHead}>
            <span style={styles.eyebrow}>Capturas de Pantalla</span>
            <h2 style={styles.h2}>
              Mira{" "}
              <span style={styles.accent}>Scouter en acción</span>
            </h2>
            <p style={styles.sectionParagraph}>
              Una interfaz limpia y oscura diseñada para decisiones rápidas y fáciles durante los partidos.
            </p>
          </div>

          <div style={styles.galleryGrid}>
            {[
              { title: "Tips Calientes", sub: "VIP picks del día" },
              { title: "Predicciones", sub: "Análisis completo" },
              { title: "xG en Vivo", sub: "Métricas en tiempo real" },
              { title: "Oracle", sub: "Tips en juego" },
              { title: "Comparar Cuotas", sub: "Detecta valor" },
              { title: "Modo Oscuro", sub: "Perfecto para noches" },
            ].map((screen, i) => (
              <div
                key={i}
                className="reveal"
                style={styles.galleryItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.querySelector(".overlay").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.querySelector(".overlay").style.opacity = "0";
                }}
              >
                {/* TODO: Reemplazar con imágenes reales de /assets/img/screens/ */}
                <GalleryScreenMockup index={i} />
                <div className="overlay" style={styles.galleryOverlay}>
                  <div style={styles.galleryOverlayTitle}>{screen.title}</div>
                  <div style={styles.galleryOverlaySub}>{screen.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section style={styles.ctaSection} id="install">
        <div style={styles.container}>
          <div className="reveal" style={styles.ctaInner}>
            <div style={styles.ctaGlow} />
            <span style={styles.eyebrow}>Gratuita en iOS y Android</span>
            <h2 style={{ ...styles.h2, textAlign: "center", maxWidth: "600px" }}>
              Empieza a apostar con{" "}
              <span style={styles.accent}>inteligencia real</span>
            </h2>
            <p style={{ ...styles.sectionParagraph, textAlign: "center", maxWidth: "480px" }}>
              Descarga Scouter gratis y accede a predicciones IA, xG en vivo y el Oracle. Premier League, Champions League, La Liga y más de 1.000 ligas.
            </p>
            <div style={styles.ctaBadges}>
              <a
                href="https://apps.apple.com/app/scouter-soccer-live-scores/id1569637963"
                style={styles.ctaBadge}
                aria-label="Descargar en App Store"
              >
                <div style={styles.badgeFallbackLarge}>
                  <span style={styles.badgeIconLarge}>🍎</span>
                  <div>
                    <div style={styles.badgeSmallLarge}>Descargar en el</div>
                    <div style={styles.badgeBigLarge}>App Store</div>
                  </div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.artlines.scouter"
                style={styles.ctaBadge}
                aria-label="Disponible en Google Play"
              >
                <div style={styles.badgeFallbackLarge}>
                  <span style={styles.badgeIconLarge}>▶</span>
                  <div>
                    <div style={styles.badgeSmallLarge}>Disponible en</div>
                    <div style={styles.badgeBigLarge}>Google Play</div>
                  </div>
                </div>
              </a>
            </div>
            <div style={styles.ctaTrust}>
              <span style={styles.trustItem}>⭐ 4.8 App Store</span>
              <span style={styles.trustDot}>·</span>
              <span style={styles.trustItem}>⭐ 4.7 Google Play</span>
              <span style={styles.trustDot}>·</span>
              <span style={styles.trustItem}>500k+ Descargas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerInner}>
            <div style={styles.footerBrand}>
              <div style={styles.footerLogo}>
                <div style={styles.appIconFallbackSmall}>⚽</div>
                <span style={styles.footerWordmark}>Scouter</span>
              </div>
              <p style={styles.footerTagline}>
                Inteligencia de fútbol con IA para quienes se toman el juego en serio.
              </p>
              <p style={styles.footerDisclaimer}>
                Apuesta de forma responsable. El juego puede ser adictivo. Solo mayores de 18 años.
              </p>
            </div>
            <div style={styles.footerLinks}>
              <div style={styles.footerCol}>
                <div style={styles.footerColTitle}>App</div>
                <a href="#predictions" style={styles.footerLink}>Predicciones</a>
                <a href="#features" style={styles.footerLink}>Funciones</a>
                <a href="#live" style={styles.footerLink}>En Vivo</a>
                <a href="#oracle" style={styles.footerLink}>Oracle</a>
              </div>
              <div style={styles.footerCol}>
                <div style={styles.footerColTitle}>Descargar</div>
                <a
                  href="https://apps.apple.com/app/scouter-soccer-live-scores/id1569637963"
                  style={styles.footerLink}
                >
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.artlines.scouter"
                  style={styles.footerLink}
                >
                  Google Play
                </a>
              </div>
              <div style={styles.footerCol}>
                <div style={styles.footerColTitle}>Legal</div>
                {/* TODO: Agregar URLs reales de privacy/terms */}
                <a href="#" style={styles.footerLink}>Privacidad</a>
                <a href="#" style={styles.footerLink}>Términos</a>
                <a href="#" style={styles.footerLink}>Contacto</a>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <span>© 2025 Scouter. Todos los derechos reservados.</span>
            <span style={styles.footerBottomRight}>
              Hecho con ❤️ para fanáticos del fútbol
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===================== SVG ICONS =====================
function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SparkleIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
    </svg>
  );
}

function SlipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8h8" /><path d="M8 12h8" /><path d="M8 16h5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 15v-4" /><path d="M12 15V7" /><path d="M17 15v-7" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function PersonalizeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 3.6a1 1 0 0 1 1 0l2.6 1.9 3.2.2a1 1 0 0 1 .8.6l1 3 2 2.5a1 1 0 0 1 0 1.2l-2 2.5-1 3a1 1 0 0 1-.8.6l-3.2.2-2.6 1.9a1 1 0 0 1-1 0l-2.6-1.9-3.2-.2a1 1 0 0 1-.8-.6l-1-3-2-2.5a1 1 0 0 1 0-1.2l2-2.5 1-3a1 1 0 0 1 .8-.6l3.2-.2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ===================== PHONE MOCKUPS =====================
function PhoneDarkMockup() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#0f1f0f,#1a2e1a)", borderRadius: "28px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ background: "rgba(74,222,128,0.1)", borderRadius: "8px", padding: "10px 12px" }}>
        <div style={{ color: "#4ade80", fontSize: "0.65rem", fontWeight: 700, marginBottom: 4 }}>MOMENTUM EN VIVO · 71'</div>
        <div style={{ height: "40px", display: "flex", alignItems: "flex-end", gap: "2px" }}>
          {[20, 35, 60, 80, 55, 90, 70, 45, 65, 85, 75, 50].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i > 7 ? "#4ade80" : "rgba(74,222,128,0.3)", borderRadius: "2px 2px 0 0", transition: "height 0.3s" }} />
          ))}
        </div>
      </div>
      {[
        { home: "MCI", score: "2-0", away: "LIV", color: "#4ade80" },
        { home: "BAR", score: "1-1", away: "RMA", color: "#f59e0b" },
      ].map((m, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>{m.home}</span>
          <span style={{ color: m.color, fontSize: "0.8rem", fontWeight: 700 }}>{m.score}</span>
          <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>{m.away}</span>
        </div>
      ))}
    </div>
  );
}

function PhoneHotTipsMockup() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#080d08,#111811)", borderRadius: "28px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ color: "#4ade80", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>🔥 TIPS CALIENTES HOY</div>
      {[
        { match: "PSG vs Dortmund", tip: "PSG Gana", conf: "92%", odds: "1.65", color: "#4ade80" },
        { match: "Arsenal vs Chelsea", tip: "Más de 2.5 goles", conf: "87%", odds: "1.80", color: "#60a5fa" },
        { match: "Real Madrid vs Atletico", tip: "Ambos anotan", conf: "78%", odds: "1.90", color: "#f59e0b" },
      ].map((tip, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${tip.color}30`, borderRadius: "10px", padding: "10px 12px" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.6rem", marginBottom: 4 }}>{tip.match}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontSize: "0.72rem", fontWeight: 600 }}>{tip.tip}</span>
            <span style={{ color: tip.color, fontSize: "0.65rem", fontWeight: 700, background: `${tip.color}15`, padding: "2px 6px", borderRadius: "4px" }}>{tip.conf}</span>
          </div>
          <div style={{ color: "#64748b", fontSize: "0.6rem", marginTop: 3 }}>Cuota: {tip.odds}</div>
        </div>
      ))}
    </div>
  );
}

function PhoneLiveMockup() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#f8fafc,#e2e8f0)", borderRadius: "28px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ color: "#16a34a", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>● EN VIVO · 58'</div>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ color: "#1e293b", fontSize: "1rem", fontWeight: 800 }}>2 · 0</div>
        <div style={{ color: "#64748b", fontSize: "0.6rem" }}>MAN CITY · TOTTENHAM</div>
      </div>
      <div style={{ background: "white", borderRadius: "8px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ color: "#64748b", fontSize: "0.6rem", marginBottom: 6 }}>xG EN VIVO</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: 700 }}>2.14</span>
          <span style={{ color: "#94a3b8", fontSize: "0.65rem" }}>xG</span>
          <span style={{ color: "#1e293b", fontSize: "0.8rem", fontWeight: 700 }}>0.38</span>
        </div>
        <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg,#4ade80,#16a34a)", borderRadius: "4px" }} />
        </div>
      </div>
    </div>
  );
}

function PhoneMomentumMockup() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#0f1f0f,#1a2e1a)", borderRadius: "28px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ color: "#4ade80", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>ÍNDICE DE PRESIÓN</div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "1.5px", padding: "8px 0" }}>
        {[15, 30, 45, 20, 65, 80, 70, 90, 55, 40, 75, 85, 60, 35, 50, 95, 70, 45, 80, 65].map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h}%`,
            background: h > 70 ? "#4ade80" : h > 50 ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.2)",
            borderRadius: "2px 2px 0 0",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#64748b", fontSize: "0.6rem" }}>0'</span>
        <span style={{ color: "#4ade80", fontSize: "0.6rem" }}>● 71'</span>
        <span style={{ color: "#64748b", fontSize: "0.6rem" }}>90'</span>
      </div>
    </div>
  );
}

function PredictionMockup1() {
  return (
    <div style={{ background: "linear-gradient(160deg,#080d08,#111811)", borderRadius: "20px", padding: "14px", minHeight: "220px" }}>
      <div style={{ color: "#f59e0b", fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em" }}>⭐ VIP GENIUS</div>
      {[
        { label: "Mejor ángulo", value: "Apostar por PSG en casa" },
        { label: "Riesgo principal", value: "Defensa inestable fuera" },
        { label: "Resumen", value: "PSG dominante, aprovechar" },
      ].map((item, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "7px 10px", marginBottom: 5 }}>
          <div style={{ color: "#64748b", fontSize: "0.55rem" }}>{item.label}</div>
          <div style={{ color: "#e2e8f0", fontSize: "0.65rem", fontWeight: 500 }}>{item.value}</div>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <div style={{ color: "#64748b", fontSize: "0.55rem", marginBottom: 4 }}>PROBABILIDADES</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ l: "Local", v: "68%", c: "#4ade80" }, { l: "Empate", v: "19%", c: "#94a3b8" }, { l: "Visita", v: "13%", c: "#94a3b8" }].map((p, i) => (
            <div key={i} style={{ flex: 1, background: `${p.c}15`, border: `1px solid ${p.c}30`, borderRadius: "6px", padding: "5px", textAlign: "center" }}>
              <div style={{ color: p.c, fontSize: "0.7rem", fontWeight: 700 }}>{p.v}</div>
              <div style={{ color: "#64748b", fontSize: "0.5rem" }}>{p.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PredictionMockup2() {
  return (
    <div style={{ background: "linear-gradient(160deg,#080d08,#111811)", borderRadius: "20px", padding: "14px", minHeight: "220px" }}>
      <div style={{ color: "#4ade80", fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em" }}>TIPS PRINCIPALES</div>
      {[
        { market: "Ganador", tip: "PSG Gana", conf: "Más Confiable", color: "#4ade80", highlighted: true },
        { market: "1er Tiempo", tip: "PSG Gana 1T", conf: "87%", color: "#60a5fa", highlighted: false },
        { market: "Más de/Menos de", tip: "Más de 2.5", conf: "81%", color: "#f59e0b", highlighted: false },
        { market: "Doble Oportunidad", tip: "PSG/Empate", conf: "94%", color: "#94a3b8", highlighted: false },
      ].map((t, i) => (
        <div key={i} style={{ background: t.highlighted ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${t.highlighted ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "6px", padding: "7px 10px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.5rem" }}>{t.market}</div>
            <div style={{ color: "#e2e8f0", fontSize: "0.65rem", fontWeight: 600 }}>{t.tip}</div>
          </div>
          <span style={{ color: t.color, fontSize: "0.6rem", fontWeight: 700, background: `${t.color}15`, padding: "2px 6px", borderRadius: "4px" }}>{t.conf}</span>
        </div>
      ))}
    </div>
  );
}

function PredictionMockup3() {
  return (
    <div style={{ background: "linear-gradient(160deg,#080d08,#111811)", borderRadius: "20px", padding: "14px", minHeight: "220px" }}>
      <div style={{ color: "#a78bfa", fontSize: "0.6rem", fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em" }}>ÁNGULOS PROFUNDOS</div>
      {[
        { market: "1er Anotador", tip: "PSG anota primero", conf: "76%", color: "#60a5fa" },
        { market: "Marcador Exacto", tip: "2-0 PSG", conf: "⚠ Más Arriesgado", color: "#fb7185" },
        { market: "Corners Más", tip: "Más de 9.5", conf: "71%", color: "#f59e0b" },
        { market: "Corners Menos", tip: "Menos de 12.5", conf: "83%", color: "#4ade80" },
      ].map((t, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "7px 10px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.5rem" }}>{t.market}</div>
            <div style={{ color: "#e2e8f0", fontSize: "0.65rem", fontWeight: 600 }}>{t.tip}</div>
          </div>
          <span style={{ color: t.color, fontSize: "0.55rem", fontWeight: 700, background: `${t.color}15`, padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>{t.conf}</span>
        </div>
      ))}
    </div>
  );
}

function GalleryScreenMockup({ index }) {
  const colors = [
    ["#080d08", "#1a2e1a"],
    ["#0d1b0d", "#162916"],
    ["#0a1a0a", "#1f3320"],
    ["#080d08", "#111811"],
    ["#0d130d", "#1a241a"],
    ["#080d08", "#0f1f0f"],
  ];
  const labels = ["Tips Calientes", "Predicciones", "xG en Vivo", "Oracle", "Cuotas", "Modo Oscuro"];
  return (
    <div style={{
      width: "100%",
      paddingBottom: "177%",
      position: "relative",
      background: `linear-gradient(160deg,${colors[index][0]},${colors[index][1]})`,
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(74,222,128,0.15)",
    }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ fontSize: "2rem" }}>
          {["🔥", "🎯", "📊", "🧠", "📈", "🌙"][index]}
        </div>
        <div style={{ color: "#4ade80", fontSize: "0.7rem", fontWeight: 700 }}>{labels[index]}</div>
        <div style={{ width: "60%", height: "3px", background: "rgba(74,222,128,0.3)", borderRadius: "2px" }} />
        {/* Mini content blocks */}
        <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: 4 }}>
          {[1, 2, 3].map((j) => (
            <div key={j} style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: `${85 - j * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== STYLES =====================
const C = {
  bg: "#080d08",
  bgAlt: "#0d130d",
  green: "#4ade80",
  greenDark: "#16a34a",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textFaint: "#64748b",
  border: "rgba(255,255,255,0.06)",
  borderLight: "rgba(255,255,255,0.1)",
  navH: 68,
};

const styles = {
  root: {
    backgroundColor: C.bg,
    color: C.text,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    lineHeight: 1.6,
    overflowX: "hidden",
    minHeight: "100vh",
  },
  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "rgba(8,13,8,0.8)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${C.border}`,
    transition: "box-shadow 0.3s",
    height: C.navH,
    display: "flex",
    alignItems: "center",
  },
  navScrolled: {
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    flexShrink: 0,
  },
  appIconFallback: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  appIconFallbackSmall: {
    width: 28,
    height: 28,
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  wordmark: {
    color: C.text,
    fontWeight: 800,
    fontSize: "1.15rem",
    letterSpacing: "-0.02em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    listStyle: "none",
    margin: 0,
    padding: 0,
    flexWrap: "nowrap",
    "@media(max-width:900px)": { display: "none" },
  },
  navLink: {
    color: C.textMuted,
    textDecoration: "none",
    fontSize: "0.875rem",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "color 0.2s, background 0.2s",
    whiteSpace: "nowrap",
  },
  navCta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  btnPrimary: {
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    color: "#080d08",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.875rem",
    padding: "9px 20px",
    borderRadius: "8px",
    whiteSpace: "nowrap",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 0 20px rgba(74,222,128,0.3)",
  },
  burger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLine: {
    display: "block",
    width: "22px",
    height: "2px",
    backgroundColor: C.text,
    borderRadius: "2px",
    transition: "transform 0.3s, opacity 0.3s",
    transformOrigin: "center",
  },
  burgerLine1Open: { transform: "rotate(45deg) translate(5px,5px)" },
  burgerLine2Open: { opacity: 0 },
  burgerLine3Open: { transform: "rotate(-45deg) translate(5px,-5px)" },
  // MOBILE NAV
  mobileNav: {
    position: "fixed",
    top: C.navH,
    left: 0,
    right: 0,
    zIndex: 99,
    backgroundColor: "rgba(8,13,8,0.97)",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px 24px",
    gap: 4,
    transform: "translateY(-110%)",
    transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
    borderBottom: `1px solid ${C.border}`,
  },
  mobileNavOpen: {
    transform: "translateY(0)",
  },
  mobileNavLink: {
    color: C.textMuted,
    textDecoration: "none",
    fontSize: "1rem",
    padding: "12px 0",
    borderBottom: `1px solid ${C.border}`,
    transition: "color 0.2s",
  },
  mobileNavCta: {
    marginTop: 12,
    background: "linear-gradient(135deg,#4ade80,#16a34a)",
    color: "#080d08",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
    padding: "14px 20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  // HERO
  hero: {
    paddingTop: C.navH + 60,
    paddingBottom: 80,
    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,222,128,0.07) 0%, transparent 70%)",
    overflow: "hidden",
  },
  heroGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    alignItems: "center",
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  eyebrow: {
    color: C.green,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  h1: {
    fontSize: "clamp(2rem,4vw,3.2rem)",
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    color: C.text,
    margin: 0,
  },
  accent: {
    background: "linear-gradient(90deg,#4ade80,#86efac)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroParagraph: {
    color: C.textMuted,
    fontSize: "1.05rem",
    lineHeight: 1.7,
    margin: 0,
  },
  storeBadges: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  storeBadge: {
    textDecoration: "none",
    transition: "transform 0.2s",
  },
  badgeFallback: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "10px 16px",
    transition: "background 0.2s, border-color 0.2s",
  },
  badgeIcon: {
    fontSize: "1.3rem",
  },
  badgeSmall: {
    color: C.textFaint,
    fontSize: "0.6rem",
    lineHeight: 1,
  },
  badgeBig: {
    color: C.text,
    fontSize: "0.9rem",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  heroStats: {
    display: "flex",
    gap: 24,
    alignItems: "center",
    paddingTop: 8,
  },
  heroStat: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  heroStatNum: {
    fontSize: "1.8rem",
    fontWeight: 900,
    color: C.green,
    lineHeight: 1,
    letterSpacing: "-0.03em",
  },
  heroStatLabel: {
    color: C.textFaint,
    fontSize: "0.75rem",
  },
  heroStatDivider: {
    width: "1px",
    height: "36px",
    background: C.border,
  },
  // HERO VISUAL
  heroVisual: {
    position: "relative",
    height: "540px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  floatChip: {
    position: "absolute",
    background: "rgba(8,13,8,0.9)",
    border: "1px solid rgba(74,222,128,0.25)",
    borderRadius: "12px",
    padding: "10px 14px",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 10,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    animation: "floatChip 3s ease-in-out infinite",
  },
  chipXg: {
    top: "10%",
    right: "-5%",
  },
  chipVerdict: {
    bottom: "30%",
    right: "-8%",
  },
  chipLive: {
    bottom: "10%",
    left: "-5%",
  },
  chipSmall: {
    display: "block",
    color: C.textFaint,
    fontSize: "0.55rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    lineHeight: 1,
    marginBottom: 2,
  },
  chipValue: {
    color: C.text,
    fontSize: "0.75rem",
    fontWeight: 700,
    lineHeight: 1.2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 6px currentColor",
    animation: "pulse 2s infinite",
  },
  phoneMockup: {
    position: "absolute",
    borderRadius: "32px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
  },
  phoneBack: {
    width: "200px",
    height: "380px",
    top: "5%",
    left: "5%",
    opacity: 0.7,
    transform: "rotate(-8deg)",
    zIndex: 1,
  },
  phoneMain: {
    width: "220px",
    height: "420px",
    right: "5%",
    top: "3%",
    zIndex: 5,
    transform: "rotate(4deg)",
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  // BAND
  band: {
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    backgroundColor: "#0d130d",
    padding: "32px 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },
  bandGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  },
  bandItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.02)",
    transition: "background 0.2s",
  },
  bandIcon: {
    color: C.green,
    flexShrink: 0,
  },
  bandTitle: {
    color: C.text,
    fontWeight: 700,
    fontSize: "0.875rem",
    lineHeight: 1.3,
  },
  bandSub: {
    color: C.textFaint,
    fontSize: "0.75rem",
    marginTop: 2,
  },
  // SECTIONS
  section: {
    padding: "96px 0",
  },
  sectionHead: {
    textAlign: "center",
    marginBottom: 56,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  h2: {
    fontSize: "clamp(1.75rem,3.5vw,2.75rem)",
    fontWeight: 900,
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
    color: C.text,
    margin: 0,
  },
  sectionParagraph: {
    color: C.textMuted,
    fontSize: "1.05rem",
    lineHeight: 1.7,
    maxWidth: "600px",
    margin: 0,
    textAlign: "center",
  },
  // PREDICTIONS
  predStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 24,
  },
  predStep: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    margin: 0,
  },
  predBadge: {
    background: "rgba(74,222,128,0.1)",
    border: "1px solid rgba(74,222,128,0.25)",
    color: C.green,
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "20px",
    alignSelf: "flex-start",
    letterSpacing: "0.04em",
  },
  predScreenWrap: {
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  predCaption: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  predCaptionTitle: {
    color: C.text,
    fontWeight: 700,
    fontSize: "1rem",
    margin: 0,
  },
  predCaptionText: {
    color: C.textMuted,
    fontSize: "0.875rem",
    lineHeight: 1.6,
    margin: 0,
  },
  // FEATURES
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },
  fcard: {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "border-color 0.3s, transform 0.3s",
    cursor: "default",
  },
  fcardIcon: {
    color: C.green,
    width: 40,
    height: 40,
    background: "rgba(74,222,128,0.1)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fcardTitle: {
    color: C.text,
    fontWeight: 700,
    fontSize: "1rem",
    margin: 0,
    lineHeight: 1.3,
  },
  fcardDesc: {
    color: C.textMuted,
    fontSize: "0.875rem",
    lineHeight: 1.65,
    margin: 0,
  },
  // LIVE
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 64,
    alignItems: "center",
    marginBottom: 80,
  },
  splitFlip: {
    marginBottom: 0,
  },
  splitCopy: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  h3: {
    fontSize: "clamp(1.4rem,2.5vw,2rem)",
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
    color: C.text,
    margin: 0,
  },
  splitParagraph: {
    color: C.textMuted,
    fontSize: "0.95rem",
    lineHeight: 1.7,
    margin: 0,
  },
  checkList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    color: C.textMuted,
    fontSize: "0.9rem",
    lineHeight: 1.5,
  },
  checkIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  tagNew: {
    background: "rgba(74,222,128,0.15)",
    color: C.green,
    fontSize: "0.6rem",
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: "20px",
    marginLeft: 6,
    verticalAlign: "middle",
    letterSpacing: "0.05em",
  },
  splitVisual: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneMockupSmall: {
    width: "240px",
    height: "460px",
    borderRadius: "32px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  // ORACLE
  oracleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
    marginBottom: 48,
  },
  oracleCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    transition: "background 0.25s, border-color 0.25s",
    cursor: "default",
  },
  oracleEmoji: {
    fontSize: "1.8rem",
    lineHeight: 1,
  },
  oracleCardTitle: {
    color: C.text,
    fontWeight: 700,
    fontSize: "0.9rem",
    margin: 0,
  },
  oracleCardDesc: {
    color: C.textMuted,
    fontSize: "0.82rem",
    lineHeight: 1.6,
    margin: 0,
  },
  oracleDemo: {
    display: "flex",
    justifyContent: "center",
  },
  oracleDemoChip: {
    background: "rgba(74,222,128,0.05)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: "20px",
    padding: "24px 32px",
    maxWidth: "480px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    backdropFilter: "blur(8px)",
  },
  oracleDemoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  oracleDemoLive: {
    color: "#22c55e",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    animation: "pulse 2s infinite",
  },
  oracleDemoTime: {
    color: C.textFaint,
    fontSize: "0.75rem",
    background: "rgba(255,255,255,0.05)",
    padding: "2px 8px",
    borderRadius: "6px",
  },
  oracleDemoMatch: {
    color: C.text,
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  oracleDemoVerdict: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  oracleVerdictBadge: {
    color: C.textFaint,
    fontSize: "0.75rem",
  },
  oracleVerdictText: {
    color: "#f59e0b",
    fontWeight: 800,
    fontSize: "1rem",
    letterSpacing: "0.05em",
  },
  oracleDemoStats: {
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  oracleStat: {
    flex: 1,
    textAlign: "center",
  },
  oracleStatNum: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: C.text,
    lineHeight: 1,
  },
  oracleStatLabel: {
    color: C.textFaint,
    fontSize: "0.65rem",
    marginTop: 3,
  },
  oracleStatDivider: {
    width: "1px",
    height: "32px",
    background: C.border,
  },
  // DATA
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },
  dataCard: {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "32px 24px",
    textAlign: "center",
    transition: "transform 0.3s, border-color 0.3s",
    cursor: "default",
  },
  dataValue: {
    fontSize: "2.5rem",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    marginBottom: 8,
  },
  dataLabel: {
    color: C.textMuted,
    fontSize: "0.875rem",
  },
  // GALLERY
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },
  galleryItem: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "transform 0.3s",
    cursor: "pointer",
  },
  galleryOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(8,13,8,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    opacity: 0,
    transition: "opacity 0.3s",
    backdropFilter: "blur(4px)",
  },
  galleryOverlayTitle: {
    color: C.text,
    fontWeight: 800,
    fontSize: "1rem",
  },
  galleryOverlaySub: {
    color: C.green,
    fontSize: "0.8rem",
  },
  // CTA
  ctaSection: {
    padding: "96px 0",
    position: "relative",
    overflow: "hidden",
    backgroundImage: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(74,222,128,0.05) 0%, transparent 70%)",
    borderTop: `1px solid ${C.border}`,
  },
  ctaInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  ctaGlow: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle,rgba(74,222,128,0.08),transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
  },
  ctaBadges: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBadge: {
    textDecoration: "none",
    transition: "transform 0.2s",
  },
  badgeFallbackLarge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    padding: "14px 22px",
    transition: "background 0.2s, transform 0.2s",
  },
  badgeIconLarge: {
    fontSize: "1.7rem",
  },
  badgeSmallLarge: {
    color: C.textFaint,
    fontSize: "0.7rem",
    lineHeight: 1,
  },
  badgeBigLarge: {
    color: C.text,
    fontSize: "1.1rem",
    fontWeight: 800,
    lineHeight: 1.3,
  },
  ctaTrust: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  trustItem: {
    color: C.textFaint,
    fontSize: "0.875rem",
  },
  trustDot: {
    color: C.border,
  },
  // FOOTER
  footer: {
    backgroundColor: "#040804",
    borderTop: `1px solid ${C.border}`,
    padding: "56px 0 32px",
  },
  footerInner: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 48,
    marginBottom: 40,
  },
  footerBrand: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: "320px",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  footerWordmark: {
    color: C.text,
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  footerTagline: {
    color: C.textMuted,
    fontSize: "0.875rem",
    lineHeight: 1.6,
    margin: 0,
  },
  footerDisclaimer: {
    color: C.textFaint,
    fontSize: "0.75rem",
    lineHeight: 1.5,
    margin: 0,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "8px",
    borderLeft: `2px solid rgba(255,255,255,0.1)`,
  },
  footerLinks: {
    display: "flex",
    gap: 48,
  },
  footerCol: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  footerColTitle: {
    color: C.text,
    fontWeight: 700,
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  footerLink: {
    color: C.textMuted,
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "color 0.2s",
  },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    borderTop: `1px solid ${C.border}`,
    color: C.textFaint,
    fontSize: "0.8rem",
    flexWrap: "wrap",
    gap: 8,
  },
  footerBottomRight: {
    color: C.textFaint,
  },
};