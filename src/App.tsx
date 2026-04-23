import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Sun, Moon, Menu, X, Mail, ExternalLink, 
  ChevronDown, Code2, Palette, Bot, Layers, Terminal, Zap, Globe,
  ArrowRight, Sparkles, CheckCircle2, Send, MapPin, Calendar
} from 'lucide-react';

// Custom SVG Icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GraduationCapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

// Theme Context
type Theme = 'light' | 'dark';
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as Theme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
};

// Custom cursor
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      >
        <div className="w-8 h-8 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </>
  );
};

// Typing Effect
const TypingEffect = ({ texts, speed = 100 }: { texts: string[]; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
      {displayText}<span className="animate-pulse">|</span>
    </span>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <motion.div
    whileHover={hover ? { scale: 1.02, y: -5 } : {}}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`
      backdrop-blur-xl bg-white/[0.08] dark:bg-white/[0.05] 
      border border-white/[0.15] dark:border-white/[0.1]
      rounded-2xl shadow-xl shadow-black/[0.1] dark:shadow-black/[0.3]
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// Floating Orb Background
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute rounded-full blur-3xl"
        style={{
          left: `${20 + i * 15}%`,
          top: `${20 + i * 10}%`,
          width: '300px',
          height: '300px',
          opacity: 0.3,
          background: `linear-gradient(135deg, rgba(99, 102, 241, ${0.1 + i * 0.05}), rgba(139, 92, 246, ${0.1 + i * 0.05}))`,
        }}
      />
    ))}
    <div 
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
      style={{
        backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

// Section Wrapper with Scroll Animation
const SectionWrapper = ({ children, id, className = '' }: { children: React.ReactNode; id: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`relative py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Skill Card
const SkillCard = ({ icon: Icon, title, items, index }: { icon: any; title: string; items: string[]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <GlassCard className="p-6 h-full group cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
            <Icon className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              className="px-3 py-1 text-sm rounded-full bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.1] text-slate-600 dark:text-slate-300 hover:border-indigo-400/50 hover:text-indigo-400 transition-colors"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Project Card
const ProjectCard = ({ title, description, tags, demo, source, index, gradient }: { 
  title: string; description: string; tags: string[]; demo: string; source: string; index: number; gradient: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <GlassCard hover={false} className="overflow-hidden">
        <div className={`h-48 ${gradient} relative overflow-hidden`}>
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <motion.a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/30"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </motion.a>
            <motion.a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-button"
            >
              <GithubIcon className="w-4 h-4" /> Source
            </motion.a>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Timeline Item
const TimelineItem = ({ role, company, period, description, skills, index }: {
  role: string; company: string; period: string; description: string; skills: string[]; index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50" />
      {index !== 2 && <div className="absolute left-[7px] top-4 w-[2px] h-full bg-gradient-to-b from-indigo-500/50 to-transparent" />}
      <GlassCard className="p-6 ml-4">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{role}</h3>
          <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400">@ {company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{period}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-3 py-1 text-xs rounded-full bg-white/[0.1] text-slate-600 dark:text-slate-400">
              {skill}
            </span>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Stats Counter
const StatsCounter = ({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">{label}</div>
    </motion.div>
  );
};

// Navigation
const Navigation = ({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] dark:bg-black/[0.3] border-b border-white/[0.1] dark:border-white/[0.05]" />
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold cursor-none"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Ravi</span>
          <span className="text-slate-800 dark:text-white">.dev</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              whileHover={{ y: -2 }}
              className={`relative text-sm font-medium transition-colors cursor-none ${
                activeSection === link.href.slice(1)
                  ? 'text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-400'
              }`}
            >
              {link.label}
              {activeSection === link.href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                />
              )}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full glass-button cursor-none"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Moon className="w-5 h-5 text-slate-700" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Sun className="w-5 h-5 text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/30 cursor-none"
          >
            <Sparkles className="w-4 h-4" /> Hire Me
          </motion.a>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass-button cursor-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <GlassCard className="p-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-400 transition-colors cursor-none"
                >
                  {link.label}
                </motion.a>
              ))}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Main App
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const skills = {
    frontend: {
      icon: Code2,
      title: 'Frontend Engineering',
      items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    },
    ai: {
      icon: Bot,
      title: 'AI Integration',
      items: ['OpenAI API', 'Ollama Local', 'LM Studio', 'REST APIs', 'LangChain', 'Vector DBs', 'AI Agents'],
    },
    tools: {
      icon: Terminal,
      title: 'DevOps & Tools',
      items: ['Git', 'Docker', 'VS Code', 'Cursor', 'Vite', 'CI/CD', 'Linux'],
    },
    design: {
      icon: Palette,
      title: 'Design & Creative',
      items: ['Figma', 'UI/UX Design', 'Motion Design', 'Game Arts', 'Blender', 'Photoshop'],
    },
  };

  const projects = [
    {
      title: 'Entropic Reality',
      description: 'An immersive interactive 3D/Visual experience bridging creative coding and web mechanics. Features advanced WebGL shaders and real-time particle systems.',
      tags: ['JavaScript', 'Canvas', 'WebGL', 'Three.js', 'GLSL'],
      demo: 'https://ravisairockey.github.io/entropic-reality/',
      source: 'https://github.com/ravisairockey/entropic-reality',
      gradient: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700',
    },
    {
      title: 'Stop Tutorial Hell',
      description: 'Interactive learning platform engineered to break the cycle of passive consumption. Features adaptive quizzes and progress tracking.',
      tags: ['TypeScript', 'React', 'Educational', 'Interactive'],
      demo: 'https://ravisairockey.github.io/stop-tutorial-hell/',
      source: 'https://github.com/ravisairockey/stop-tutorial-hell',
      gradient: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600',
    },
    {
      title: 'AI Warfare Intel',
      description: 'Advanced data visualization dashboard utilizing AI APIs for real-time strategic analysis. Features interactive charts and AI-powered insights.',
      tags: ['AI APIs', 'Data Viz', 'JavaScript', 'HTML/CSS'],
      demo: 'https://ravisairockey.github.io/ai-modern-warfare-intelligence/',
      source: 'https://github.com/ravisairockey/ai-modern-warfare-intelligence',
      gradient: 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500',
    },
  ];

  const experiences = [
    {
      role: 'Frontend Engineer + AI Integrator',
      company: 'Freelance',
      period: '2021 - Present',
      description: 'Building intelligent, enterprise-ready interfaces with modern web technologies and AI integration. Specializing in React ecosystems and local AI model deployment.',
      skills: ['React', 'TypeScript', 'AI Integration', 'UI/UX'],
    },
    {
      role: 'Game Designer',
      company: 'Creative Studios',
      period: '2019 - 2021',
      description: 'Designed and developed game mechanics and visual experiences. Transitioned skills to web development, bringing unique perspective to interactive UIs.',
      skills: ['Game Design', 'Unity', 'Blender', 'Player Experience'],
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0f] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Global Styles */}
      <style>{`
        * {
          cursor: none;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto;
          }
        }
        .glass-button {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .text-gradient {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#0a0a0f' : '#f1f5f9'};
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 4px;
        }
      `}</style>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingOrbs />
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for hire
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-slate-800 dark:text-white">Hi, I'm </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ravi Sai
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-4xl font-semibold mb-8 h-12"
          >
            <TypingEffect texts={['Frontend Engineer', 'AI Integrator', 'UI/UX Designer', 'Creative Developer']} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            Building intelligent, enterprise-ready interfaces with modern web technologies and AI integration. 
            3+ years of crafting digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-200 text-white font-semibold shadow-xl cursor-none"
            >
              View My Work <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full glass-button font-semibold cursor-none"
            >
              Get In Touch
            </motion.button>
          </motion.div>

          {/* Floating Skill Cards */}
          <div className="absolute hidden lg:block w-full top-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className={`absolute ${i === 0 ? 'left-0 top-20' : i === 1 ? 'right-0 top-0' : 'left-20 bottom-20'}`}
              >
                <GlassCard className="p-4 flex items-center gap-3">
                  {i === 0 && <Bot className="w-6 h-6 text-indigo-400" />}
                  {i === 1 && <Code2 className="w-6 h-6 text-cyan-400" />}
                  {i === 2 && <Sparkles className="w-6 h-6 text-purple-400" />}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {i === 0 ? 'Local AI Expert' : i === 1 ? 'React Specialist' : 'Creative Coder'}
                  </span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <SectionWrapper id="about" className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">About</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3">Me</span>
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Avatar/Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gradient">RS</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>Karnataka, India</span>
                  </div>
                </div>
              </GlassCard>
              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-24 h-24 border-2 border-dashed border-indigo-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-dashed border-purple-500/30 rounded-full"
              />
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  Building the Future of Web Interfaces
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  I'm a <span className="text-indigo-400 font-semibold">Frontend Engineer + AI Integrator</span> with a unique background in Game Arts (BA). 
                  This combination gives me a rare blend of <span className="text-purple-400 font-semibold">design thinking</span> and 
                  <span className="text-cyan-400 font-semibold"> technical execution</span>.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  I specialize in setting up <span className="font-semibold">local AI environments</span> with Ollama and LM Studio, 
                  creating seamless REST API integrations, and building beautiful, highly interactive user interfaces 
                  that leverage the power of local AI models.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['React', 'TypeScript', 'Next.js', 'AI Integration', 'UI/UX', 'Local LLMs'].map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <StatsCounter value={3} suffix="+" label="Years Exp." />
                <StatsCounter value={15} suffix="+" label="Projects" />
                <StatsCounter value={100} suffix="%" label="Remote OK" />
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Skills Section */}
      <SectionWrapper id="skills" className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Technical</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3">Skills</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive toolkit spanning frontend development, AI integration, and creative design
            </p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(skills).map((skill, index) => (
              <SkillCard key={skill.title} {...skill} index={index} />
            ))}
          </div>

          {/* Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                Specializations
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Bot, title: 'Local AI Setup', desc: 'Ollama, LM Studio, REST APIs for local LLM integration' },
                  { icon: Layers, title: 'Workflow Automation', desc: 'Building efficient development workflows with modern tools' },
                  { icon: Globe, title: 'Cursor/OpenCode', desc: 'Expert in AI-assisted coding environments and agents' },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-4 rounded-xl bg-white/[0.05] dark:bg-white/[0.03]"
                  >
                    <spec.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{spec.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{spec.desc}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Projects Section */}
      <SectionWrapper id="projects" className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Featured</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3">Projects</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A showcase of immersive web experiences blending creativity with technical excellence
            </p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>

          {/* GitHub CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.a
              href="https://github.com/ravisairockey"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-button font-semibold cursor-none"
            >
              <GithubIcon className="w-5 h-5" />
              View More on GitHub
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Experience Section */}
      <SectionWrapper id="experience" className="relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Work</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3">Experience</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From Game Design to Frontend Engineering - my journey through creative and technical domains
            </p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </motion.div>

          <div className="relative">
            {experiences.map((exp, index) => (
              <TimelineItem key={exp.company} {...exp} index={index} />
            ))}
          </div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <GraduationCapIcon className="w-6 h-6 text-indigo-400" />
                Education
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">BA in Game Arts</h4>
                    <p className="text-slate-600 dark:text-slate-400">Communication Design</p>
                  </div>
                  <span className="text-sm text-slate-500">2019 - 2021</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This unique background in game development informs my approach to building highly interactive, 
                  engaging user interfaces with robust architecture and state management.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper id="contact" className="relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Let's</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3">Connect</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Open to Frontend Engineer roles with AI integration opportunities. Let's build the future of web interfaces together.
            </p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="mailto:ravi@vigneswara.dev" className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] hover:bg-indigo-500/10 transition-colors group">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
                      <Mail className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-800 dark:text-white">ravi@vigneswara.dev</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="p-3 rounded-xl bg-green-500/20">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="font-medium text-green-400">Available for hire</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                {[
                  { icon: GithubIcon, href: 'https://github.com/ravisairockey', label: 'GitHub' },
                  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/ravi-sai-vigneswara-113894191/', label: 'LinkedIn' },
                  { icon: YoutubeIcon, href: 'https://www.youtube.com/channel/UC9DQDyzVNUKGhMwNZ-mJg7Q', label: 'YouTube' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-2xl glass-button cursor-none"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6 text-slate-700 dark:text-slate-300 hover:text-indigo-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-800 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-800 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-slate-800 dark:text-white"
                      placeholder="Your message..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-200 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow cursor-none"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/[0.1]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Ravi</span>
              <span className="text-slate-800 dark:text-white">.dev</span>
            </span>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Building the future, one pixel at a time.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              © {new Date().getFullYear()} Ravi Sai Vigneswara. Crafted with passion.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
