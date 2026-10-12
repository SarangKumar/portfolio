import type { Content, Diagram } from "./types";

/**
 * Local seed content. Used whenever Firebase env vars are absent, and as the
 * source for the admin panel's "Import seed" action.
 */
const aavedakDiagram: Diagram = {
  id: "diagram-aavedak",
  slug: "aavedak",
  title: "Aavedak — job-search pipeline",
  summary:
    "Next.js web app and a FastAPI service deployed together as Vercel Services, a Chrome extension stub, Better Auth with Google, and Neon Postgres.",
  status: "published",
  nodes: [
    {
      id: "user",
      label: "Browser",
      kind: "client",
      x: 60,
      y: 160,
      description: "The candidate using the web app.",
    },
    {
      id: "ext",
      label: "Extension",
      kind: "client",
      x: 60,
      y: 300,
      description: "Chrome extension for capturing postings (stub today).",
    },
    {
      id: "web",
      label: "Next.js web",
      kind: "edge",
      x: 260,
      y: 160,
      description:
        "Product UI on Vercel: onboarding, resume, pipeline, follow-ups.",
    },
    {
      id: "api",
      label: "FastAPI",
      kind: "service",
      x: 460,
      y: 230,
      description:
        "FastAPI service under /svc/* — scoring and discovery in Python, deployed as a Vercel Service.",
    },
    {
      id: "db",
      label: "Neon Postgres",
      kind: "data",
      x: 660,
      y: 160,
      description:
        "Single relational store for applications, resumes and outreach.",
    },
    {
      id: "gmail",
      label: "Google OAuth",
      kind: "external",
      x: 660,
      y: 300,
      description: "Google sign-in via Better Auth; sessions stored on Neon.",
    },
  ],
  edges: [
    { id: "e1", from: "user", to: "web", label: "HTTPS" },
    { id: "e2", from: "web", to: "api", label: "REST" },
    { id: "e3", from: "ext", to: "api", label: "capture" },
    { id: "e4", from: "api", to: "db", label: "SQL" },
    { id: "e5", from: "web", to: "db", label: "reads" },
    { id: "e6", from: "web", to: "gmail", label: "OAuth" },
  ],
  flows: [
    {
      id: "score",
      name: "Score a resume against a job",
      steps: [
        { edge: "e1", text: "User opens a saved job in the web app." },
        {
          edge: "e2",
          text: "Web calls the FastAPI service under /svc/* to score the resume against the posting.",
        },
        {
          edge: "e4",
          text: "The API reads and writes job and resume data in Neon Postgres.",
        },
      ],
    },
    {
      id: "signin",
      name: "Sign in with Google",
      steps: [
        { edge: "e1", text: "User visits /sign-in." },
        { edge: "e6", text: "Better Auth runs the Google OAuth flow." },
        { edge: "e5", text: "The session is stored in Neon Postgres." },
      ],
    },
  ],
  decisions: [
    {
      title: "Python for scoring",
      body: "Text processing libraries are stronger in Python; keeping them in a separate service keeps the Next.js app focused on the UI.",
      nodes: ["api"],
    },
    {
      title: "One Postgres",
      body: "One Neon Postgres for app data and auth sessions avoids syncing between stores.",
      nodes: ["db"],
    },
  ],
  tradeoffs: [
    {
      title: "Two runtimes, one project",
      body: "Web and API ship as Vercel Services in one project: one domain and deploy, but two languages to maintain.",
      nodes: ["web", "api"],
    },
  ],
  bottlenecks: [
    {
      title: "Cold starts",
      body: "The Python service runs serverless, so the first request after idle pays a cold start.",
      nodes: ["api"],
    },
  ],
  failures: [
    {
      title: "API down",
      body: "The /svc/health check fails; web pages that only read Postgres keep working while scoring is unavailable.",
      nodes: ["api"],
    },
    {
      title: "Google OAuth misconfigured",
      body: "Without Google keys the app still builds and /sign-in shows setup help instead of failing.",
      nodes: ["gmail"],
    },
  ],
};

const portfolioDiagram: Diagram = {
  id: "diagram-portfolio",
  slug: "portfolio",
  title: "This portfolio — ₹0 infrastructure",
  summary:
    "Statically rendered Next.js on Vercel Hobby with incremental revalidation, Firestore for content and comments, and Firebase Auth gating the admin panel.",
  status: "published",
  nodes: [
    {
      id: "visitor",
      label: "Visitor",
      kind: "client",
      x: 60,
      y: 120,
      description: "Anyone reading the site.",
    },
    {
      id: "admin",
      label: "Admin (you)",
      kind: "client",
      x: 60,
      y: 300,
      description: "Signs in with Google to edit content.",
    },
    {
      id: "vercel",
      label: "Vercel CDN",
      kind: "edge",
      x: 270,
      y: 120,
      description: "Serves pre-rendered pages, revalidated every 60s (ISR).",
    },
    {
      id: "auth",
      label: "Firebase Auth",
      kind: "external",
      x: 270,
      y: 300,
      description:
        "Google sign-in. Only the configured admin email passes the rules.",
    },
    {
      id: "fs",
      label: "Firestore",
      kind: "data",
      x: 500,
      y: 210,
      description:
        "Content collections + comments. Rules enforce published-only reads.",
    },
    {
      id: "seed",
      label: "Seed content",
      kind: "data",
      x: 500,
      y: 60,
      description: "TypeScript fallback when Firebase isn't configured.",
    },
  ],
  edges: [
    { id: "p1", from: "visitor", to: "vercel", label: "GET" },
    { id: "p2", from: "vercel", to: "fs", label: "revalidate" },
    { id: "p3", from: "vercel", to: "seed", label: "fallback" },
    { id: "p4", from: "admin", to: "auth", label: "Google" },
    { id: "p5", from: "auth", to: "fs", label: "ID token" },
    { id: "p6", from: "visitor", to: "fs", label: "comment" },
  ],
  flows: [
    {
      id: "read",
      name: "Page view",
      steps: [
        { edge: "p1", text: "Request hits the CDN and gets cached HTML." },
        {
          edge: "p2",
          text: "At most once a minute, a background render pulls published docs.",
        },
      ],
    },
    {
      id: "comment",
      name: "Board comment",
      steps: [
        {
          edge: "p6",
          text: "Visitor writes a comment; rules force status = pending.",
        },
        { edge: "p4", text: "Admin signs in." },
        {
          edge: "p5",
          text: "Admin approves; it appears after the next revalidation.",
        },
      ],
    },
  ],
  decisions: [
    {
      title: "ISR over SSR",
      body: "Pages are cheap to serve from cache; Firestore reads stay well inside the free tier.",
      nodes: ["vercel", "fs"],
    },
    {
      title: "Rules as the backend",
      body: "No server to run: Firestore rules decide who writes what.",
      nodes: ["fs", "auth"],
    },
  ],
  tradeoffs: [
    {
      title: "Eventual freshness",
      body: "Edits take up to a minute to appear publicly.",
      nodes: ["vercel"],
    },
  ],
  bottlenecks: [
    {
      title: "Comment spam",
      body: "Open writes invite spam; mitigated by moderation, length limits in rules, and optional App Check.",
      nodes: ["fs"],
    },
  ],
  failures: [
    {
      title: "Firestore unavailable",
      body: "Rendering falls back to the bundled seed content; the site stays up.",
      nodes: ["fs"],
    },
  ],
};

export const seed: Content = {
  site: {
    nav: [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
      { href: "/blogs", label: "Blogs" },
      { href: "/library", label: "Library" },
      { href: "/lab", label: "Architecture Lab" },
      { href: "/board", label: "Public Board" },
    ],
    resumeHref: "/resume",
    seo: {
      title: "Sarang Kumar — Software Engineer",
      titleTemplate: "%s · Sarang Kumar",
      description:
        "Portfolio of Sarang Kumar, software engineer in Bangalore: projects, writing, a reading library and an interactive architecture lab.",
    },
    handle: "sarang",
    pages: {
      projects: {
        eyebrow: "Selected work",
        title: "Projects",
        intro:
          "Hover or focus a project for a quick look; open it for the full case study — architecture, implementation, testing and trade-offs.",
      },
      blogs: {
        eyebrow: "Writing",
        title: "Blogs & notes",
        intro: "Articles, technical notes and half-finished thoughts.",
      },
      library: {
        eyebrow: "Library",
        title: "Things I keep",
        intro:
          "Books and reading notes, bookmarks worth returning to, and a notebook of ideas.",
      },
      lab: {
        eyebrow: "Architecture Lab",
        title: "How things are built",
        intro:
          "Interactive system diagrams: play request flows, inspect components, and simulate failures. Every diagram is plain configuration, edited from the admin panel.",
      },
      board: {
        eyebrow: "Public Board",
        title: "Say hello",
        intro:
          "Leave a note, a question or feedback. Everything is read and approved by hand before it appears here.",
      },
    },
    labels: {
      "home.from": "From {location}",
      "home.cta": "Selected work →",
      "home.about": "About",
      "home.featured": "Featured work",
      "home.allProjects": "All projects",
      "home.focus": "Current focus",
      "home.writing": "Recent writing",
      "home.archive": "Archive",
      "projects.future": "Future projects",
      "projects.skills": "Skills — derived from the work above",
      "skills.fromProjects": "From projects",
      "project.kind.shipped": "Live",
      "project.kind.in-progress": "In progress",
      "project.kind.idea": "Idea",
      "project.eyebrow": "Case study · {kind}",
      "project.caseStudy": "Case study",
      "project.live": "Live ↗",
      "project.source": "GitHub ↗",
      "project.exploreLab": "Explore in Architecture Lab →",
      "project.overview": "Overview",
      "project.architecture": "Architecture",
      "project.implementation": "Implementation",
      "project.testing": "Testing",
      "project.tradeoffs": "Trade-offs",
      "project.diagram": "Architecture diagram",
      "project.openLab": "Open in Lab",
      "project.back": "← All projects",
      "blogs.search": "Search the archive…",
      "blogs.all": "All",
      "blogs.empty": "No posts match.",
      "blogs.back": "← Archive",
      "library.books": "Books",
      "library.bookmarks": "Bookmarks & resources",
      "library.notebook": "Notebook",
      "library.reading": "Reading now",
      "library.finished": "Finished",
      "library.queued": "Up next",
      "library.ideas": "Future project ideas",
      "library.engineering": "Engineering notes",
      "lab.stats":
        "{nodes} components · {flows} flows · {failures} failure scenarios",
      "lab.back": "← Architecture Lab",
      "diagram.flow": "Request flow",
      "diagram.component": "Component",
      "diagram.select": "Select a component.",
      "diagram.decisions": "Decisions",
      "diagram.tradeoffs": "Trade-offs",
      "diagram.bottlenecks": "Bottlenecks",
      "diagram.failures": "Failure scenarios",
      "diagram.none": "None recorded.",
      "diagram.simulate": "Click to simulate",
      "diagram.simulating": "Simulating — affected nodes shown",
      "board.empty": "No notes yet — be the first.",
      "board.formTitle": "Leave a note",
      "board.name": "Name",
      "board.message": "Message",
      "board.submit": "Submit",
      "board.sending": "Sending…",
      "board.note": "Comments are moderated before they appear.",
      "board.sent": "Thanks! It'll appear once approved.",
      "board.error": "Couldn't send — try again.",
      "board.disabled": "The board opens once Firebase is configured.",
      "footer.eyebrow": "Together",
      "footer.credit": "© {year} {name}. Design & code by me.",
      "footer.admin": "Admin",
      "nav.search": "Search",
      "palette.placeholder": "Search projects, writing, library, diagrams…",
      "palette.empty": "No results.",
      "terminal.banner": "{handle}.sh — type 'help'",
      "terminal.cwd": "~/portfolio",
      "terminal.help":
        "commands:\n  ls <projects|blogs|library|architecture>   list published items\n  open <slug|page>                           navigate (e.g. open aavedak, open lab)\n  search <terms>                             search everything\n  whoami | status | contact                  about me\n  theme                                      toggle dark/light\n  clear | exit",
      "terminal.whoami": "{name} — {role}, {location}",
      "terminal.status": "{career}",
      "terminal.contact": "{email}",
      "terminal.notFound": "command not found: {cmd}. try 'help'",
      "home.resume": "Experience",
      "home.fullResume": "Full resume",
      "resume.eyebrow": "Resume",
      "resume.title": "Experience & education",
      "resume.download": "Download PDF ↓",
      "resume.experience": "Experience",
      "resume.education": "Education",
      "resume.skills": "Technical skills",
      "resume.achievements": "Highlights",
      "footer.resume": "Resume",
      "notFound.eyebrow": "404",
      "notFound.title": "Nothing brewing here.",
      "notFound.link": "Back home",
    },
    name: "Sarang Kumar",
    role: "Software Engineer",
    location: "Bangalore, IN",
    tagline: "Building calm, well-tested software for real users.",
    intro:
      "Software engineer working across frontend, backend and systems. I build reusable application infrastructure, automate the boring parts, and care about the details most teams skip.",
    about:
      "B.Tech in Computer Science from PES University. At Komprise I worked on customer-facing production systems, cloud-storage workflows, production hotfixes and automated testing.",
    currentFocus: [
      "Shipping Vinyaas — a registry-driven component CLI",
      "Aavedak — a personal job-search operating system",
      "Writing about system design trade-offs",
    ],
    career: {
      available: true,
      label: "Open to SDE roles",
      detail: "Full-time, Bangalore or remote.",
    },
    email: "sarangkumar1578@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/SarangKumar" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sarangkumar4" },
    ],
    featuredProjectSlugs: ["vinyaas", "aavedak", "dotfiles"],
    featuredPostSlugs: [],
    homeSections: {
      featured: true,
      focus: true,
      writing: true,
      skills: true,
      resume: true,
    },
  },
  resume: {
    summary:
      "Software Engineer with 1.5+ years of experience building production applications and developer tools. Skilled in JavaScript, TypeScript, Python, SQL, REST APIs, cloud integrations, application design, performance optimization, and automated testing.",
    pdfUrl: "/resumes/Sarang_Kumar-2.pdf",
    experience: [
      {
        company: "Komprise India Private Limited",
        role: "Software Engineer",
        location: "Bangalore, India",
        period: "Jul 2025 – Present",
        bullets: [
          "Resolved a production Google Cloud Storage filer-onboarding issue, helping protect customer contracts worth approximately $200K annually.",
          "Built an Alerts Center using React, Redux Toolkit, RTK Query, and TanStack Table, integrating REST APIs, global search, advanced filters, protected routes, and 12 months of historical data.",
          "Reduced frontend bundle size by approximately 120 KB by modernizing legacy modules, consolidating shared components, and removing deprecated dependencies.",
          "Expanded automated test coverage with Jest unit tests and Playwright integration and UI tests for critical application workflows.",
          "Integrated reusable UI components and shared form infrastructure across data-store and user-management workflows, improving consistency and maintainability.",
        ],
      },
      {
        company: "Komprise India Private Limited",
        role: "Software Engineer Intern",
        location: "Bangalore, India",
        period: "Jan 2025 – Jun 2025",
        bullets: [
          "Built a Python and MySQL Slack Shift Manager for 12 support engineers, automating availability tracking and support-ticket coordination.",
          "Automated customer usage reporting for 450+ accounts, tracking resource consumption, license expirations, and overages.",
          "Contributed to data-store workflows, internal tools, and application fixes across frontend and systems codebases.",
        ],
      },
    ],
    education: [
      {
        school: "PES University",
        degree: "B.Tech. in Computer Science and Engineering",
        period: "2021 – 2025",
        detail: "CGPA: 8.81/10",
      },
    ],
    skills: [
      {
        group: "Languages",
        items: ["C++", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
      },
      {
        group: "Frontend",
        items: [
          "React",
          "Next.js",
          "Redux Toolkit",
          "RTK Query",
          "TanStack Table",
          "Tailwind CSS",
        ],
      },
      {
        group: "Backend & Databases",
        items: ["Node.js", "Express.js", "REST APIs", "MySQL", "MongoDB"],
      },
      {
        group: "Cloud & Infrastructure",
        items: [
          "Google Cloud Platform (GCP)",
          "Google Cloud Storage (GCS)",
          "Docker",
          "CI/CD",
        ],
      },
      {
        group: "Testing & Engineering",
        items: [
          "Jest",
          "Playwright",
          "Unit Testing",
          "Integration Testing",
          "OOP",
          "DSA",
          "Application Design",
          "Agile Development",
          "Code Review",
        ],
      },
      { group: "Tools", items: ["Git", "GitHub", "Postman", "npm"] },
    ],
    achievements: [
      "Helped protect ~$200K/year in customer contracts by resolving a production GCS filer-onboarding issue.",
      "Cut ~120 KB from the frontend bundle by modernizing legacy modules.",
      "Automated usage reporting for 450+ customer accounts.",
      "Led technical work for Aatmatrisha, a university techno-cultural fest supporting 5,000+ attendees.",
      "Built the dotSlash 5.0 hackathon platform for 140+ participants with QR-based ticketing.",
      "Published Vinyaas — 56 UI primitives and a companion CLI — to npm.",
    ],
  },
  projects: [
    {
      id: "proj-aavedak",
      slug: "aavedak",
      title: "Aavedak",
      icon: "/projects/aavedak.png",
      year: "2026",
      kind: "shipped",
      summary:
        "A personal job-search operating system — resumes, cover letters, ATS scoring, job discovery, referrals and application tracking in one pipeline. It recommends and prepares; you decide and send.",
      description:
        'अवसर — "opportunity." Aavedak is built around one workflow: onboarding → resume → dashboard → job discovery → cover letters → ATS scoring → referrals → applying → tracking → follow-up. App areas include a dashboard, jobs, job tracker, documents, referrals and a shareable public profile at /{username}.',
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS v4",
        "Vinyaas",
        "FastAPI",
        "Python",
        "Neon Postgres",
        "Better Auth",
        "Vercel",
      ],
      githubUrl: "https://github.com/SarangKumar/aavedak",
      demoUrl: "https://aavedak.vercel.app",
      architecture:
        "A pnpm monorepo with three apps:\n\n- `apps/web` — Next.js App Router + TypeScript + Tailwind v4, the product surface\n- `apps/api` — a FastAPI (uvicorn) service, served under `/svc/*`\n- `apps/extension` — a Chrome extension for capturing postings (currently a stub)\n\nBoth web and API deploy as Vercel Services inside a single Vercel project, so there is one domain and no separate server to run. Neon Postgres holds application data and auth sessions.",
      implementation:
        "Authentication is self-hosted Better Auth with Google as the only sign-in provider; session tables live on Neon. The UI uses Vinyaas theme tokens and components (oklch CSS variables, Geist, dark by default), so it shares a design system with this site. Web and API keep separate env files so keys are never mixed, and a setup script bootstraps the JS workspace and the Python 3.12 virtualenv.",
      testing:
        "The web app is linted and type-checked in CI-style scripts (`pnpm lint`, `pnpm build`), and the API exposes a `/svc/health` check used to verify the Vercel Services deploy.",
      tradeoffs:
        "Python for scoring and discovery gives better text tooling, at the cost of a second runtime. Running both as Vercel Services keeps hosting at zero ops — but requires the Vercel root directory to be the repo root, and pins pnpm to a version Vercel supports.",
      sections: [],
      diagramSlug: "aavedak",
      status: "published",
      order: 2,
    },
    {
      id: "proj-vinyaas",
      slug: "vinyaas",
      title: "Vinyaas",
      icon: "/projects/vinyaas.png",
      year: "2026",
      kind: "shipped",
      summary:
        "A CLI that installs reusable Tailwind CSS v4 React components from a registry into your project as source files — not a runtime package. Published on npm, currently v1.4.0.",
      description:
        "Components are copied in as code you own, in the shadcn/ui tradition, and cover forms, feedback, layout, navigation, data display, overlays, charts, typography and utilities. Each is independently installable. Works with React, Next.js and Vite projects on Tailwind v4. This portfolio is built with it.",
      technologies: [
        "TypeScript",
        "Node.js",
        "Next.js",
        "Tailwind CSS v4",
        "React",
        "esbuild",
        "Vitest",
        "pnpm",
      ],
      githubUrl: "https://github.com/SarangKumar/vinyaas",
      demoUrl: "https://vinyaas.vercel.app",
      architecture:
        "A pnpm monorepo: `packages/cli` is the published CLI, and `apps/docs` is the Next.js registry + documentation site (the homepage is the component showcase, with an `/llm.txt` for tools). The registry is built to static JSON under `/r`, which the CLI fetches.\n\nFor each component the CLI fetches the registry item, resolves registry dependencies, installs only the npm packages the project doesn't already declare, writes `components/ui/<name>/index.tsx`, and applies CSS only when the item declares it.",
      implementation:
        "Commands: `init`, `doctor`, `add` (by name or `--category`, with `--dry-run` and `--force`), `list`, `search`, `info` (all with `--json`), `status`, and `update`/`upgrade`. The package manager is detected from the lockfile — there is no silent npm fallback. CSS variables that already exist with a different value stop the install instead of being overwritten, and env vars are reported, never written.\n\nEvery component follows one convention set: native elements first, a shared height scale, semantic colour tokens, and a release-wide accessibility contract (keyboard behaviour, ARIA roles, visible focus rings, reduced-motion support).",
      testing:
        "`pnpm verify` runs typecheck, lint and Vitest tests for both the docs app and the CLI. A release check fails the build if any localhost registry URLs leak into generated JSON before publishing.",
      tradeoffs:
        "Copy-in source means full ownership and no override API — but upgrades become an explicit `vinyaas update` that overwrites local edits after confirmation, rather than a version bump.",
      sections: [],
      status: "published",
      order: 1,
    },
    {
      id: "proj-dotfiles",
      slug: "dotfiles",
      title: ".dotfiles",
      icon: "/projects/dotfiles.svg",
      year: "2026",
      kind: "shipped",
      summary:
        "My macOS development environment as code — one script installs Homebrew packages, Oh My Zsh and symlinked configs for zsh, git, tmux and more.",
      description:
        "A reproducible machine setup: a Brewfile declares the CLI tools and runtimes, GNU Stow symlinks each config package into $HOME, and a non-destructive test script validates the repo before anything is installed.",
      technologies: [
        "Shell",
        "Bash",
        "Zsh",
        "GNU Stow",
        "Homebrew",
        "tmux",
        "Git",
      ],
      githubUrl: "https://github.com/SarangKumar/.dotfiles",
      architecture:
        "Each top-level directory is a Stow package mirroring the layout of `$HOME`:\n\n- `zsh/` — `.zshrc` plus split `aliases.zsh`, `exports.zsh` and `functions.zsh`\n- `git/` — `.gitconfig`\n- `tmux/` — `.tmux.conf`\n- `scripts/` — small executables in `~/.local/bin`\n\nA `Brewfile` keeps software installation separate from configuration.",
      implementation:
        "`install.sh` runs with `set -e`: it installs Homebrew if missing (handling both Apple Silicon and Intel prefixes), disables analytics, runs `brew bundle`, installs Oh My Zsh without letting it overwrite the Stow-managed `.zshrc`, then runs `stow -R` for every package. Helper scripts include `brewup` (update, upgrade and clean up Homebrew) and `cproj` (jump into a project directory).\n\nThe Brewfile covers Stow, git and git-lfs, jq, bat, eza, fzf, ripgrep, fd, tmux, Node, Python, pnpm, Prettier, the AWS CLI and Starship.",
      testing:
        "`test.sh` is intentionally non-destructive: it checks that the repository is valid and ready to install — without installing packages, editing configs or creating symlinks — and reports passes, failures and warnings.",
      tradeoffs:
        "Symlinks via Stow keep every config editable in one git repo, at the cost of a fixed directory convention. Every step is idempotent, so re-running the installer is safe — but it targets macOS only.",
      sections: [],
      status: "published",
      order: 3,
    },
    {
      id: "proj-shift-manager",
      slug: "slack-shift-manager",
      title: "Slack Shift Manager",
      year: "2025",
      kind: "shipped",
      summary:
        "Python automation tracking engineer availability and allocating support tickets through Slack.",
      description:
        "Adopted by 12 support engineers at Komprise, replacing manual coordination.",
      technologies: ["Python", "MySQL", "Slack API"],
      architecture:
        "Object-oriented Python service with MySQL-backed matching; Slack reactions as the operator interface.",
      implementation:
        "A scheduler reads availability, matches tickets, and posts results back as reactions.",
      testing: "Unit tests over the matching rules.",
      tradeoffs: "Internal repo, so no public source or demo.",
      sections: [],
      status: "published",
      order: 4,
    },
    {
      id: "proj-next",
      slug: "next-idea",
      title: "Something next",
      year: "—",
      kind: "idea",
      summary:
        "A placeholder for the next project. Add it from the admin panel.",
      description: "Future projects show up here as ideas until they ship.",
      technologies: [],
      architecture: "",
      implementation: "",
      testing: "",
      tradeoffs: "",
      sections: [],
      status: "published",
      order: 99,
    },
  ],
  posts: [
    {
      id: "post-copy-in",
      slug: "why-copy-in-components",
      title: "Why I ship components as source, not packages",
      excerpt:
        "The trade-offs behind Vinyaas's copy-in model, and when a package is still the better choice.",
      body: "Most component libraries ship as packages. That is great until you need to change one.\n\n## Ownership over abstraction\n\nCopying source means every component is just a file you can edit. There is no override API to learn.\n\n## The cost\n\nUpgrades become explicit: `vinyaas update` refreshes a component from the registry, overwriting local edits only after you confirm.\n\n```bash\nnpx vinyaas add button dialog\n```",
      category: "Engineering",
      tags: ["vinyaas", "react", "tooling"],
      kind: "article",
      date: "2026-09-20",
      status: "published",
    },
    {
      id: "post-free-tier",
      slug: "portfolio-on-free-tier",
      title: "Running a portfolio with an admin panel for ₹0",
      excerpt:
        "Next.js ISR, Firestore rules as the backend, and no servers to babysit.",
      body: "The goal: editable content, moderated comments, and no always-on infrastructure.\n\n## Rules are the backend\n\nFirestore security rules decide who reads drafts and who can approve comments. The admin is a single email.\n\n## Caching\n\nPages revalidate every minute, which keeps reads tiny.",
      category: "Architecture",
      tags: ["nextjs", "firebase", "cost"],
      kind: "article",
      date: "2026-10-05",
      status: "published",
    },
    {
      id: "note-hotfix",
      slug: "notes-on-production-hotfixes",
      title: "Notes on production hotfixes",
      excerpt: "Reproduce, isolate, write the failing test, then fix.",
      body: "A short checklist I keep for hotfixes.\n\n- Reproduce with production data shape\n- Write the failing test first\n- Ship the smallest change\n- Write the root-cause note the same day",
      category: "Notes",
      tags: ["debugging", "process"],
      kind: "note",
      date: "2026-08-14",
      status: "published",
    },
  ],
  books: [
    {
      id: "book-ddia",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      state: "reading",
      notes:
        "Chapter 5 on replication lag is the clearest explanation I've read of read-your-writes.",
      status: "published",
    },
    {
      id: "book-pragprog",
      title: "The Pragmatic Programmer",
      author: "Hunt & Thomas",
      state: "finished",
      notes: "Tracer bullets > prototypes when the architecture is uncertain.",
      status: "published",
    },
    {
      id: "book-sre",
      title: "Site Reliability Engineering",
      author: "Google",
      state: "queued",
      notes: "",
      status: "published",
    },
  ],
  bookmarks: [
    {
      id: "bm-1",
      title: "Firestore security rules",
      href: "https://firebase.google.com/docs/firestore/security/get-started",
      description: "Reference for the rules this site depends on.",
      tags: ["firebase"],
      status: "published",
    },
    {
      id: "bm-2",
      title: "Tailwind CSS v4",
      href: "https://tailwindcss.com/docs",
      description: "CSS-first configuration and @theme.",
      tags: ["css"],
      status: "published",
    },
    {
      id: "bm-3",
      title: "Vinyaas registry",
      href: "https://vinyaas.vercel.app",
      description: "The component library behind this site.",
      tags: ["react"],
      status: "published",
    },
  ],
  notes: [
    {
      id: "idea-1",
      title: "Resume diff viewer",
      body: "Show exactly which bullets changed between tailored resumes, with ATS deltas.",
      kind: "idea",
      status: "published",
    },
    {
      id: "eng-1",
      title: "Prefer boring storage",
      body: "One relational store until a second one clearly pays for its sync cost.",
      kind: "engineering",
      status: "published",
    },
  ],
  skills: [
    {
      id: "s-ts",
      name: "TypeScript",
      category: "Languages",
      status: "published",
    },
    { id: "s-py", name: "Python", category: "Languages", status: "published" },
    { id: "s-java", name: "Java", category: "Languages", status: "published" },
    { id: "s-react", name: "React", category: "Frontend", status: "published" },
    {
      id: "s-next",
      name: "Next.js",
      category: "Frontend",
      status: "published",
    },
    { id: "s-node", name: "Node.js", category: "Backend", status: "published" },
    { id: "s-mysql", name: "MySQL", category: "Data", status: "published" },
    { id: "s-mongo", name: "MongoDB", category: "Data", status: "published" },
    {
      id: "s-pw",
      name: "Playwright",
      category: "Testing",
      status: "published",
    },
    { id: "s-jest", name: "Jest", category: "Testing", status: "published" },
    {
      id: "s-docker",
      name: "Docker",
      category: "Tooling",
      status: "published",
    },
  ],
  diagrams: [portfolioDiagram, aavedakDiagram],
};

export const seedComments = [
  {
    id: "c-1",
    name: "A visitor",
    message: "Love the Architecture Lab — more of these please.",
    createdAt: "2026-10-01T10:00:00.000Z",
    status: "approved" as const,
  },
];
