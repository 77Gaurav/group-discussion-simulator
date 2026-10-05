# 🎙️ GD Arena — AI Group Discussion Platform for Engineering Placements

A premier group discussion (GD) training and simulation platform designed specifically for engineering students preparing for campus recruitment drives (IITs, NITs, BITS, top tech employers), FAANG interviews, and leadership assessments.

Simulates **1 real student candidate** participating in a high-stakes discussion circle against **5 distinct AI engineering peers**, guided and evaluated live by **AI Moderator Shreya**.

---

## ⚡ Key Highlights & Architecture

- **LLM Engine**: Powered by Groq **`openai/gpt-oss-120b`** (with auto-fallback to `openai/gpt-oss-20b` and `qwen/qwen3.8-27b`).
- **Speech-to-Text (STT)**: Groq **`whisper-large-v3-turbo`** for ultra-fast, real-time microphone transcription (<300ms latency).
- **Text-to-Speech (TTS) Voice Engines**:
  - **Murf AI**: Powers **Rohan** (`en-IN-rohan`), **Priya** (`en-IN-priya`), **Arohi** (`en-IN-arohi`), and **Aarav** (`en-IN-aarav`).
  - **Sarvam AI**: Powers **Shubh** (`shubh`) and **Shreya** (`shreya`).
- **Confidential Blind Topic Draw**: Discussion topics are kept strictly hidden from candidates. When entering the GD Arena, 1 topic is drawn randomly from the **15 hardcoded placement topic bank** and announced live by Moderator Shreya.
- **Candidate Registration**: Candidates enter their custom name/username with zero assumptions.
- **Dynamic Speaker Signals**: Real-time glowing aura and harmonic canvas audio visualizer reflecting the active speaker.
- **Turn-taking & Etiquette**:
  - Moderator introduces topic, establishes ground rules, and guides transitions.
  - Candidate can interject naturally via **Hold/Click-to-Speak Mic**, **Raise Hand ✋**, or **Text Input**.
  - AI participants debate constructively, citing peer points, offering counter-arguments, and challenging consensus.
- **Comprehensive Placement Scorecard**: End-of-GD evaluation rubric grading on:
  1. *Articulation & Communication Clarity*
  2. *Technical Depth & Domain Knowledge*
  3. *Active Listening & Turn Etiquette*
  4. *Counter-Arguments & Critical Reasoning*
  5. *Leadership & Discussion Steering*
  - Includes Percentile ranking, strengths, areas for improvement, and actionable coaching tips.

---

## 👥 The GD Room Personas (Indian Professional English)

| Avatar | Name | Role & Style | Voice Engine & Profile |
| :---: | :--- | :--- | :--- |
| 👩‍🏫 | **Shreya** | **Moderator & Director of Engineering**<br>Authoritative, polite, ensures fair airtime and transitions. | **Sarvam AI** (`shreya`) |
| 👨‍💻 | **Aarav** | **Systems & Cloud Infrastructure**<br>Focuses on cloud latency, SLAs, network partitions, and DevOps costs. | **Murf AI** (`en-IN-aarav`) |
| 👩‍💻 | **Priya** | **MLOps & Applied AI**<br>Focuses on real-world model deployment, latency, dataset drift, and edge inference. | **Murf AI** (`en-IN-priya`) |
| 👨‍🎓 | **Rohan** | **Engineering Lead & Startup Builder**<br>Balances engineering rigor with time-to-market, cloud unit economics, and business runway. | **Murf AI** (`en-IN-rohan`) |
| 👩‍🔬 | **Arohi** | **Product Architect & Ethics Specialist**<br>Analyzes developer ergonomics, clean architectures, and data compliance (DPDP, GDPR). | **Murf AI** (`en-IN-arohi`) |
| 👨‍💼 | **Shubh** | **Senior SRE & Security Skeptic**<br>Challenges industry hype, points out blast radiuses, single points of failure, and CVEs. | **Sarvam AI** (`shubh`) |
| 🎯 | **Candidate (You)** | **Engineering Candidate**<br>Your real-time microphone / text contributions under your entered username. | Real-time Whisper Turbo STT |

---

## 🚀 Quickstart

### 1. Configure `.env`
Ensure your `.env` file contains your API keys:
```env
GROQ_API_KEY=gsk_...
MURF_API_KEY=your_murf_api_key
SARVAM_API_KEY=your_sarvam_api_key
GROQ_LLM_MODEL=openai/gpt-oss-120b
PORT=3001
```

### 2. Start Both Server and Client
```bash
npm run dev
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📚 15 Confidential Engineering Placement Topics
Topics are strictly randomized upon room entry:
1. *Monolith vs. Microservices in 2026: Has the Industry Over-Engineered?*
2. *AI Pair Programmers (Copilot, Cursor): Do They Create 10x Engineers or Atrophy Core Skills?*
3. *Build vs. Buy in the GenAI Era: Fine-Tuning Open Source vs. Proprietary API Endpoints*
4. *Is Prompt Engineering Dead with Frontier Reasoning Models (o1, R1, Sonnet 3.7)?*
5. *The Rust vs. Go Dilemma: Memory Safety vs. Developer Velocity & Hiring Reality*
6. *Serverless vs. Kubernetes (K8s): Which Fits Modern High-Scale Tech Startups Better?*
7. *Open Source AI vs. Closed Frontier Models: Economic, Security & Geopolitical Implications*
8. *Cloud Repatriation & On-Premises Infrastructure: Is the Public Cloud Honeymoon Over?*
9. *AI Hallucinations in Mission-Critical Systems (Healthcare, Defense, FinTech): Feasibility & Guardrails*
10. *Technical Debt vs. Feature Velocity: How Should High-Growth Engineering Teams Prioritize?*
11. *SQL vs. NoSQL & Vector DBs: Is Polyglot Persistence Essential or an Operational Nightmare?*
12. *Remote vs. Hybrid vs. Office Engineering Cultures: Measuring Productivity, Innovation & Mentorship*
13. *Centralized Platform Engineering vs. Decentralized DevOps: Solving Developer Friction*
14. *Data Privacy, DPDP Act & Global Compliance: Engineering Architecture in the Surveillance Era*
15. *Will Autonomous AI Software Engineers (SWE-bench agents) Replace Junior Developers by 2028?*
