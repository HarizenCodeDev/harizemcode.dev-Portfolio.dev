import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { mockPortfolio } from './mockData';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || '';

const HEADER_OFFSET = 80;

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'backOut' } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const wordAnimation = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const FloatingOrb = ({ delay = 0, size = 400, color = 'cyan', position = {} }) => (
  <motion.div
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', filter: 'blur(80px)', ...position }}
    animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 10 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    sx={{
      background: color === 'cyan' ? 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)' :
                 color === 'violet' ? 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)' :
                 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)'
    }}
  />
);

const AnimatedText = ({ text, className }) => {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.3em' }}>
      {words.map((word, i) => (
        <motion.span key={i} variants={wordAnimation} style={{ display: 'inline-block' }}>
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const RippleButton = ({ children, href, className, primary = false }) => {
  const handleClick = (e) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href.substring(1));
    }
  };

  return (
    <a href={href} className={`${className} ripple-btn`} onClick={handleClick}>
      <span className="ripple-effect" />
      {children}
    </a>
  );
};

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => setTransform('');

  return (
    <motion.article
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transform || undefined }}
      transition={{ transform: { duration: 0.1 } }}
    >
      {children}
    </motion.article>
  );
};

const Section = ({ id, children }) => (
  <motion.section
    id={id}
    className="section"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={fadeInUp}
  >
    {children}
  </motion.section>
);

const SectionHeader = ({ label, title, desc }) => (
  <motion.div className="section-header" variants={fadeInUp}>
    <motion.span className="section-label" variants={fadeInUp}>
      <motion.span
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-block' }}
      >
        ✦
      </motion.span>
      {' '}{label}
    </motion.span>
    <motion.h2 className="section-title" variants={fadeInUp}>{title}</motion.h2>
    {desc && <motion.p className="section-desc" variants={fadeInUp}>{desc}</motion.p>}
  </motion.div>
);

const MobileMenu = ({ isOpen, onClose, navItems, navIds, activeSection }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="mobile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.nav
          className="mobile-menu"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <motion.div className="mobile-menu-header">
            <span className="brand-text">Menu</span>
            <button className="close-btn" onClick={onClose}>✕</button>
          </motion.div>
          <div className="mobile-nav-links">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${navIds[i]}`}
                className={activeSection === navIds[i] ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection(navIds[i]); onClose(); }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <span className="nav-arrow">→</span>
              </motion.a>
            ))}
          </div>
        </motion.nav>
      </>
    )}
  </AnimatePresence>
);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  );
};

export default function App() {
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [status, setStatus] = useState('idle');
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        const { data } = await axios.get(`${API_BASE}/api/portfolio`);
        setPortfolio(data);
        setStatus('ready');
      } catch {
        setStatus('offline');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'summary', 'education', 'skills', 'gallery', 'projects', 'contact'];
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

  const { hero, summary, education, skills, skillLogos, gallery, projects, contact } = portfolio;

  const navItems = ['Home', 'About', 'Education', 'Skills', 'Gallery', 'Projects', 'Contact'];
  const navIds = ['home', 'summary', 'education', 'skills', 'gallery', 'projects', 'contact'];

  const groupedSkills = {
    'Design & Frontend': skills.filter(s => s.includes('Web') || s.includes('Figma') || s.includes('Canva') || s.includes('Photoshop')),
    'Programming': skills.filter(s => s.includes('Programming') || s.includes('C++') || s.includes('Python')),
    'Tools & Platforms': skills.filter(s => s.includes('Git') || s.includes('Arduino') || s.includes('Raspberry') || s.includes('Problem') || s.includes('Strong')),
  };

  return (
    <div className="page">
      <ScrollProgress />
      <BackToTop />

      <motion.nav
        className="nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <span className="brand-text">Mr. Hariharan N</span>
        </a>

        <div className="nav-links">
          {navItems.map((item, i) => (
            <a
              key={item}
              href={`#${navIds[i]}`}
              className={activeSection === navIds[i] ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection(navIds[i]); }}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        navIds={navIds}
        activeSection={activeSection}
      />

      <section id="home" className="hero" ref={heroRef}>
        <motion.div className="hero-bg" style={{ scale: heroScale, opacity: heroOpacity }} />
        <div className="hero-overlay" />

        <div className="particles">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
              }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>

        <FloatingOrb delay={0} size={500} color="cyan" position={{ top: '5%', left: '5%' }} />
        <FloatingOrb delay={2} size={600} color="violet" position={{ bottom: '10%', right: '10%' }} />
        <FloatingOrb delay={4} size={400} color="pink" position={{ top: '40%', right: '20%' }} />

        <motion.div className="hero-content" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="hero-badge" variants={scaleIn}>
            <motion.span
              className="hero-badge-dot"
              animate={{ scale: [1, 1.3, 1], boxShadow: ['0 0 10px #10b981', '0 0 25px #10b981', '0 0 10px #10b981'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {status === 'ready' ? 'Connected to API' : 'Available for Hire'}
          </motion.div>

          <motion.p className="hero-tagline" variants={fadeInUp}>{hero.tagline}</motion.p>

          <motion.h1 className="hero-title" variants={fadeInUp}>
            <AnimatedText text="Mr. Hariharan N" className="hero-title-text" />
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeInUp}>
            <AnimatedText text={hero.lines.join(' ')} />
          </motion.p>

          <motion.div className="hero-cta" variants={fadeInUp}>
            <RippleButton href="#projects" className="btn btn-primary" primary>
              <span className="btn-icon">🚀</span>
              View Projects
            </RippleButton>
            <RippleButton href="#contact" className="btn btn-secondary">
              <span className="btn-icon">✨</span>
              Get in Touch
            </RippleButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={() => scrollToSection('summary')}
          style={{ cursor: 'pointer' }}
        >
          <div className="scroll-mouse" />
        </motion.div>
      </section>

      <Section id="summary">
        <SectionHeader label="About" title="Executive Summary" />
        <motion.div className="summary-section" variants={fadeInUp} whileHover={{ scale: 1.01 }}>
          <p className="summary-text">{summary}</p>
        </motion.div>
      </Section>

      <Section id="education">
        <SectionHeader label="Background" title="Education" desc="Academic journey and achievements" />
        <motion.div className="grid-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {education.map((edu, i) => (
            <TiltCard key={edu.degree} className="glow-card" variants={fadeInUp}>
              <div className="glow-card-glow" />
              <div className="glow-card-icon">{['🎓', '📚', '🎯'][i]}</div>
              <h3 className="card-title">{edu.degree}</h3>
              <p className="card-meta">{edu.school}<br />{edu.years}</p>
              <span className="card-score">{edu.score}</span>
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      <Section id="skills">
        <SectionHeader label="Expertise" title="Skills & Technologies" desc="Tools and technologies I work with" />
        <motion.div className="skills-container" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {Object.entries(groupedSkills).filter(([_, v]) => v.length > 0).map(([category, items], catIndex) => (
            <TiltCard key={category} className="skill-category" variants={catIndex % 2 === 0 ? slideInLeft : slideInRight}>
              <h3 className="skill-category-title">
                <span className="skill-icon">{category === 'Design & Frontend' ? '🎨' : category === 'Programming' ? '💻' : '🔧'}</span>
                {category}
              </h3>
              <div className="skill-list">
                {items.map((skill) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    whileHover={{ scale: 1.1, y: -5, borderColor: 'rgba(139, 92, 246, 0.8)', backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </TiltCard>
          ))}
        </motion.div>

        <motion.div className="marquee-container" variants={fadeInUp} whileHover={{ scale: 1.02 }}>
          <div className="marquee-track">
            {[...skillLogos, ...skillLogos].map((logo, idx) => (
              <motion.img
                key={`${logo}-${idx}`}
                src={logo}
                alt="tech"
                className="marquee-item"
                whileHover={{ scale: 1.2, filter: 'brightness(1.3)' }}
              />
            ))}
          </div>
        </motion.div>
      </Section>

      <Section id="gallery">
        <SectionHeader label="Achievements" title="Certificate Gallery" desc="Certifications and accomplishments" />
        <div className="gallery-grid">
          {gallery.slice(0, 12).map((img, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const delay = (row + col) * 0.1;
            return (
              <motion.div
                key={img}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.5, y: 80 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover="hover"
              >
                <div className="gallery-image-container">
                  <motion.img src={img} alt={`Certificate ${i + 1}`} loading="lazy" />
                </div>
                <motion.div className="gallery-overlay" variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }}>
                  <div className="gallery-content">
                    <motion.div className="gallery-icon" animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ rotate: { duration: 20, repeat: Infinity }, scale: { duration: 2, repeat: Infinity } }}>📜</motion.div>
                    <span className="gallery-title">Certificate {i + 1}</span>
                  </div>
                </motion.div>
                <motion.div className="gallery-glow" animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }} />
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section id="projects">
        <SectionHeader label="Work" title="Featured Projects" desc="Things I've built and shipped" />
        <motion.div className="grid-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {projects.map((project, i) => (
            <TiltCard key={project.title} className="glow-card" variants={fadeInUp}>
              <div className="glow-card-glow" />
              <div className="glow-card-icon">{['🌐', '📺', '⚡', '🤖'][i] || '💻'}</div>
              <h3 className="card-title">{project.title}</h3>
              <p className="card-desc">{project.description}</p>
              <motion.div className="project-link" whileHover={{ x: 8, color: 'var(--accent-violet)' }}>
                View Project <span>→</span>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      <Section id="contact">
        <SectionHeader label="Connect" title="Let's Work Together" desc="Feel free to reach out" />
        <motion.div className="contact-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="contact-info" variants={slideInLeft}>
            {[
              { icon: '📧', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
              { icon: '📱', label: 'Phone', value: contact.phone, href: null },
              { icon: '💼', label: 'LinkedIn', value: 'Connect', href: contact.linkedin },
              { icon: '🐙', label: 'GitHub', value: 'Follow', href: contact.github },
              { icon: '🎮', label: 'Discord', value: contact.discord, href: null },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="contact-item"
                whileHover={{ x: 10, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              >
                <motion.div className="contact-icon" whileHover={{ rotate: 360, scale: 1.1 }}>
                  {item.icon}
                </motion.div>
                <div>
                  <p className="contact-label">{item.label}</p>
                  <p className="contact-value">
                    {item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.value}</a> : item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={slideInRight}>
            <motion.div className="contact-info" style={{ marginBottom: '24px' }} whileHover={{ scale: 1.02 }}>
              <motion.p className="card-desc" style={{ fontSize: '18px', marginBottom: '16px' }} animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }}>
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </motion.p>
              <p className="card-desc">Whether you have a question or just want to say hi, feel free to reach out!</p>
            </motion.div>
            <div className="contact-cta">
              <RippleButton href={contact.resume} className="btn btn-secondary" target="_blank">
                📄 Download Resume
              </RippleButton>
              <RippleButton href={`mailto:${contact.email}`} className="btn btn-primary" primary>
                ✉️ Send Message
              </RippleButton>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      <footer className="footer">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Designed & Built by <a href={contact.github}>Mr. Hariharan N</a> · {new Date().getFullYear()}
        </motion.p>
        <motion.div className="footer-socials" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {['🌐', '🐙', '💼'].map((icon, i) => (
            <motion.a key={i} href="#" whileHover={{ scale: 1.3, rotate: 10 }} whileTap={{ scale: 0.9 }}>
              {icon}
            </motion.a>
          ))}
        </motion.div>
      </footer>
    </div>
  );
}
