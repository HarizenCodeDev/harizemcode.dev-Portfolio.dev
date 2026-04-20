'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Components
function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section id={id} className={`section container ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
      {children}
    </motion.section>
  );
}

function SectionHeader({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <motion.div className="section-center" variants={fadeInUp}>
      <motion.span className="section-label" variants={fadeInUp}>
        <motion.span className="section-label-icon" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>✦</motion.span>
        {label}
      </motion.span>
      <motion.h2 className="section-title" variants={fadeInUp}>{title}</motion.h2>
      {desc && <motion.p className="section-desc" variants={fadeInUp}>{desc}</motion.p>}
    </motion.div>
  );
}

function Button({ children, href, primary = false, className = '' }: { children: React.ReactNode; href: string; primary?: boolean; className?: string }) {
  return (
    <a href={href} className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${className}`}>
      {children}
    </a>
  );
}

function Terminal({ terminal }: { terminal: typeof portfolioData.terminal }) {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const t1 = setTimeout(() => setLines(prev => [...prev, 'whoami']), 500);
    const t2 = setTimeout(() => setLines(prev => [...prev, 'stack']), 1200);
    const t3 = setTimeout(() => setLines(prev => [...prev, 'focus']), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div className="terminal" variants={fadeInUp}>
      <div className="terminal-header">
        <div className="terminal-btn terminal-btn-red" />
        <div className="terminal-btn terminal-btn-yellow" />
        <div className="terminal-btn terminal-btn-green" />
        <span className="terminal-title">{terminal.user}@{terminal.hostname}</span>
      </div>
      <div className="terminal-body">
        {lines.includes('whoami') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="terminal-line">
            <span className="terminal-prompt">$ </span>whoami<br />
            <span className="terminal-output">{terminal.whoami}</span>
          </motion.div>
        )}
        {lines.includes('stack') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="terminal-line">
            <span className="terminal-prompt">$ </span>cat stack.txt<br />
            <span className="terminal-output">{terminal.stack.join(' • ')}</span>
          </motion.div>
        )}
        {lines.includes('focus') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="terminal-line">
            <span className="terminal-prompt">$ </span>echo "$FOCUS"<br />
            <span className="terminal-output" style={{ color: 'var(--highlight)' }}>{terminal.focus}</span>
          </motion.div>
        )}
        <motion.span className="terminal-prompt">$ </motion.span>
        <span className="terminal-cursor" />
      </div>
    </motion.div>
  );
}

function SkillCard({ icon, title, items, delay }: { icon: string; title: string; items: string[]; delay: number }) {
  return (
    <motion.div className="skill-card" variants={fadeInUp} custom={delay}>
      <div className="skill-header">
        <span className="skill-icon">{icon}</span>
        <h3 className="skill-title">{title}</h3>
      </div>
      <div className="skill-tags">
        {items.map((item) => (
          <motion.span key={item} className="skill-tag" whileHover={{ scale: 1.05, y: -2 }}>
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectCard({ title, description, techStack, github, delay }: { title: string; description: string; techStack: string[]; github: string; delay: number }) {
  return (
    <motion.div className="project-card" variants={fadeInUp} custom={delay} whileHover={{ y: -8 }}>
      <div className="project-image">
        <div className="project-image-placeholder">💻</div>
        <div className="project-overlay">
          <div className="project-links">
            <a href={github} target="_blank" rel="noreferrer" className="project-link-btn">View Code</a>
          </div>
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tech">
          {techStack?.map((tech) => (
            <span key={tech} className="project-tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedProject({ project }: { project: typeof portfolioData.featuredProject }) {
  return (
    <motion.div className="featured-project" variants={fadeInUp}>
      <div className="featured-grid">
        <div className="featured-image">
          <div className="featured-image-icon">🛒</div>
        </div>
        <div className="featured-content">
          <span className="featured-label">★ Featured Project</span>
          <h3 className="featured-title">{project.title}</h3>
          <p className="featured-desc">{project.description}</p>
          <div className="featured-details">
            <div className="featured-detail">
              <h4 className="featured-detail-title">Problem</h4>
              <p className="featured-detail-text">{project.problem}</p>
            </div>
            <div className="featured-detail">
              <h4 className="featured-detail-title">Solution</h4>
              <p className="featured-detail-text">{project.solution}</p>
            </div>
            <div className="featured-detail">
              <h4 className="featured-detail-title">Result</h4>
              <p className="featured-result">{project.result}</p>
            </div>
          </div>
          <div className="featured-tech-stack">
            {project.techStack?.map((tech) => (
              <span key={tech} className="featured-tech-badge">{tech}</span>
            ))}
          </div>
          <div className="featured-buttons">
            <Button href={project.liveDemo} primary>Live Demo</Button>
            <Button href={project.github}>GitHub</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ name, role, feedback, rating, delay }: { name: string; role: string; feedback: string; rating: number; delay: number }) {
  return (
    <motion.div className="testimonial-card" variants={fadeInUp} custom={delay}>
      <div className="testimonial-corner" />
      <div className="testimonial-header">
        <div className="testimonial-avatar">{name.charAt(0)}</div>
        <div className="testimonial-meta">
          <h4>{name}</h4>
          <span>{role}</span>
        </div>
      </div>
      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="testimonial-star">★</span>
        ))}
      </div>
      <p className="testimonial-text">"{feedback}"</p>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <motion.div className="stat-card" variants={scaleIn}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

function Nav({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];
  const navIds = ['home', 'about', 'skills', 'projects', 'contact'];
  
  return (
    <motion.nav className="nav" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
      <button onClick={() => onNavigate('home')} className="nav-brand text-gradient">HariDevex</button>
      <div className="nav-links">
        {navItems.map((item, i) => (
          <button key={item} onClick={() => onNavigate(navIds[i])} className={`nav-link ${activeSection === navIds[i] ? 'active' : ''}`}>
            {item}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'featured', 'projects', 'testimonials', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { hero, summary, skills, featuredProject, projects, testimonials, contact, stats, terminal } = portfolioData;

  return (
    <div className="page">
      <div className="grid-bg">
        <div className="grid-bg-pattern" />
      </div>
      
      <ScrollProgress />
      <Nav activeSection={activeSection} onNavigate={scrollTo} />
      
      <section id="home" className="hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        
        <motion.div className="hero-content" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="hero-badge" variants={scaleIn}>
            <span className="hero-badge-dot" />
            Available for Work
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeInUp}>
            <span className="text-gradient">{hero.heading}</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeInUp}>
            {hero.subtext}
          </motion.p>

          <motion.div className="flex-gap-4 flex-center" variants={fadeInUp}>
            <Button href="#projects" primary><span className="btn-icon">🚀</span> View Projects</Button>
            <Button href={contact.github}><span className="btn-icon">🖥️</span> GitHub</Button>
          </motion.div>
        </motion.div>

        <motion.div className="scroll-indicator" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} onClick={() => scrollTo('about')}>
          <div className="scroll-mouse" />
        </motion.div>
      </section>

      <Section id="about">
        <SectionHeader label="About" title="About Me" />
        <motion.div className="about-card" variants={fadeInUp}>
          <p className="about-text">{summary}</p>
        </motion.div>
      </Section>

      <Section id="terminal" className="section">
        <Terminal terminal={terminal} />
      </Section>

      <Section id="skills">
        <SectionHeader label="Expertise" title="Skills & Technologies" />
        <div className="grid-3">
          <SkillCard icon="🎨" title="Frontend" items={skills.frontend} delay={0} />
          <SkillCard icon="🗄️" title="Backend" items={skills.backend} delay={1} />
          <SkillCard icon="🔧" title="Tools" items={skills.tools} delay={2} />
        </div>
      </Section>

      <Section id="proof">
        <SectionHeader label="Proof of Skill" title="Developer Stats" />
        <div className="grid-3">
          <StatCard icon="🚀" value={`${stats.projectsBuilt}+`} label="Projects Built" />
          <StatCard icon="⚛️" value={`${stats.technologiesUsed}+`} label="Technologies" />
          <StatCard icon="💼" value={stats.yearsExperience} label="Years Experience" />
        </div>
      </Section>

      <Section id="featured">
        <SectionHeader label="Highlight" title="Featured Project" />
        <FeaturedProject project={featuredProject} />
      </Section>

      <Section id="projects">
        <SectionHeader label="Work" title="Projects" />
        <div className="grid-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} delay={i} />
          ))}
        </div>
      </Section>

      <Section id="testimonials">
        <SectionHeader label="Reviews" title="Testimonials" desc="What people say about my work" />
        <div className="grid-3">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} {...testimonial} delay={i * 0.2} />
          ))}
        </div>
      </Section>

      <Section id="contact">
        <SectionHeader label="Connect" title="Let's Work Together" />
        <div className="contact-section">
          <motion.h2 className="contact-title" variants={fadeInUp}>Let's build something great</motion.h2>
          <motion.p className="contact-subtitle" variants={fadeInUp}>
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </motion.p>
          <motion.div className="flex-gap-4 flex-center" variants={fadeInUp}>
            <Button href={`mailto:${contact.email}`} primary><span className="btn-icon">✉️</span> Email Me</Button>
            <Button href={contact.github}><span className="btn-icon">🖥️</span> GitHub</Button>
            <Button href={contact.linkedin}><span className="btn-icon">💼</span> LinkedIn</Button>
          </motion.div>
        </div>
      </Section>

      <footer className="footer">
        <div className="footer-socials">
          <a href={contact.github} className="footer-social">🖥️</a>
          <a href={contact.linkedin} className="footer-social">💼</a>
          <a href={`mailto:${contact.email}`} className="footer-social">✉️</a>
        </div>
        <p className="footer-text">
          Designed & Built by <a href={contact.github}>HariDevex</a> · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}