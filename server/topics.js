export const GD_TOPICS = [
  {
    id: 'ai-jobs',
    title: 'Will Generative AI Replace Software Engineers or 10x Them?',
    category: 'Future of Tech & Employment',
    difficulty: 'Moderate',
    overview: 'As AI coding agents, copilot tools, and automated testing gain autonomy, does the software engineering profession face job obsolescence or an unprecedented era of individual leverage?',
    starterQuestions: [
      'Are entry-level junior engineering roles disappearing as AI writes boilerplate code?',
      'Does software architecture and domain knowledge become more valuable than syntax mastery?',
      'Will total demand for software expand (Jevons paradox) or shrink software payrolls?'
    ],
    keyAngles: {
      aarav: 'Production debugging, distributed consensus, and state synchronization still require deep human intuition and systems experience.',
      priya: 'Benchmarks show 40% speedup on routine CRUD code, but sharp drop-offs on novel algorithmic architecture and concurrency.',
      shubh: 'Security nightmares: AI code copy-pasting introduces critical CVE vulnerabilities, deprecated libraries, and supply-chain risks.',
      arohi: 'Entry-level developer onboarding is threatened; if juniors do not write boilerplate today, who becomes the senior architect of tomorrow?',
      rohan: 'Companies will build 10x more custom software; engineering velocity determines competitive survival in modern markets.'
    }
  },
  {
    id: 'monolith-vs-microservices',
    title: 'Monolith vs Microservices: Did the Tech Industry Over-Engineer Architecture?',
    category: 'Software Architecture',
    difficulty: 'Intermediate',
    overview: 'From Amazon Prime Video moving back to monoliths to startups drowning in Kubernetes YAML, did Silicon Valley push microservices prematurely to the detriment of engineering velocity?',
    starterQuestions: [
      'At what scale and team size does microservices architecture actually pay off?',
      'How much developer cognitive load is wasted on network latency, distributed transactions, and Docker orchestration?',
      'Is the Modular Monolith the ultimate pragmatic sweet spot for 95% of engineering organizations?'
    ],
    keyAngles: {
      aarav: 'Distributed tracing, network partition failures, and RPC serialization overhead cost more than vertical hardware upgrades.',
      priya: 'Cloud telemetry proves over 75% of Kubernetes clusters run at under 15% CPU utilization while tripling DevOps spend.',
      shubh: 'Microservices create sprawling security perimeters and complex IAM policies where privilege escalation runs rampant.',
      arohi: 'Team culture and organizational cognitive load: Conway\'s law often forces unneeded organizational silos.',
      rohan: 'Time-to-market is the only startup survival metric. If your team cannot deploy in 5 minutes, architecture failed.'
    }
  },
  {
    id: 'open-vs-closed-ai',
    title: 'Open Source AI Models vs Big Tech Proprietary Moats: Who Wins the AI Era?',
    category: 'Tech Sovereignty & Open Source',
    difficulty: 'Advanced',
    overview: 'Open weights (DeepSeek, Llama, Mistral) are matching closed models (OpenAI, Google) at a fraction of the inference cost. Will proprietary API moats evaporate or will frontier training compute barriers prevail?',
    starterQuestions: [
      'Can proprietary models justify 10x API costs when open weights run locally with full data privacy?',
      'Will safety regulations and compute cluster caps be used by incumbents to stifle open source innovation?',
      'Does open source win on tooling, fine-tuning, and enterprise sovereignty as Linux did with operating systems?'
    ],
    keyAngles: {
      aarav: 'On-premise deployment, zero data egress risk, and custom quantization make open models unmatched for enterprise SLA.',
      priya: 'Distillation techniques and speculative decoding enable open 8B models to match last year\'s 70B models in efficiency.',
      shubh: 'Open weights allow bad actors to strip safety guardrails and run unrestricted malware or automated exploit generation.',
      arohi: 'Global democratic access to intelligence prevents monolithic corporate gatekeeping of human knowledge.',
      rohan: 'Frontier closed labs will retain the absolute ceiling on multi-modal agentic reasoning, while open source commoditizes the floor.'
    }
  },
  {
    id: 'remote-vs-office',
    title: 'Remote vs In-Office: Is Engineering Innovation Suffering Without Whiteboards?',
    category: 'Workplace & Engineering Culture',
    difficulty: 'Moderate',
    overview: 'Big tech is enforcing strict Return-to-Office (RTO) mandates citing collaboration and mentorship, while top engineering talent demands asynchronous freedom and global remote flexibility.',
    starterQuestions: [
      'Can junior engineers effectively apprentice and absorb architectural wisdom over Slack and Zoom?',
      'Do serendipitous hallway conversations genuinely drive technological breakthroughs?',
      'Is RTO really about collaboration, or commercial real estate investments and stealth layoffs?'
    ],
    keyAngles: {
      aarav: 'Asynchronous documentation, clean PR reviews, and deep focus time yield higher code quality than open-plan office noise.',
      priya: 'Telemetry metrics show higher commits in remote setups, but cross-team architectural cohesion drops by 18%.',
      shubh: 'RTO mandates are often disguised executive control mechanisms and attrition drivers without empirical productivity proof.',
      arohi: 'Global talent inclusion: Remote work breaks geographic barriers, giving opportunities to talent outside Tier-1 hubs.',
      rohan: 'For seed-stage startups, high-bandwidth in-person alignment accelerates product pivots; for mature enterprise, remote wins.'
    }
  },
  {
    id: 'ai-liability',
    title: 'Should Software Engineers & Executives Be Held Legally Liable for Critical AI Failures?',
    category: 'Legal, Ethics & Engineering Standards',
    difficulty: 'Challenging',
    overview: 'As AI powers autonomous vehicles, medical diagnostics, credit scoring, and power grids, where does the legal and moral liability lie when non-deterministic algorithms cause catastrophe?',
    starterQuestions: [
      'Should software engineering adopt licensed professional certifications like civil and aerospace engineering?',
      'Can developers be blamed when foundation models exhibit emergent non-deterministic failure modes?',
      'Will excessive personal liability paralyze open-source contributions and software experimentation?'
    ],
    keyAngles: {
      aarav: 'Formal verification, deterministic fallback circuits, and failsafes must be the engineering standard for safety-critical systems.',
      priya: 'Explainability and audit trails: Without reproducible seeds and dataset lineage, assigning legal fault is technically impossible.',
      shubh: 'If software engineers demand professional pay and autonomy without engineering liability, society will mandate licensure.',
      arohi: 'Accountability cannot stop at the algorithm; executive leadership and deployment oversight must bear legal responsibility.',
      rohan: 'Enterprise insurance and indemnity clauses already shield engineers, but ethical accountability is non-negotiable.'
    }
  },
  {
    id: 'prompt-eng',
    title: 'Is Prompt Engineering Dead with Frontier Reasoning Models (o1, R1, Sonnet 3.7)?',
    category: 'AI Architectures & Skills',
    difficulty: 'Intermediate',
    overview: 'With the arrival of test-time compute reasoning models that think through steps, chain of thought, and self-correct, is prompt engineering a fleeting fad or evolving into context engineering?',
    starterQuestions: [
      'Is manual few-shot prompting and "jailbreak phrasing" obsolete with reasoning models?',
      'Does prompt engineering simply transition into Context Engineering, RAG indexing, and Tool Calling schemas?',
      'Should universities teach prompt engineering, or focus strictly on core computer science foundations?'
    ],
    keyAngles: {
      aarav: 'Latency and token cost of deep reasoning models in production make deterministic caching and strict structured schemas critical.',
      priya: 'Benchmark drift: Test-time compute scales with search, but context retrieval hygiene still dictates output quality.',
      shubh: 'Reasoning models can overthink simple tasks, burn massive token compute, and still hallucinate with higher confidence.',
      arohi: 'Democratization: Everyday engineers and non-coders can communicate in natural intent rather than esoteric prompt tricks.',
      rohan: 'Enterprise ROI: Businesses care about automated workflow reliability, not handcrafted prompt tricks.'
    }
  },
  {
    id: 'cs-degree-relevance',
    title: 'Is a 4-Year Computer Science Degree Still Necessary in the Age of Generative AI & Bootcamps?',
    category: 'Engineering Education & Placement Hiring',
    difficulty: 'Moderate',
    overview: 'With AI tools writing production code and bootcamps training full-stack developers in months, do technology firms still need candidates with four-year computer science degrees?',
    starterQuestions: [
      'Does core CS theory (OS, compilers, automata, discrete math) matter when building modern web apps?',
      'Are campus placement cutoffs relying on degrees as a quality signal or a legacy filtering mechanism?',
      'Can self-taught developers compete on deep systems optimization and algorithmic problem solving?'
    ],
    keyAngles: {
      aarav: 'When high-throughput systems crash under memory leaks or thread deadlocks, understanding OS primitives and kernel scheduling is non-negotiable.',
      priya: 'Web development can be learned without a degree, but ML mathematics, linear algebra, and GPU kernel programming require rigorous academic foundations.',
      shubh: 'Campus placement degree requirements are legacy gatekeeping that filters out passionate self-taught hackers with proven GitHub repositories.',
      arohi: 'In India, engineering institutions provide vital socio-economic mobility; dismantling degree requirements without standard credentials hurts underprivileged talent.',
      rohan: 'Hiring managers care about execution velocity and problem-solving grit; degrees are secondary to shipping resilient production software.'
    }
  },
  {
    id: 'rust-vs-cpp',
    title: 'Memory Safety vs Raw Legacy Power: Should Industry Mandate Rust Over C/C++ in Systems Programming?',
    category: 'Systems Programming & Cyber Defense',
    difficulty: 'Advanced',
    overview: 'With Microsoft, Google, and governments advocating for memory-safe languages to eliminate 70% of zero-day exploits, should Rust replace C and C++ in operating systems and systems infrastructure?',
    starterQuestions: [
      'Does Rust\'s borrow checker impose prohibitive developer cognitive overhead and slow compilation cycles?',
      'Can modern C++ with smart pointers and static analyzers achieve comparable safety without rewriting legacy code?',
      'Will legacy embedded hardware, gaming engines, and high-frequency trading systems ever abandon C++?'
    ],
    keyAngles: {
      aarav: 'Rust eliminates use-after-free and data races at compile time without a garbage collector, saving weeks of production debugging.',
      priya: 'Compilation benchmarks show Rust build times are 3x slower than C++, but downstream incident response hours drop by over 60%.',
      shubh: '70% of historical vulnerabilities in Chromium and Android were memory safety bugs; refusing to adopt Rust is professional negligence in security.',
      arohi: 'The steep learning curve of Rust creates an elitist developer barrier; legacy systems cannot simply be rewritten overnight without new bugs.',
      rohan: 'Rewriting working C++ infrastructure in Rust provides zero ROI for existing products; Rust should be strictly enforced for all greenfield systems code.'
    }
  },
  {
    id: 'cloud-exit-onprem',
    title: 'The Cloud Exit: Are Skyrocketing AWS/GCP Bills Driving Tech Companies Back to On-Prem Bare Metal?',
    category: 'Cloud Infrastructure & FinOps',
    difficulty: 'Intermediate',
    overview: 'High-profile migrations (like 37signals leaving the cloud to save millions) have sparked an industry debate: has cloud computing become an overpriced trap for mature software companies?',
    starterQuestions: [
      'At what infrastructure scale does purchasing dedicated servers become dramatically cheaper than AWS or GCP?',
      'Does on-premise infrastructure reintroduce hardware procurement delays and expensive in-house sysadmin teams?',
      'Are multi-cloud architectures a practical resilience strategy or an operational nightmare?'
    ],
    keyAngles: {
      aarav: 'Cloud providers markup compute, RAM, and egress bandwidth by 400%; high-density bare-metal servers pay for themselves in under 12 months.',
      priya: 'Cloud egress data costs throttle large-scale ML model training; storing petabytes in S3 is economically unsustainable compared to colocation.',
      shubh: 'Cloud provides battle-tested automated patching, DDoS mitigation, and compliance certifications that small in-house teams cannot replicate.',
      arohi: 'Vendor lock-in with proprietary services (DynamoDB, Lambda) robs engineering teams of technical independence and bargaining leverage.',
      rohan: 'For seed-stage startups, cloud elasticity is invaluable; for profitable scale-ups with predictable steady-state traffic, bare-metal delivers massive margins.'
    }
  },
  {
    id: 'dpdp-privacy-india',
    title: 'Digital Personal Data Protection (DPDP) Act: Can Indian Startups Comply Without Hurting Growth?',
    category: 'Data Privacy & Indian Tech Ecosystem',
    difficulty: 'Moderate',
    overview: 'India\'s DPDP Act mandates explicit consent, data minimization, and penalties up to ₹250 crore. Can bootstrapped startups adapt to stringent compliance frameworks?',
    starterQuestions: [
      'Will compliance costs give well-funded Big Tech an unfair advantage over early-stage Indian startups?',
      'How should backend data architectures be redesigned for verifiable data deletion and consent logs?',
      'Does customer data protection build lasting brand trust or slow down product-market fit iteration?'
    ],
    keyAngles: {
      aarav: 'Architecting immutable consent audit logs and distributed user data deletion cascades across microservice databases requires significant refactoring.',
      priya: 'Machine learning models trained on user data pose severe compliance dilemmas; unlearning user embeddings without retraining is technically unsolved.',
      shubh: 'Lax data handling in Indian tech has caused massive leaks of Aadhaar and KYC data; harsh penalties are the only way to enforce security hygiene.',
      arohi: 'Privacy is a fundamental constitutional right; Indian citizens deserve the same rigorous digital protections as European users under GDPR.',
      rohan: 'Regulators must create safe-harbor sandboxes for pre-revenue startups so founders aren\'t paralyzed by legal compliance during early MVP stages.'
    }
  },
  {
    id: 'moonlighting-culture',
    title: 'Moonlighting and Side Projects in Tech: Unethical Breach of Trust or Fundamental Developer Freedom?',
    category: 'Engineering Workplace Culture',
    difficulty: 'Moderate',
    overview: 'Indian IT giants fired hundreds of engineers for moonlighting, while startup culture celebrates founders who built side projects. Where is the line between loyalty and personal autonomy?',
    starterQuestions: [
      'As long as primary job deliverables are met without conflict of interest, should employers dictate after-hours activities?',
      'Does working on dual projects cause cognitive burnout, reduced code quality, and intellectual property leaks?',
      'Are low entry-level IT services salaries the true driving force behind tech moonlighting in India?'
    ],
    keyAngles: {
      aarav: 'Building open-source projects, personal SaaS tools, and weekend experiments sharpens engineering architecture skills that directly benefit employers.',
      priya: 'Cognitive fatigue from secondary jobs directly correlates with increased bugs, delayed code reviews, and missed production release dates.',
      shubh: 'Intellectual property contamination and corporate data leakage during moonlighting expose enterprises to devastating legal liability.',
      arohi: 'Stagnant entry-level IT salaries of ₹3.5 LPA that haven\'t kept pace with inflation make supplemental income an economic necessity for young engineers.',
      rohan: 'Companies pay for contractual output, not 24/7 personal ownership of human talent; employment contracts must modernize with transparent disclosure policies.'
    }
  },
  {
    id: 'superapps-vs-vertical',
    title: 'The Super-App Ambition: Can Unified Ecosystems Win in India or Will Focused Vertical Apps Prevail?',
    category: 'Product Strategy & Consumer Tech',
    difficulty: 'Intermediate',
    overview: 'Conglomerates (Tata Neu, Reliance Jio, Paytm) aspire to build WeChat-style super-apps combining commerce, payments, travel, and groceries. Can all-in-one apps beat specialized vertical leaders?',
    starterQuestions: [
      'Does combining multiple complex micro-frontends into one super-app degrade mobile app performance and battery efficiency?',
      'Do consumers prefer single-purpose apps with exceptional UX (Zomato, Swiggy, Uber) over cluttered multi-service portals?',
      'Can unified loyalty points and cross-selling overcome the engineering overhead of monolithic mobile applications?'
    ],
    keyAngles: {
      aarav: 'Bundling dozens of services creates massive mobile APK bloat, slow cold-boot times, complex caching layers, and high memory footprints on budget smartphones.',
      priya: 'Super-apps gain unified cross-category telemetry data, enabling hyper-personalized recommendation algorithms and predictive purchase models.',
      shubh: 'A single compromised OAuth token or authentication session in a super-app grants malicious actors access to the user\'s finances, travel, and identity.',
      arohi: 'Monopolistic super-apps stifle independent tech competition by forcing merchants into predatory walled-garden platform fees.',
      rohan: 'Customer acquisition costs in India are brutal; super-apps lower CAC through cross-promotion, but fail if core transaction flows lack frictionless UX.'
    }
  },
  {
    id: 'ev-grid-transition',
    title: 'Electric Vehicles & Clean Mobility: Is India\'s Power Grid and Charging Infrastructure Ready for 2030?',
    category: 'Sustainable Engineering & Power Systems',
    difficulty: 'Challenging',
    overview: 'India targets 30% EV adoption by 2030. Can transformer infrastructure, thermal power generation, battery raw material supply chains, and fast charging handle the load?',
    starterQuestions: [
      'What happens to local distribution transformers when entire residential colonies plug in EV chargers simultaneously at night?',
      'Is switching to EVs genuinely green if the charging grid is powered by coal-fired thermal power plants?',
      'Should India standardize battery swapping networks or prioritize high-speed DC charging corridors?'
    ],
    keyAngles: {
      aarav: 'Smart charging protocols, automated peak-shaving, and Vehicle-to-Grid (V2G) bidirectional power flow are required to prevent transformer blowouts.',
      priya: 'Data telemetry from battery management systems (BMS) in Indian summer temperatures shows severe lithium degradation requiring specialized active cooling.',
      shubh: 'Grid-connected charging networks introduce cyber-physical attack vectors; malicious firmware updates could destabilize regional power frequencies.',
      arohi: 'Public transit electrification (buses, metro, 2-wheelers) yields 5x greater societal emission reduction than subsidizing luxury electric cars for the elite.',
      rohan: 'Standardized battery swapping for two and three-wheelers solves range anxiety and upfront vehicle cost for India\'s massive gig economy.'
    }
  },
  {
    id: 'cbdc-vs-crypto',
    title: 'Central Bank Digital Currencies (Digital Rupee) vs Decentralized Crypto: The Future of Sovereign Finance',
    category: 'Fintech & Distributed Systems',
    difficulty: 'Advanced',
    overview: 'The Reserve Bank of India launched the Digital Rupee (e₹), while public blockchains advocate decentralized finance. Will sovereign CBDCs replace cash or can decentralized tokens coexist?',
    starterQuestions: [
      'What advantages does a programmable Digital Rupee offer over India\'s already world-class UPI real-time payment network?',
      'Does a centralized ledger grant governments total financial surveillance and programmable spending controls over citizens?',
      'Can decentralized smart contracts deliver financial inclusion without extreme price volatility and speculative fraud?'
    ],
    keyAngles: {
      aarav: 'CBDC settlement eliminates counterparty risk and multi-day interbank clearing, but scaling centralized ledger throughput to billions of daily transactions is an engineering marvel.',
      priya: 'UPI handles 14 billion transactions monthly with sub-second latency; justifying CBDC architectural replacement requires clear offline transaction capabilities.',
      shubh: 'Programmable currency allows authorities to implement expiry dates on money or freeze citizen wallets with a single database command.',
      arohi: 'Physical cash preserves human privacy and dignity; fully digital state currencies threaten civil liberties if absolute anonymity is abolished.',
      rohan: 'Cross-border remittances and trade settlements are where CBDCs shine, bypassing expensive SWIFT fees and clearing in seconds.'
    }
  },
  {
    id: 'critical-infra-cybersecurity',
    title: 'Ransomware on Hospitals, Telecom, and Power Grids: Why Is Cybersecurity Still an Afterthought?',
    category: 'Cybersecurity & National Infrastructure',
    difficulty: 'Challenging',
    overview: 'Attacks on AIIMS Delhi, Kudankulam nuclear plant, and state power grids show critical public infrastructure remains dangerously vulnerable. Why are tech budgets neglecting cyber defense?',
    starterQuestions: [
      'Why do public sector utilities continue to run unpatched legacy systems with exposed Remote Desktop Protocols (RDP)?',
      'Should critical infrastructure operators be prohibited by law from paying cryptocurrency ransoms to extortionists?',
      'How can Zero-Trust Architecture and air-gapped operational technology (OT) be mandated across state utilities?'
    ],
    keyAngles: {
      aarav: 'Air-gapping OT networks from corporate IT networks, implementing strict network segmentation, and automated immutable backups are fundamental engineering duties.',
      priya: 'Behavioral anomaly detection algorithms can identify lateral network movement and data exfiltration hours before ransomware triggers encryption.',
      shubh: 'Legacy SCADA systems were designed decades ago for reliability, not security; connecting legacy PLCs to public internet interfaces is catastrophic negligence.',
      arohi: 'Ransomware on hospitals directly costs human lives; cybersecurity is not an IT cost center, but a core component of national public health and defense.',
      rohan: 'Until executive compensation and board bonuses are tied directly to security audit performance, enterprises will treat cyber defense as a corner-cutting expense.'
    }
  }
];
