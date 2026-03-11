import {
  FileText, Users, BarChart3, GraduationCap, Search, Download,
  Upload, Shield, Zap, Cpu, BookOpen, Trophy, Microscope,
  Globe2, Lightbulb, Target,
} from "lucide-react";

/* ─── Accent palette (light-safe) ───────────────────────────── */
export const ACCENT = {
  violet:  { bg:"bg-violet-50",  border:"border-violet-200", text:"text-violet-600",  shadow:"hover:shadow-violet-200",  hover:"group-hover:text-violet-600"  },
  amber:   { bg:"bg-amber-50",   border:"border-amber-200",  text:"text-amber-600",   shadow:"hover:shadow-amber-200",   hover:"group-hover:text-amber-600"   },
  blue:    { bg:"bg-blue-50",    border:"border-blue-200",   text:"text-blue-600",    shadow:"hover:shadow-blue-200",    hover:"group-hover:text-blue-600"    },
  emerald: { bg:"bg-emerald-50", border:"border-emerald-200",text:"text-emerald-600", shadow:"hover:shadow-emerald-200", hover:"group-hover:text-emerald-600" },
  rose:    { bg:"bg-rose-50",    border:"border-rose-200",   text:"text-rose-600",    shadow:"hover:shadow-rose-200",    hover:"group-hover:text-rose-600"    },
  cyan:    { bg:"bg-cyan-50",    border:"border-cyan-200",   text:"text-cyan-600",    shadow:"hover:shadow-cyan-200",    hover:"group-hover:text-cyan-600"    },
  orange:  { bg:"bg-orange-50",  border:"border-orange-200", text:"text-orange-600",  shadow:"hover:shadow-orange-200",  hover:"group-hover:text-orange-600"  },
} as const;
export type AccentKey = keyof typeof ACCENT;

/* ─── Orbit card colours ────────────────────────────────────── */
export const ORBIT_COLORS = {
  blue:    { bg:"bg-blue-50",    text:"text-blue-600",    border:"border-blue-200",    dot:"bg-blue-500"    },
  violet:  { bg:"bg-violet-50",  text:"text-violet-600",  border:"border-violet-200",  dot:"bg-violet-500"  },
  emerald: { bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-200", dot:"bg-emerald-500" },
  orange:  { bg:"bg-orange-50",  text:"text-orange-600",  border:"border-orange-200",  dot:"bg-orange-500"  },
  rose:    { bg:"bg-rose-50",    text:"text-rose-600",    border:"border-rose-200",    dot:"bg-rose-500"    },
  cyan:    { bg:"bg-cyan-50",    text:"text-cyan-600",    border:"border-cyan-200",    dot:"bg-cyan-500"    },
} as const;
export type OrbitColorKey = keyof typeof ORBIT_COLORS;

/* ─── Department card palette ───────────────────────────────── */
export const DEPT_PALETTE = [
  { from:"from-blue-50",    border:"border-blue-200 hover:border-blue-400",     icon:"bg-blue-50 text-blue-600",     dot:"bg-blue-500"    },
  { from:"from-violet-50",  border:"border-violet-200 hover:border-violet-400",  icon:"bg-violet-50 text-violet-600", dot:"bg-violet-500"  },
  { from:"from-emerald-50", border:"border-emerald-200 hover:border-emerald-400",icon:"bg-emerald-50 text-emerald-600",dot:"bg-emerald-500"},
  { from:"from-orange-50",  border:"border-orange-200 hover:border-orange-400",  icon:"bg-orange-50 text-orange-600", dot:"bg-orange-500"  },
  { from:"from-rose-50",    border:"border-rose-200 hover:border-rose-400",     icon:"bg-rose-50 text-rose-600",     dot:"bg-rose-500"    },
  { from:"from-cyan-50",    border:"border-cyan-200 hover:border-cyan-400",     icon:"bg-cyan-50 text-cyan-600",     dot:"bg-cyan-500"    },
] as const;

/* ─── Static content ────────────────────────────────────────── */
export const STATS = [
  { label:"Papers Shared",   value:"2,400+", icon:FileText,      bg:"bg-blue-50",    text:"text-blue-600",    border:"border-blue-200"    },
  { label:"Active Students", value:"8,000+", icon:Users,         bg:"bg-violet-50",  text:"text-violet-600",  border:"border-violet-200"  },
  { label:"Total Downloads", value:"50K+",   icon:BarChart3,     bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-200" },
  { label:"Departments",     value:"40+",    icon:GraduationCap, bg:"bg-orange-50",  text:"text-orange-600",  border:"border-orange-200"  },
];

export const STEPS = [
  { n:"01", icon:Search,   title:"Search",     desc:"Enter a department, course, or keyword. Our smart search surfaces the right papers instantly." },
  { n:"02", icon:FileText, title:"Preview",    desc:"See the year, semester, program and course details before you commit to a download."          },
  { n:"03", icon:Download, title:"Download",   desc:"One-click PDF download. No paywall, no signup needed just to browse and download."             },
  { n:"04", icon:Upload,   title:"Contribute", desc:"Upload your own past papers and help your peers. Every upload grows the archive."              },
];

export const FEATURES = [
  { icon:Shield,   title:"Verified Content", desc:"Every paper reviewed before publishing. No junk, no duplicates — only trusted academic content.", accent:"violet"  as AccentKey, wide:true  },
  { icon:Zap,      title:"Instant Access",   desc:"Powerful search gets you to the paper you need in under 30 seconds.",                              accent:"amber"   as AccentKey, wide:false },
  { icon:Cpu,      title:"Smart Filtering",  desc:"Filter by department, course, year, and content type — find exactly what you need.",               accent:"blue"    as AccentKey, wide:false },
  { icon:Users,    title:"Community Driven", desc:"Built by students, for students. Every upload strengthens the archive for everyone.",               accent:"emerald" as AccentKey, wide:false },
  { icon:BookOpen, title:"Fully Organised",  desc:"Structured by department, program, semester, year, and course code for maximum clarity.",           accent:"rose"    as AccentKey, wide:false },
  { icon:Trophy,   title:"Top Contributors", desc:"Leaderboard rewards students who give back. Earn recognition for your contributions.",              accent:"cyan"    as AccentKey, wide:true  },
];

export const CATEGORIES = [
  { icon:Microscope, label:"Sciences",    count:"320+", accent:"blue"    as AccentKey },
  { icon:BarChart3,  label:"Business",    count:"280+", accent:"emerald" as AccentKey },
  { icon:Globe2,     label:"Languages",   count:"190+", accent:"violet"  as AccentKey },
  { icon:Cpu,        label:"Engineering", count:"410+", accent:"orange"  as AccentKey },
  { icon:Lightbulb,  label:"Arts",        count:"150+", accent:"rose"    as AccentKey },
  { icon:Target,     label:"Management",  count:"240+", accent:"cyan"    as AccentKey },
];

export const TESTIMONIALS = [
  { text:"Found my entire semester's papers in minutes. UniResources is absolutely incredible.",      name:"Aisha R.",  role:"CS · Year 3",          stars:5 },
  { text:"Saved me weeks of manual searching. Every student at this university needs this platform.", name:"Usman K.",  role:"Engineering · Year 2", stars:5 },
  { text:"The organization is perfect — year, semester, course code, all in one place.",              name:"Fatima N.", role:"Business · Year 4",    stars:5 },
];

export const SUBJECTS = [
  "Computer Science","Electrical Engineering","Business Administration",
  "Medicine & Health","Law & Legal Studies","Architecture & Design",
  "Education Sciences","Social Sciences","Mathematics","Pharmacy",
];

export const ORBIT_CARDS: { dept:string; course:string; year:string; sem:string; color:OrbitColorKey }[] = [
  { dept:"CS",  course:"Data Structures",      year:"2024", sem:"Fall",   color:"blue"    },
  { dept:"EE",  course:"Circuit Analysis",     year:"2024", sem:"Spring", color:"violet"  },
  { dept:"BBA", course:"Financial Accounting", year:"2023", sem:"Fall",   color:"emerald" },
  { dept:"CS",  course:"Operating Systems",    year:"2024", sem:"Spring", color:"orange"  },
  { dept:"EE",  course:"Digital Logic",        year:"2023", sem:"Fall",   color:"rose"    },
  { dept:"MBA", course:"Strategic Mgmt.",      year:"2024", sem:"Spring", color:"cyan"    },
];

/* ─── Shared section layout tokens ──────────────────────────── */
export const SECTION_CLS = {
  light:  "bg-background",
  muted:  "bg-secondary/20",
  subtle: "bg-secondary/10",
  border: "border-y border-border",
} as const;