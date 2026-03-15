import { useState, useEffect } from "react";

/* ─── DATA ─── */
const PROJECTS = [
  {
    id: 1, title: "Loewe Scent Finder", tag: "NLP · RAG · LLM · Chatbot",
    org: "LVMH — Maison Loewe", highlight: "Production RAG Pipeline",
    description: "An AI-powered fragrance recommendation chatbot that combines hybrid intent classification with BM25-based retrieval and Gemini LLM generation. The system processes natural language queries, classifies user intent across 5 categories, retrieves the most relevant fragrances from a structured catalog, and generates grounded, brand-aligned recommendations.",
    tech: ["RAG", "Python", "BM25", "Google Gemini", "LangChain", "Streamlit"],
    expanded: {
      problem: "Maison Loewe's current fragrance finder quiz online lacked a conversational discovery experience. Customers selecting options online had no intuitive way to describe what they wanted in natural language — by mood, occasion, or scent preference — and then receive personalized, trustworthy recommendations grounded in actual product data.",
      approach: "The Loewe Scent Finder is a CLI-based Retrieval-Augmented Generation (RAG) chatbot for fragrance recommendation. It uses a two-stage intent routing system — first attempting fast keyword-score matching against predefined intent categories (recommendation, order, complaint, product info, out-of-scope), then falling back to Gemini LLM classification when confidence is low.\n\nFor the recommendation flow, user input along with accumulated slot values and conversation history is used to construct an enriched query, which is then passed to a BM25Okapi retriever built over a local perfume dataset (put together by scraping the company catalogue and Fragrantica). Each perfume record is flattened into a searchable text document combining title, description, brand, accords, top/middle/base notes, and product metadata, normalized and tokenized at index time. The top-k retrieved candidates are formatted into a structured context string and fed alongside prompt constraints into Google Gemini (via LangChain) to generate a grounded, natural-language recommendation — ensuring the model's output stays anchored to actual catalogue data rather than hallucinating products. Multi-turn session state (history, active intent, slots, pending clarifications) is maintained in-memory throughout the conversation.",
      results: "End-to-end chatbot handling 100+ fragrances with hybrid intent routing, BM25 retrieval, and hallucination-resistant LLM generation. The system supports multi-turn conversation with history tracking and routes across 5 intent categories with dedicated handlers for recommendations, orders, complaints, and product info.",
      github: "https://github.com/zjy2677/Loewe_scent_finder/tree/Modura_prompt_test", demo: null,
    },
  },
  {
    id: 2, title: "Greenwashing Detector", tag: "Multi-Agent · RAG · NLP",
    org: "Ekimetrics Hackathon", highlight: "1st Place Winner",
    description: "Multi-agent RAG system that automatically detects greenwashing in corporate sustainability reports. The system ingests legal and regulatory documents, builds a semantic knowledge base, and uses orchestrated AI agents to cross-reference corporate environmental claims against EU regulatory frameworks — flagging misleading or non-compliant statements.",
    tech: ["LangGraph", "LangChain", "ChromaDB", "Groq", "Streamlit"],
    expanded: {
      problem: "Companies increasingly publish sustainability reports with vague or exaggerated environmental claims. With tightening EU regulations, marketing and compliance teams need automated tools to verify whether corporate claims hold up against actual regulatory standards — before publishing.",
      approach: "Built a semantic data pipeline for automated legal document ingestion using LangChain, with semantic chunking and entity extraction to structure regulatory text into retrievable knowledge. Documents are vector-indexed into ChromaDB for efficient similarity search. Multiple specialized agents are orchestrated via LangGraph — each responsible for a different verification task (regulatory cross-referencing, claim extraction, compliance scoring). The system accepts natural language queries through a Streamlit interface and returns flagged claims with supporting regulatory context.",
      results: "Won 1st place at the Ekimetrics hackathon. The tool enables marketing teams to identify and fix non-compliant environmental claims before publication, reducing exposure to regulatory fines. Deployed live on Streamlit Cloud.",
      github: "https://github.com/Modhuradas/Greenwash-detector/tree/main?tab=readme-ov-file#key-features", demo: "https://bit.ly/4tekbvX",
    },
  },
  {
    id: 3, title: "Bad Posture Detection — Chrome Extension", tag: "Computer Vision · Edge ML",
    org: "Personal Project — HumpBack", highlight: "83% Recall",
    description: "A Chrome extension that monitors your posture in real-time using your webcam. It detects upper-body keypoints via MoveNet Thunder, compares them against a user-calibrated reference posture, and alerts you with visual feedback when your posture deviates — all running entirely in-browser with zero server dependency.",
    tech: ["TensorFlow.js", "MoveNet Thunder", "Chrome Extension", "JavaScript", "Vite"],
    expanded: {
      problem: "Poor posture is one of the most common health issues for people who work at desks — but most people don't notice it until the damage is done. Existing solutions require wearable hardware or standalone apps. A lightweight, browser-based tool that runs passively in the background could catch posture issues right where people spend most of their screen time.",
      approach: "The extension uses MoveNet Thunder (via TensorFlow.js) for real-time upper-body keypoint extraction directly in the browser. On first use, the system captures a reference 'good posture' snapshot. From there, it engineers scale-invariant geometric features from skeletal keypoints (angles, distances, ratios) and computes deviations from the reference every 5 seconds. A lightweight MLP classifier trained on collected posture data determines whether the current posture is good, moderate, or poor. The Chrome extension icon changes color (green/yellow/red) to provide non-intrusive feedback.",
      results: "Achieved 83% recall on posture deviation detection. The entire ML pipeline runs client-side in TensorFlow.js — no data leaves the browser, making it fully privacy-preserving with zero latency. Built with Vite for fast development and bundling.",
      github: "https://github.com/Modhuradas/Humpback-Posture_Correction-ChromExtension/tree/main", demo: "https://tinyurl.com/HumpBackProject",
    },
  },
  {
    id: 4, title: "Black Swan Forecasting", tag: "Time Series · Finance",
    org: "CentraleSupélec", highlight: "0.90 VIX Correlation",
    description: "Volatility forecasting framework applying Taleb's Fourth Quadrant theory. GARCH(1,1) with Student's t-distribution achieved 0.90 correlation with VIX, with tail-risk detection for extreme market events.",
    tech: ["Python", "GARCH", "ARIMA", "Kalman Filter", "statsmodels"],
    expanded: {
      problem: "Standard volatility models underestimate tail risk — the very events that cause the most damage in financial markets. Taleb's Fourth Quadrant framework suggests these fat-tailed distributions require fundamentally different modeling approaches.",
      approach: "Implemented GARCH(1,1) with Student's t-distribution innovations to capture heavy tails in S&P 500 returns. Combined with ARIMA for mean forecasting and Kalman filters for state-space estimation. Evaluated against VIX as a benchmark for implied volatility prediction.",
      results: "Achieved 0.90 correlation with VIX. The Student's t-distribution significantly outperformed Gaussian assumptions in capturing extreme market movements.",
      github: null, demo: null,
    },
  },
  {
    id: 5, title: "Customer Verbatim Analytics", tag: "NLP · Sentiment Analysis · Analytics",
    org: "Blinkit & Picnic — Quick Commerce", highlight: "59K+ Reviews Analyzed",
    description: "Comparative review analytics across two quick-commerce platforms — Blinkit (India, 59K reviews) and Picnic (Netherlands, 100 reviews). Built Python pipelines to scrape Google Play Store reviews, perform aspect-based sentiment analysis, competitor benchmarking, and identify actionable business insights.",
    tech: ["Python", "NLP", "Sentiment Analysis", "Pandas", "Google Play Scraper"],
    expanded: {
      problem: "Quick-commerce platforms receive thousands of reviews but lack structured insight into what drives satisfaction vs. churn. Both Blinkit and Picnic needed a systematic way to understand customer pain points, competitive threats, and the impact of app version releases on sentiment.",
      approach: "Scraped Google Play Store reviews using Python packages. For Blinkit (59K reviews, Jan–Apr 2025): performed aspect-based sentiment analysis across 9 categories (packaging, app, delivery, refunds, etc.), tracked rating trends by month and app version, analyzed competitor mentions (Zepto, Instamart, Swiggy), and evaluated customer support response times by rating tier. For Picnic (100 reviews, Sep 2024–Feb 2025): identified key complaint themes (language availability, delivery slots) and satisfaction drivers (pricing, service quality) through word frequency and sentiment segmentation.",
      results: "Blinkit: identified refund system as the #1 pain point (-0.4 sentiment), discovered version 17.5.1 as a critical inflection point, and recommended prioritizing 3-4 star review responses to reduce churn risk. Picnic: surfaced English language support as the top user demand and documented a dramatic 5-star rating increase from Dec to Jan suggesting successful service improvements.",
      github: null, demo: "/reports/blinkit-analysis.pdf",
      demo2: "/reports/picnic-analysis.pdf",
    },
  },
];

const EXPERIENCE = [
  { role: "Data Scientist", company: "LVMH — Maison Loewe", period: "Jan 2026 — Jun 2026", type: "Corporate Research Project", logo: "/logos/lvmh.png",
    detail: "Engineering a semantic data pipeline for a fragrance recommendation system for 100+ products, with metadata tagging, multi-dimensional attribute extraction (olfactory notes, mood, occasion), and embedding generation to produce structured, retrieval-ready datasets using FAISS with metadata pre-filtering.\n\nBuilding a two-stage RAG retrieval system combining vector similarity search over fragrance embeddings with cross-encoder reranking, delivering ranked personalized recommendations, and designing a conversational AI chatbot grounded in verified product metadata for brand-aligned responses." },
  { role: "Data Analyst", company: "NITI Aayog — Government of India", period: "Jun 2025 — Aug 2025", type: "Policy Think Tank", logo: "/logos/niti.png",
    detail: "Defined and implemented KPIs to monitor performance of 10,000+ schools, built interactive Looker Studio dashboards. Designed advanced analytics frameworks including a weighted scoring algorithm and 4-tier classification system to evaluate government intervention impact." },
  { role: "Financial Markets Analyst", company: "Futures First, Hertshten Group", period: "Jun 2022 — Aug 2022", type: "Financial Analytics", logo: "/logos/futuresfirst.png",
    detail: "Developed a dynamic financial reporting tracker in Excel/Google Sheets to monitor and visualize key risk KPIs, including periodic returns, volatility, P/E ratio, Beta, P/B ratio, dividend yield, and covariance matrix for Nifty 50 companies, enabling regular performance reporting for portfolio analysis.\n\nBuilt a Python-based ad-hoc reporting tool using Numpy and Pandas to compute portfolio volatility, allowing dynamic inputs for company selection and portfolio weights, supporting precise risk assessment and data-driven decision-making." },
];

const SKILLS_GROUPS = [
  { category: "Generative AI & RAG", items: ["LangChain", "LangGraph", "RAG", "Multi-Agent Orchestration", "Semantic Chunking", "Vector Database"] },
  { category: "Programming & Data", items: ["Python", "SQL", "Git", "Excel", "Power BI"] },
  { category: "Machine Learning", items: ["Classification Models", "Ensemble Methods", "Feature Engineering", "Model Evaluation", "Sentiment Analysis", "Topic Modelling"] },
];

const EDUCATION_DATA = [
  { year: "2024 — 2026", degree: "MSc Data Sciences & Business Analytics", school: "CentraleSupélec × ESSEC Business School, Paris", note: "Machine Learning · Deep Learning · Big Data · Predictive Analysis", logo: "/logos/centralesupelec.jpg" },
  { year: "2023 — 2024", degree: "Diploma in Data Science", school: "Indian Institute of Technology, Madras", note: "Linear Algebra · ML Foundation & Theory · DBMS", logo: "/logos/iitm.png" },
  { year: "2020 — 2023", degree: "BA (Hons) Economics", school: "O.P. Jindal Global University, Sonipat", note: "Silver Medalist (2/98) · Econometrics · Statistics · Macroeconomics", logo: "/logos/jindal.png" },
];

const HOBBIES = ["Tennis", "Odissi", "Baking", "Leadership", "Mentoring", "Community Building"];

/* ─── STYLE TOKENS ─── */
const f = { heading: "'Playfair Display', serif", mono: "'JetBrains Mono', monospace", body: "'DM Sans', sans-serif" };
const c = { bg: "#08080c", surface: "#0e0e14", gold: "#c9a96e", white: "#e8e4df", text: "rgba(232,228,223,0.75)", muted: "rgba(232,228,223,0.5)", faint: "rgba(232,228,223,0.3)", border: "rgba(255,255,255,0.06)" };

/* ─── SIDEBAR ─── */
function Sidebar({ active, onNavigate, onCVClick, mobileOpen, onToggleMobile }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "hobbies", label: "Hobbies & Soft Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={() => onToggleMobile(!mobileOpen)} style={{
        position: "fixed", top: 12, left: 12, zIndex: 200,
        background: c.surface, border: `1px solid ${c.border}`,
        color: c.white, width: 38, height: 38, fontSize: 18,
        display: "none", alignItems: "center", justifyContent: "center",
        cursor: "pointer", borderRadius: 6,
      }}>{mobileOpen ? "×" : "☰"}</button>

      {mobileOpen && <div className="mobile-overlay" onClick={() => onToggleMobile(false)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99,
      }} />}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
      background: c.surface, borderRight: `1px solid ${c.border}`,
      display: "flex", flexDirection: "column", padding: "24px 0",
      zIndex: 100, overflowY: "auto",
      transition: "transform 0.3s ease",
    }}>
      {/* Profile */}
      <div style={{ padding: "0 24px 28px", borderBottom: `1px solid ${c.border}` }}>
        <div style={{
          fontFamily: f.heading, fontSize: 36, fontWeight: 700,
          color: c.white, letterSpacing: "-1px", marginBottom: 10,
        }}>
          M<span style={{ color: c.gold }}>.</span>
        </div>
        <div style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: c.gold }}>
          Data Scientist
        </div>
        <div style={{ fontFamily: f.body, fontSize: 12, color: c.muted, marginTop: 5 }}>
          📍 Paris, France
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 0", flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { onNavigate(item.id); if(onToggleMobile) onToggleMobile(false); }} style={{
            display: "block", width: "100%", padding: "11px 24px",
            border: "none", cursor: "pointer", textAlign: "left",
            background: active === item.id ? "rgba(201,169,110,0.08)" : "transparent",
            borderLeft: active === item.id ? `2px solid ${c.gold}` : "2px solid transparent",
            fontFamily: f.mono, fontSize: 12, letterSpacing: "0.8px",
            color: active === item.id ? c.gold : c.muted,
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { if (active !== item.id) { e.currentTarget.style.color = c.white; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}
            onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.color = c.muted; e.currentTarget.style.background = "transparent"; } }}
          >{item.label}</button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${c.border}` }}>
        <button onClick={onCVClick} style={{
          width: "100%", padding: "10px 0", fontFamily: f.mono, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "2px",
          color: c.bg, background: c.gold, border: "none", cursor: "pointer",
          marginBottom: 18, transition: "background 0.3s",
        }}
          onMouseEnter={e => { e.target.style.background = "#dfc08a"; }}
          onMouseLeave={e => { e.target.style.background = c.gold; }}
        >↓ CV</button>

        <div style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "2px", color: c.faint, marginBottom: 10 }}>Social</div>
        {[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/modhura-das/" },
          { label: "GitHub", href: "https://github.com/Modhuradas" },
          { label: "Email", href: "mailto:modhuradas01@gmail.com" },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
            display: "block", fontFamily: f.mono, fontSize: 11, color: c.muted,
            textDecoration: "none", transition: "color 0.3s", padding: "4px 0",
          }}
            onMouseEnter={e => { e.target.style.color = c.gold; }}
            onMouseLeave={e => { e.target.style.color = c.muted; }}
          >{s.label} ↗</a>
        ))}
      </div>
      </aside>
    </>
  );
}

/* ─── PAGE: HOME ─── */
function HomePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const anim = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: f.heading, fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1,
          color: c.white, letterSpacing: "-1px", ...anim(0.1),
        }}>
          Hello World ! It's <span style={{ color: c.gold }}>Mods.</span>
        </div>
        <h1 style={{
          fontFamily: f.heading, fontWeight: 700,
          fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.3,
          color: c.white, margin: "10px 0 0", letterSpacing: "-0.5px", ...anim(0.25),
        }}>
          Modhura <span style={{ color: c.gold }}>Das</span>
        </h1>
        <p style={{
          fontFamily: f.body, fontSize: 13, lineHeight: 1.7,
          color: c.muted, maxWidth: 540, margin: "14px 0 0",
          fontStyle: "italic", ...anim(0.4),
        }}>
          From running regressions in Economics to building RAG pipelines, ML models, and orchestrating AI agents. The learning curve was worth it.
        </p>
      </div>

      {/* Photo + About */}
      <div className="home-about-grid" style={{ display: "flex", gap: 32, alignItems: "flex-start", ...anim(0.55) }}>
        <div style={{
          width: 140, height: 140, borderRadius: "50%", overflow: "hidden",
          border: "2px solid rgba(201,169,110,0.3)", flexShrink: 0,
        }}>
          <img src="/profile.png" alt="Modhura Das" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.parentElement.style.background = "rgba(201,169,110,0.1)"; e.target.style.display = "none"; }} />
        </div>
        <div style={{ fontFamily: f.body, fontSize: 13, lineHeight: 1.8, color: c.white }}>
          <p style={{ margin: "0 0 18px" }}>
            I'm a current M2 student in the MSc Data Sciences &amp; Business Analytics program at CentraleSupélec × ESSEC in Paris, France. I'm working as a Data Scientist at LVMH's Maison Loewe, building an AI-powered fragrance recommendation chatbot using retrieval-augmented generation (RAG), intent classification, and LLM-based response generation with LangChain and Google Gemini. Over the summer I interned at NITI Aayog (Government of India's policy think tank) where I measured government intervention impact across 10,000+ schools through data-driven KPI frameworks.
          </p>
          <p style={{ margin: 0 }}>
            I started in economics, studying markets, econometrics, and statistical theory, and that foundation still drives how I approach every problem: with an obsession for asking "why" something happened. What excites me about being a data scientist is recognizing patterns — whether in data or language, and building systems that can do the same.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE: PROJECTS ─── */
function ProjectsPage() {
  const [selected, setSelected] = useState(null);
  if (selected) return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 10 }}>Selected Work</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 28, fontWeight: 700, color: c.white, margin: "0 0 28px", letterSpacing: "-1px" }}>Projects</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        border: `1px solid ${h ? "rgba(201,169,110,0.3)" : c.border}`,
        padding: "20px 24px", cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        background: h ? "rgba(201,169,110,0.03)" : "transparent",
      }}>
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 8 }}>
        {project.expanded.github && (
          <a href={project.expanded.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.5px", color: c.white, padding: "4px 10px", border: `1px solid ${c.border}`, background: "rgba(255,255,255,0.04)", textDecoration: "none", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.white; }}
          >GitHub ↗</a>
        )}
        {project.expanded.demo && !project.expanded.demo2 && !project.expanded.demo.startsWith("/") && (
          <a href={project.expanded.demo} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.5px", color: c.bg, padding: "4px 10px", background: c.gold, textDecoration: "none", transition: "all 0.3s", border: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dfc08a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = c.gold; }}
          >Demo ↗</a>
        )}
        {!project.expanded.github && (
          <div style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.5px", color: c.gold, padding: "4px 10px", border: "1px solid rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>{project.highlight}</div>
        )}
      </div>
      <div style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "2px", color: c.muted, marginBottom: 6 }}>{project.tag}</div>
      <h3 style={{ fontFamily: f.heading, fontSize: 19, fontWeight: 700, color: c.white, margin: "0 0 3px" }}>{project.title}</h3>
      <div style={{ fontFamily: f.body, fontSize: 12, color: c.gold, marginBottom: 10 }}>{project.org}</div>
      <p style={{ fontFamily: f.body, fontSize: 12, lineHeight: 1.7, color: c.text, margin: "0 0 12px", maxWidth: 540 }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {project.tech.map(t => <span key={t} style={{ fontFamily: f.mono, fontSize: 9, padding: "4px 10px", border: `1px solid ${c.border}`, color: c.text }}>{t}</span>)}
        <span style={{ fontFamily: f.mono, fontSize: 9, color: c.gold, marginLeft: 8, opacity: h ? 1 : 0, transition: "opacity 0.3s", letterSpacing: "1px" }}>VIEW DETAILS →</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: `linear-gradient(90deg, ${c.gold}, transparent)`, width: h ? "100%" : "0%", transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  );
}

function ProjectDetail({ project, onBack }) {
  const label = { fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: c.gold, marginBottom: 10, marginTop: 30 };
  const body = { fontFamily: f.body, fontSize: 13, lineHeight: 1.75, color: c.text, whiteSpace: "pre-line" };

  return (
    <div style={{ maxWidth: 780 }}>
      <button onClick={onBack} style={{ fontFamily: f.mono, fontSize: 11, color: c.muted, background: "none", border: "none", cursor: "pointer", marginBottom: 28, padding: 0, letterSpacing: "1px", transition: "color 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.color = c.gold; }} onMouseLeave={e => { e.currentTarget.style.color = c.muted; }}>← BACK TO PROJECTS</button>

      <div style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: c.muted, marginBottom: 8 }}>{project.tag}</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 30, fontWeight: 700, color: c.white, margin: "0 0 6px" }}>{project.title}</h2>
      <div style={{ fontFamily: f.body, fontSize: 14, color: c.gold, marginBottom: 10 }}>{project.org}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {project.expanded.github && (
          <a href={project.expanded.github} target="_blank" rel="noreferrer" style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: c.white, padding: "5px 12px", border: `1px solid ${c.border}`, background: "rgba(255,255,255,0.04)", textDecoration: "none", transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.white; }}
          >GitHub ↗</a>
        )}
        {project.expanded.demo && !project.expanded.demo.startsWith("/") && (
          <a href={project.expanded.demo} target="_blank" rel="noreferrer" style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: c.bg, padding: "5px 12px", background: c.gold, textDecoration: "none", transition: "background 0.3s", border: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dfc08a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = c.gold; }}
          >{project.expanded.demo2 ? "Blinkit Report ↗" : "Live Demo ↗"}</a>
        )}
        {project.expanded.demo2 && (
          <a href={project.expanded.demo2} target="_blank" rel="noreferrer" style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: c.bg, padding: "5px 12px", background: c.gold, textDecoration: "none", transition: "background 0.3s", border: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dfc08a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = c.gold; }}
          >Picnic Report ↗</a>
        )}
        {!project.expanded.github && (
          <span style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: c.gold, padding: "5px 12px", border: "1px solid rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>{project.highlight}</span>
        )}
      </div>

      <div style={label}>The Problem</div>
      <p style={body}>{project.expanded.problem}</p>
      <div style={label}>Approach</div>
      <p style={body}>{project.expanded.approach}</p>
      <div style={label}>Results</div>
      <p style={body}>{project.expanded.results}</p>
      <div style={label}>Tech Stack</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
        {project.tech.map(t => <span key={t} style={{ fontFamily: f.mono, fontSize: 10, padding: "5px 12px", border: `1px solid ${c.border}`, color: c.text }}>{t}</span>)}
      </div>
      {(project.expanded.demo?.startsWith("/") || project.expanded.demo2) && (
        <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
          {project.expanded.demo?.startsWith("/") && (
            <a href={project.expanded.demo} target="_blank" rel="noreferrer" style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", padding: "10px 20px", background: c.gold, color: c.bg, textDecoration: "none", transition: "background 0.3s", border: "none" }}
              onMouseEnter={e => { e.target.style.background = "#dfc08a"; }} onMouseLeave={e => { e.target.style.background = c.gold; }}>{project.expanded.demo2 ? "Blinkit Report ↗" : "View Report ↗"}</a>
          )}
          {project.expanded.demo2 && (
            <a href={project.expanded.demo2} target="_blank" rel="noreferrer" style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", padding: "10px 20px", background: c.gold, color: c.bg, textDecoration: "none", transition: "background 0.3s", border: "none" }}
              onMouseEnter={e => { e.target.style.background = "#dfc08a"; }} onMouseLeave={e => { e.target.style.background = c.gold; }}>Picnic Report ↗</a>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── PAGE: EXPERIENCE + SKILLS ─── */
function ExperiencePage() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 14 }}>Experience</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 28, fontWeight: 700, color: c.white, margin: "0 0 28px", letterSpacing: "-1px" }}>Where I've Worked</h2>

      {EXPERIENCE.map((exp, i) => (
        <div key={i} className="exp-grid" style={{ padding: "22px 0", borderBottom: `1px solid ${c.border}`, display: "grid", gridTemplateColumns: "170px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            {/* Company logo placeholder */}
            <div style={{
              width: 36, height: 36, borderRadius: 6, marginBottom: 8,
              background: "rgba(201,169,110,0.06)", border: `1px solid ${c.border}`,
              overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            }}><img src={exp.logo} alt={exp.company} style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
            <div style={{ fontFamily: f.mono, fontSize: 11, color: c.muted, letterSpacing: "1px" }}>{exp.period}</div>
            <div style={{ fontFamily: f.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(201,169,110,0.5)", marginTop: 5 }}>{exp.type}</div>
          </div>
          <div>
            <h3 style={{ fontFamily: f.heading, fontSize: 19, fontWeight: 700, color: c.white, margin: 0 }}>{exp.role}</h3>
            <div style={{ fontFamily: f.body, fontSize: 13, color: c.gold, marginTop: 3 }}>{exp.company}</div>
            <p style={{ fontFamily: f.body, fontSize: 13, lineHeight: 1.75, color: c.white, margin: "10px 0 0", whiteSpace: "pre-line" }}>{exp.detail}</p>
          </div>
        </div>
      ))}

      {/* Tech Stack */}
      <div style={{ marginTop: 48 }}>
        <div style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 14 }}>Skills</div>
        <h2 style={{ fontFamily: f.heading, fontSize: 28, fontWeight: 700, color: c.white, margin: "0 0 24px", letterSpacing: "-1px" }}>Technical Stack</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {SKILLS_GROUPS.map(g => (
            <div key={g.category}>
              <div style={{ fontFamily: f.mono, fontSize: 11, color: c.gold, letterSpacing: "1px", fontWeight: 500, marginBottom: 10 }}>{g.category}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.items.map(item => <span key={item} style={{ fontFamily: f.mono, fontSize: 10, padding: "6px 14px", border: `1px solid ${c.border}`, color: c.text }}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE: EDUCATION ─── */
function EducationPage() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 14 }}>Education</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 28, fontWeight: 700, color: c.white, margin: "0 0 28px", letterSpacing: "-1px" }}>My Educational Journey</h2>

      {EDUCATION_DATA.map((edu, i) => (
        <div key={i} style={{ padding: "24px 0", borderBottom: `1px solid ${c.border}`, display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Logo placeholder */}
          <div style={{
            width: 40, height: 40, borderRadius: 8, flexShrink: 0,
            background: "rgba(201,169,110,0.06)", border: `1px solid ${c.border}`,
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          }}><img src={edu.logo} alt={edu.school} style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
          <div>
            <div style={{ fontFamily: f.mono, fontSize: 12, color: c.gold, letterSpacing: "2px", fontWeight: 500, marginBottom: 6 }}>{edu.year}</div>
            <h3 style={{ fontFamily: f.heading, fontSize: 21, fontWeight: 700, color: c.white, margin: 0 }}>{edu.degree}</h3>
            <div style={{ fontFamily: f.body, fontSize: 13, color: c.white, marginTop: 4 }}>{edu.school}</div>
            <div style={{ fontFamily: f.mono, fontSize: 11, color: c.muted, marginTop: 8, lineHeight: 1.6 }}>{edu.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PAGE: HOBBIES & MORE ─── */
function HobbiesPage() {
  const picPlaceholder = {
    width: 90, height: 90, borderRadius: 8, flexShrink: 0,
    background: "rgba(201,169,110,0.06)", border: `1px solid ${c.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: f.mono, fontSize: 8, color: c.faint, textAlign: "center", padding: 6,
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 14 }}>Beyond the Code</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 28, fontWeight: 700, color: c.white, margin: "0 0 28px", letterSpacing: "-1px" }}>Hobbies & Soft Skills</h2>

      {/* Section 1: Leadership & Teaching */}
      <div className="hobbies-section" style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          <div style={{ ...picPlaceholder, overflow: "hidden", padding: 0 }}><img src="/hobbies/mentoring.png" alt="Mentoring" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ ...picPlaceholder, overflow: "hidden", padding: 0 }}><img src="/hobbies/community.png" alt="Community" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        </div>
        <div style={{ fontFamily: f.body, fontSize: 13, lineHeight: 1.75, color: c.text }}>
          <p style={{ margin: "0 0 16px" }}>
            I've always gravitated toward roles where I can bring people together. As Class Representative and Head of the Academic Coordination Committee during my undergrad years, I organized coffee sessions with professors, peer workshops, and study groups — creating spaces where people could learn from each other without pressure. I enjoyed being the representative voice of a very diverse student community and the bridge between the administration and the student body. All my initiatives have been centered around a strong belief: if you're lucky enough to reach the top, it's your duty to send the lift back down.
          </p>
          <p style={{ margin: 0 }}>
            That same philosophy drew me to being a Teaching Assistant. I was a Statistics TA to 60 juniors in my final undergrad year, holding tutorial sessions every week. There's something deeply fulfilling about watching a concept click for someone, or explaining a tricky idea in three different ways until one of them lands. Teaching doesn't just help others; it sharpens the way I think about problems myself — and I hope to have it as a part of my life forever.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
        {["Leadership", "Mentoring", "Community Building", "Teaching"].map(h => (
          <span key={h} style={{ fontFamily: f.body, fontSize: 13, padding: "8px 20px", border: "1px solid rgba(201,169,110,0.2)", color: c.text }}>{h}</span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: c.gold, opacity: 0.45, marginBottom: 32 }} />

      {/* Section 2: Sports, Dance, Baking */}
      <div className="hobbies-section" style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          <div style={{ ...picPlaceholder, overflow: "hidden", padding: 0 }}><img src="/hobbies/tennis.jpg" alt="Tennis" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ ...picPlaceholder, overflow: "hidden", padding: 0 }}><img src="/hobbies/odissi.png" alt="Odissi" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        </div>
        <div style={{ fontFamily: f.body, fontSize: 13, lineHeight: 1.75, color: c.text }}>
          <p style={{ margin: "0 0 16px" }}>
            Outside of work, you'll most likely find me on a tennis court. I enjoy racquet sports because of the strategy and quick decision-making they demand. I'm also an avid cricket fan and often spend weekends wearing the blues and cheering for India. Playing sports has played a huge role in shaping who I am — it has taught me discipline, humility, and team spirit, values I carry into every aspect of my life.
          </p>
          <p style={{ margin: "0 0 16px" }}>
            I'm also trained in Odissi, a classical Indian dance form known for its precision and expressive storytelling. The art has a steep learning curve and demands years of consistent practice. For me, Odissi is both a way to stay connected to my Indian roots and a deeply fulfilling creative outlet. Performing and winning competitions with my troupe remain some of my most cherished childhood memories.
          </p>
          <p style={{ margin: 0 }}>
            And finally, there's baking. I genuinely believe there's very little a sweet treat can't fix. I enjoy the process-oriented nature of baking — measuring, timing, and following steps carefully. It's surprisingly meditative and a great way to unwind after a long day of debugging.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {["Tennis", "Cricket", "Odissi", "Baking"].map(h => (
          <span key={h} style={{ fontFamily: f.body, fontSize: 13, padding: "8px 20px", border: "1px solid rgba(201,169,110,0.2)", color: c.text }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── PAGE: CONTACT ─── */
function ContactPage() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: c.gold, marginBottom: 14 }}>Contact</div>
      <h2 style={{ fontFamily: f.heading, fontSize: 26, fontWeight: 400, color: c.white, margin: "0 0 28px", letterSpacing: "-0.5px", fontStyle: "italic" }}>
        The <span style={{ color: c.gold }}>purple</span> space
      </h2>
      <div style={{ fontFamily: f.body, fontSize: 15, color: c.white, maxWidth: 560, lineHeight: 1.9, margin: "0 0 28px" }}>
        <p style={{ margin: "0 0 18px" }}>
          Professionals are often categorized as either "red" (technical specialists) or "blue" (business strategists). But meaningful innovation usually happens at the intersection of both. My goal is to grow into a person who operates in the purple space — build digital solutions that are not only technically sound but also deliver meaningful business value.
        </p>
        <p style={{ margin: "0 0 18px" }}>
          Currently seeking end-of-studies Data Science / Data Analyst / Business Analyst internships starting July 2026 or later.
        </p>
        <p style={{ margin: 0, fontFamily: f.mono, fontSize: 11, color: c.faint, fontStyle: "italic", lineHeight: 1.7 }}>
          Inspired by Thomas H. Davenport's "Purple People at the Heart of Cognitive Tech" (WSJ CIO Journal)
        </p>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/modhura-das/", icon: "↗" },
          { label: "GitHub", href: "https://github.com/Modhuradas", icon: "↗" },
          { label: "Email", href: "mailto:modhuradas01@gmail.com", icon: "→" },
        ].map(link => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{
            fontFamily: f.mono, fontSize: 11, textTransform: "uppercase",
            letterSpacing: "2px", padding: "12px 24px",
            border: `1px solid ${c.border}`, color: c.text,
            textDecoration: "none", transition: "all 0.3s",
            display: "flex", gap: 8, alignItems: "center",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.text; }}
          >{link.label} <span>{link.icon}</span></a>
        ))}
      </div>
    </div>
  );
}

/* ─── CV MODAL ─── */
function CVModal({ onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const sT = { fontFamily: f.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "3px", color: c.gold, marginBottom: 18, marginTop: 32, paddingBottom: 8, borderBottom: `1px solid ${c.border}` };
  const jT = { fontFamily: f.heading, fontSize: 16, fontWeight: 700, color: c.white, margin: 0 };
  const oL = { fontFamily: f.body, fontSize: 12, color: c.muted, margin: "2px 0 0" };
  const dL = { fontFamily: f.mono, fontSize: 10, color: c.faint, letterSpacing: "1px" };
  const bL = { fontFamily: f.body, fontSize: 12, color: c.text, lineHeight: 1.75, margin: "5px 0 0", paddingLeft: 14, borderLeft: "2px solid rgba(201,169,110,0.15)" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 700, maxHeight: "85vh", background: c.surface, border: `1px solid ${c.border}`, overflowY: "auto" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: c.surface, padding: "22px 36px 14px", borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: f.heading, fontSize: 22, fontWeight: 700, color: c.white, margin: 0 }}>Modhura Das</h2>
            <div style={{ fontFamily: f.mono, fontSize: 9, color: c.faint, letterSpacing: "1px", marginTop: 3 }}>modhuradas01@gmail · Paris, France · +33 766982239</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/cv/PR_DAS_CentraleSupelec.pdf" download style={{ fontFamily: f.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", padding: "7px 14px", background: c.gold, color: c.bg, textDecoration: "none" }}>↓ Download</a>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${c.border}`, color: c.muted, fontSize: 16, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>
        <div style={{ padding: "4px 36px 36px" }}>
          <div style={sT}>Education</div>
          {[{ t: "MSc Data Sciences & Business Analytics", s: "CentraleSupélec | ESSEC, Paris", d: "Sep 2024 – Jun 2026", n: "Python, ML, Deep Learning, DBMS" }, { t: "Diploma in Data Science", s: "IIT Madras", d: "May 2023 – Sep 2024", n: "Business Analytics, ML Foundation & Theory" }, { t: "BA (Hons) Economics", s: "O.P. Jindal Global University", d: "Aug 2020 – Jun 2023", n: "Silver Medalist (2/98) · Econometrics, Statistics" }].map((e, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={jT}>{e.t}</div><div style={dL}>{e.d}</div></div>
              <div style={oL}>{e.s}</div><div style={{ ...bL, fontSize: 11 }}>{e.n}</div>
            </div>
          ))}
          <div style={sT}>Experience</div>
          {[{ t: "Data Scientist — Corporate Research", s: "LVMH — Maison Loewe", d: "Jan 2026 – Jun 2026", b: ["Semantic data pipeline for 100+ fragrances with FAISS.", "Two-stage RAG system with cross-encoder reranking and AI chatbot."] }, { t: "Data Analyst", s: "NITI Aayog, New Delhi", d: "Jun 2025 – Aug 2025", b: ["KPIs for 10,000+ schools with Looker Studio.", "Weighted scoring algorithm and 4-tier classification."] }, { t: "Financial Markets Analyst", s: "Futures First, Gurugram", d: "Jun 2022 – Aug 2022", b: ["Financial reporting tracker for Nifty 50 KPIs.", "Python tool for portfolio volatility computation."] }].map((e, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={jT}>{e.t}</div><div style={dL}>{e.d}</div></div>
              <div style={oL}>{e.s}</div>
              {e.b.map((b, j) => <div key={j} style={bL}>{b}</div>)}
            </div>
          ))}
          <div style={sT}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["LangChain", "LangGraph", "RAG", "Vector Database", "Multi-Agent", "Python", "SQL", "Git", "Power BI", "Classification Models", "Ensemble Methods", "Feature Engineering", "Sentiment Analysis"].map(s => (
              <span key={s} style={{ fontFamily: f.mono, fontSize: 9, padding: "4px 12px", border: `1px solid ${c.border}`, color: c.muted }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [showCV, setShowCV] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = { home: HomePage, projects: ProjectsPage, experience: ExperiencePage, education: EducationPage, hobbies: HobbiesPage, contact: ContactPage };
  const Page = pages[page] || HomePage;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${c.bg}; color: ${c.white}; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(201,169,110,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${c.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.2); border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .main-content { margin-left: 220px; min-height: 100vh; padding: 36px 48px 56px; font-size: 13px; }

        /* Scale everything with a base font approach */
        .main-content h2 { font-size: clamp(22px, 3.5vw, 28px) !important; }
        .main-content h3 { font-size: clamp(16px, 2.5vw, 19px) !important; }
        .main-content p { font-size: clamp(12px, 1.6vw, 13px) !important; }

        @media (max-width: 1200px) {
          .main-content { padding: 36px 36px 48px; }
          .main-content p { line-height: 1.7 !important; }
        }

        @media (max-width: 1024px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.sidebar-open { transform: translateX(0); }
          .mobile-menu-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
          .main-content { margin-left: 0 !important; padding: 60px 28px 48px !important; font-size: 12px; }
          .main-content h2 { font-size: clamp(20px, 3vw, 26px) !important; margin-bottom: 20px !important; }
          .main-content h3 { font-size: clamp(15px, 2.2vw, 18px) !important; }
        }

        @media (max-width: 768px) {
          .main-content { padding: 56px 20px 40px !important; font-size: 12px; }
          .main-content h2 { font-size: clamp(18px, 4vw, 24px) !important; }
          .home-about-grid { flex-direction: column !important; gap: 24px !important; }
          .home-about-grid > div:first-child { align-self: center; width: 120px !important; height: 120px !important; }
          .exp-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .hobbies-section { flex-direction: column !important; gap: 20px !important; }
          .hobbies-section > div:first-child { flex-direction: row !important; gap: 8px !important; }
          .hobbies-section > div:first-child > div { width: 70px !important; height: 70px !important; }
        }

        @media (max-width: 480px) {
          .main-content { padding: 52px 14px 28px !important; font-size: 11px; }
          .main-content h2 { font-size: 18px !important; }
          .main-content h3 { font-size: 15px !important; }
          .main-content p { font-size: 11px !important; }
          .home-about-grid > div:first-child { width: 100px !important; height: 100px !important; }
        }
      `}</style>
      <Sidebar active={page} onNavigate={setPage} onCVClick={() => setShowCV(true)} mobileOpen={mobileOpen} onToggleMobile={setMobileOpen} />
      <main className="main-content">
        <Page />
        <div style={{ marginTop: 72, paddingTop: 20, borderTop: `1px solid ${c.border}`, fontFamily: f.mono, fontSize: 9, color: c.faint, letterSpacing: "1px" }}>
          © 2026 Modhura Das — Designed with intention
        </div>
      </main>
      {showCV && <CVModal onClose={() => setShowCV(false)} />}
    </>
  );
}
