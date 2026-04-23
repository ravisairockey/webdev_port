import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Sun, Moon, Menu, X, Mail, ExternalLink,
  ChevronDown, Code2, Palette, Bot, Layers, Terminal, Zap, Globe,
  ArrowRight, Sparkles, CheckCircle2, Send, MapPin, Calendar,
  Volume2, VolumeX, MousePointer2, Play, Pause, Award, Star,
  Briefcase, Cpu, Rocket, Heart, Download
} from 'lucide-react';
import { sound } from './utils/sound';

/* ============================================================
   PREMIUM PORTFOLIO - Ravi Sai Vigneswara
   Features: Sound FX, Micro-interactions, Responsive, Particles,
   Cursor Glow, Magnetic Buttons, Tilt Cards, Spotlight, Marquee
   ============================================================ */

// ==================== THEME ====================
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
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return { theme, toggleTheme: () => { sound.toggle(); setTheme(t => t === 'light' ? 'dark' : 'light'); } };
};

// ==================== CURSOR GLOW ====================
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const onLeave = () => setVisible(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, []);
  return (
    <div
      className="cursor-glow hidden lg:block"
      style={{ left: pos.x, top: pos.y, opacity: visible ? 1 : 0 }}
    />
  );
};

// ==================== PARTICLES ====================
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1
      });
    }
    let anim: number;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });
      anim = requestAnimationFrame(loop);
    };
    loop();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
};

// ==================== MAGNETIC BUTTON ====================
const MagneticButton = ({ children, className = '', onClick, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={() => sound.hover()}
      onClick={(e: any) => { sound.tick(); onClick?.(e); }}
      className={`magnetic-btn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ==================== TILT CARD ====================
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -10);
    setRotateY((x - 0.5) * 10);
  };
  const handleLeave = () => { setRotateX(0); setRotateY(0); };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={() => sound.hover()}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`tilt-card ${className}`}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

// ==================== SPOTLIGHT WRAPPER ====================
const Spotlight = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={handleMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
};

// ==================== TYPING EFFECT ====================
const TypingEffect = ({ texts, speed = 80 }: { texts: string[]; speed?: number }) => {
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
          setTimeout(() => setIsDeleting(true), 2500);
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
    <span className="text-gradient font-bold">
      {displayText}<span className="animate-pulse">|</span>
    </span>
  );
};

// ==================== MARQUEE ====================
const Marquee = ({ items }: { items: string[] }) => (
  <div className="overflow-hidden whitespace-nowrap py-4 border-y border-white/5">
    <div className="animate-marquee inline-flex gap-12">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="text-sm font-medium text-slate-400 dark:text-slate-500 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> {item}
        </span>
      ))}
    </div>
  </div>
);

// ==================== SECTION WRAPPER ====================
const Section = ({ children, id, className = '' }: { children: React.ReactNode; id: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  useEffect(() => { if (isInView) sound.whoosh(); }, [isInView]);
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
};

// ==================== SKILL CARD ====================
const SkillCard = ({ icon: Icon, title, items, index }: { icon: any; title: string; items: string[]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard>
        <div className="glass rounded-2xl p-6 h-full group hover:glow-indigo transition-all duration-500">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/40 group-hover:to-purple-500/40 transition-all duration-500">
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
                transition={{ delay: index * 0.12 + i * 0.04 }}
                className="px-3 py-1.5 text-xs font-medium rounded-full glass border border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 cursor-default"
                onMouseEnter={() => sound.tick()}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// ==================== PROJECT CARD ====================
const ProjectCard = ({ title, description, tags, demo, source, index, gradient }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => { setIsHovered(true); sound.hover(); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltCard className="h-full">
        <div className="glass rounded-2xl overflow-hidden h-full group hover:glow-purple transition-all duration-700">
          <div className={`h-52 ${gradient} relative overflow-hidden`}>
            <motion.div animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 0.6 }} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed text-sm">{description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <MagneticButton
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                onClick={() => window.open(demo, '_blank')}
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </MagneticButton>
              <MagneticButton
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/10 transition-colors"
                onClick={() => window.open(source, '_blank')}
              >
                <Code2 className="w-4 h-4" /> Source
              </MagneticButton>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// ==================== TIMELINE ITEM ====================
const TimelineItem = ({ role, company, period, description, skills, index }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isLast = index === 1;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50" />
      {!isLast && <div className="absolute left-[7px] top-4 w-[2px] h-full bg-gradient-to-b from-indigo-500/50 to-transparent" />}
      <div className="glass rounded-2xl p-6 ml-4 hover:glow-indigo transition-all duration-500">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{role}</h3>
          <span className="px-2.5 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 font-medium">@ {company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <Calendar className="w-4 h-4" /><span>{period}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string) => (
            <span key={skill} className="px-3 py-1 text-xs rounded-full glass text-slate-500 dark:text-slate-400">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== STAT COUNTER ====================
const StatCounter = ({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); sound.chime(); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient">{count}{suffix}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{label}</div>
    </motion.div>
  );
};

// ==================== NAVIGATION ====================
const Navigation = ({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [soundEnabled, setSoundEnabled] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 180) { setActiveSection(section); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    sound.tick();
  };
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="absolute inset-0 glass-strong border-b border-white/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <motion.a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
          whileHover={{ scale: 1.05 }} className="text-2xl font-bold z-10"
        >
          <span className="text-gradient">Ravi</span>
          <span className="text-slate-700 dark:text-white">.dev</span>
        </motion.a>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a key={link.href} href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              onMouseEnter={() => sound.tick()}
              whileHover={{ y: -2 }}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                activeSection === link.href.slice(1)
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400 hover:bg-white/5'
              }`}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-2 z-10">
          <MagneticButton
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleSound}
            className="p-2.5 rounded-xl glass text-slate-500 dark:text-slate-400 hover:text-indigo-400 transition-colors hidden sm:flex"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </MagneticButton>
          <MagneticButton
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass text-slate-500 dark:text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <AnimatePresence mode="wait">
              {theme === 'light'
                ? <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Moon className="w-4 h-4" /></motion.div>
                : <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sun className="w-4 h-4 text-yellow-400" /></motion.div>
              }
            </AnimatePresence>
          </MagneticButton>
          <MagneticButton
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('#contact')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
          >
            <Sparkles className="w-4 h-4" /> Hire Me
          </MagneticButton>
          <MagneticButton whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2.5 rounded-xl glass">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </MagneticButton>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass-strong rounded-2xl p-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a key={link.href} href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ==================== MAIN APP ====================
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const skills = {
    frontend: { icon: Code2, title: 'Frontend Engineering', items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'] },
    ai: { icon: Bot, title: 'AI Integration', items: ['OpenAI API', 'Ollama Local', 'LM Studio', 'REST APIs', 'LangChain', 'Vector DBs', 'AI Agents'] },
    tools: { icon: Terminal, title: 'DevOps & Tools', items: ['Git', 'Docker', 'VS Code', 'Cursor', 'Vite', 'CI/CD', 'Linux'] },
    design: { icon: Palette, title: 'Design & Creative', items: ['Figma', 'UI/UX Design', 'Motion Design', 'Game Arts', 'Blender', 'Photoshop'] },
  };

  const projects = [
    { title: 'Entropic Reality', description: 'An immersive interactive 3D/Visual experience bridging creative coding and web mechanics. Features advanced WebGL shaders and real-time particle systems.', tags: ['JavaScript', 'Canvas', 'WebGL', 'Three.js', 'GLSL'], demo: 'https://ravisairockey.github.io/entropic-reality/', source: 'https://github.com/ravisairockey/entropic-reality', gradient: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700' },
    { title: 'Stop Tutorial Hell', description: 'Interactive learning platform engineered to break the cycle of passive consumption. Features adaptive quizzes and progress tracking.', tags: ['TypeScript', 'React', 'Educational', 'Interactive'], demo: 'https://ravisairockey.github.io/stop-tutorial-hell/', source: 'https://github.com/ravisairockey/stop-tutorial-hell', gradient: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600' },
    { title: 'AI Warfare Intel', description: 'Advanced data visualization dashboard utilizing AI APIs for real-time strategic analysis. Features interactive charts and AI-powered insights.', tags: ['AI APIs', 'Data Viz', 'JavaScript', 'HTML/CSS'], demo: 'https://ravisairockey.github.io/ai-modern-warfare-intelligence/', source: 'https://github.com/ravisairockey/ai-modern-warfare-intelligence', gradient: 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500' },
  ];

  const experiences = [
    { role: 'Frontend Engineer + AI Integrator', company: 'Freelance', period: '2021 - Present', description: 'Building intelligent, enterprise-ready interfaces with modern web technologies and AI integration. Specializing in React ecosystems and local AI model deployment.', skills: ['React', 'TypeScript', 'AI Integration', 'UI/UX'] },
    { role: 'Game Designer', company: 'Creative Studios', period: '2019 - 2021', description: 'Designed and developed game mechanics and visual experiences. Transitioned skills to web development, bringing unique perspective to interactive UIs.', skills: ['Game Design', 'Unity', 'Blender', 'Player Experience'] },
  ];

  const techMarquee = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'AI Integration', 'Local LLMs', 'Ollama', 'Docker', 'Figma', 'WebGL'];

  return (
    <div className={`min-h-screen transition-colors duration-700 noise-overlay ${theme === 'dark' ? 'bg-[#06060a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <CursorGlow />
      <Particles />

      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 z-[100] origin-left" style={{ scaleX }} />

      <Navigation theme={theme} toggleTheme={toggleTheme} />

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for hire
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight"
          >
            <span className="text-slate-800 dark:text-white">Hi, I'm </span>
            <br className="sm:hidden" />
            <span className="text-gradient">Ravi Sai</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-4xl font-semibold mb-8 h-14 flex items-center justify-center"
          >
            <TypingEffect texts={['Frontend Engineer', 'AI Integrator', 'UI/UX Designer', 'Creative Developer']} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Building intelligent, enterprise-ready interfaces with modern web technologies and AI integration.
            3+ years of crafting digital experiences.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <MagneticButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-200 text-white font-semibold shadow-xl shadow-indigo-500/25"
            >
              View My Work <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass font-semibold text-slate-700 dark:text-white hover:bg-white/10 transition-colors"
            >
              Get In Touch
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] font-medium">Scroll</span>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <Marquee items={techMarquee} />

      {/* ABOUT */}
      <Section id="about">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">About</span>{' '}
              <span className="text-gradient">Me</span>
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <TiltCard>
                <div className="glass rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                  <div className="relative z-10">
                    <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-1">
                      <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-6xl font-bold text-gradient">RS</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
                      <MapPin className="w-4 h-4" /><span>Karnataka, India</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <Spotlight>
                <div className="glass rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Building the Future of Web Interfaces</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    I'm a <span className="text-indigo-400 font-semibold">Frontend Engineer + AI Integrator</span> with a unique background in Game Arts (BA).
                    This combination gives me a rare blend of <span className="text-purple-400 font-semibold">design thinking</span> and
                    <span className="text-cyan-400 font-semibold"> technical execution</span>.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    I specialize in setting up <span className="font-semibold">local AI environments</span> with Ollama and LM Studio,
                    creating seamless REST API integrations, and building beautiful, highly interactive user interfaces.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['React', 'TypeScript', 'Next.js', 'AI Integration', 'UI/UX', 'Local LLMs'].map(tag => (
                      <span key={tag} className="px-4 py-1.5 text-sm rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </Spotlight>
              <div className="grid grid-cols-3 gap-4">
                <StatCounter value={3} suffix="+" label="Years Exp." />
                <StatCounter value={15} suffix="+" label="Projects" />
                <StatCounter value={100} suffix="%" label="Remote OK" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Technical</span>{' '}
              <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">A comprehensive toolkit spanning frontend development, AI integration, and creative design</p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(skills).map((skill, index) => (
              <SkillCard key={skill.title} {...skill} index={index} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <Spotlight>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" /> Specializations
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Bot, title: 'Local AI Setup', desc: 'Ollama, LM Studio, REST APIs for local LLM integration' },
                    { icon: Layers, title: 'Workflow Automation', desc: 'Building efficient development workflows with modern tools' },
                    { icon: Globe, title: 'Cursor/OpenCode', desc: 'Expert in AI-assisted coding environments and agents' },
                  ].map((spec, i) => (
                    <motion.div key={spec.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="text-center p-6 rounded-2xl glass hover:glow-cyan transition-all duration-500 group"
                    >
                      <spec.icon className="w-10 h-10 mx-auto mb-4 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                      <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{spec.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{spec.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Spotlight>
          </motion.div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Featured</span>{' '}
              <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">A showcase of immersive web experiences blending creativity with technical excellence</p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16">
            <MagneticButton
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://github.com/ravisairockey', '_blank')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass font-semibold text-slate-700 dark:text-white hover:bg-white/10 transition-colors"
            >
              <Code2 className="w-5 h-5" /> View More on GitHub <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </motion.div>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Work</span>{' '}
              <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">From Game Design to Frontend Engineering - my journey through creative and technical domains</p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </div>
          <div className="relative">
            {experiences.map((exp, index) => (
              <TimelineItem key={exp.company} {...exp} index={index} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <Spotlight>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-indigo-400" /> Education
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">BA in Game Arts</h4>
                      <p className="text-slate-500 dark:text-slate-400">Communication Design</p>
                    </div>
                    <span className="text-sm text-slate-500">2019 - 2021</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">This unique background in game development informs my approach to building highly interactive, engaging user interfaces with robust architecture.</p>
                </div>
              </div>
            </Spotlight>
          </motion.div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-slate-800 dark:text-white">Let's</span>{' '}
              <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Open to Frontend Engineer roles with AI integration opportunities. Let's build the future.</p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <Spotlight>
                <div className="glass rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <a href="mailto:ravi@vigneswara.dev" onMouseEnter={() => sound.hover()}
                      className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-indigo-500/10 transition-colors group"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/40 group-hover:to-purple-500/40 transition-all">
                        <Mail className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-800 dark:text-white">ravi@vigneswara.dev</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="p-3 rounded-xl bg-green-500/20">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Status</p>
                        <p className="font-medium text-green-400">Available for hire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Spotlight>
              <div className="flex justify-center gap-4">
                {[
                  { icon: Code2, href: 'https://github.com/ravisairockey', label: 'GitHub' },
                  { icon: Globe, href: 'https://www.linkedin.com/in/ravi-sai-vigneswara-113894191/', label: 'LinkedIn' },
                  { icon: Play, href: 'https://www.youtube.com/channel/UC9DQDyzVNUKGhMwNZ-mJg7Q', label: 'YouTube' },
                ].map((social) => (
                  <MagneticButton key={social.label}
                    whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(social.href, '_blank')}
                    className="p-4 rounded-2xl glass hover:glow-indigo transition-all duration-500"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6 text-slate-600 dark:text-slate-300 hover:text-indigo-400 transition-colors" />
                  </MagneticButton>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Spotlight>
                <div className="glass rounded-2xl p-8">
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); sound.chime(); }}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                      <textarea rows={4} className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-slate-800 dark:text-white placeholder:text-slate-400" placeholder="Your message..." />
                    </div>
                    <MagneticButton
                      type="submit"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-200 text-white font-semibold shadow-lg shadow-indigo-500/25"
                    >
                      <Send className="w-5 h-5" /> Send Message
                    </MagneticButton>
                  </form>
                </div>
              </Spotlight>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="relative py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-2xl font-bold">
              <span className="text-gradient">Ravi</span>
              <span className="text-slate-800 dark:text-white">.dev</span>
            </span>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Building the future, one pixel at a time.</p>
            <p className="mt-2 text-sm text-slate-500">&copy; {new Date().getFullYear()} Ravi Sai Vigneswara. Crafted with passion.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
