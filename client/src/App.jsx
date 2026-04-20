import { useEffect, useState, useRef } from 'react';
import { mockPortfolio } from './mockData';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const HEADER_OFFSET = 80;

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Section = ({ id, children, className = '' }) => (
  <motion.section
    id={id}
    className={`section ${className}`}
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
      <motion.span className="section-label-icon" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>✦</motion.span>
      {' '}{label}
    </motion.span>
    <motion.h2 className="section-title" variants={fadeInUp}>{title}</motion.h2>
    {desc && <motion.p className="section-desc" variants={fadeInUp}>{desc}</motion.p>}
  </motion.div>
);

const Button = ({ children, href, primary = false, className = '', onClick }) => {
  const handleClick = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href.substring(1));
    }
    onClick?.(e);
  };

  return (
    <a href={href} onClick={handleClick} className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${className}`}>
      {children}
    </a>
  );
};

const SkillCard = ({ icon, title, items, delay }) => (
  <motion.div className="skill-category" variants={fadeInUp} custom={delay}>
    <div className="skill-header">
      <span className="skill-icon">{icon}</span>
      <h3 className="skill-title">{title}</h3>
    </div>
    <div className="skill-tags">
      {items.map((item) => (
        <motion.span key={item} className="skill-tag" whileHover={{ scale: 1.05, y: -3 }}>
          {item}
        </motion.span>
      ))}
    </div>
  </motion.div>
);

const ProjectCard = ({ title, description, techStack, image, github, delay }) => (
  <motion.div className="project-card" variants={fadeInUp} custom={delay} whileHover={{ y: -12 }}>
    <div className="project-image">
      {image && <img src={image} alt={title} loading="lazy" />}
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

const FeaturedProject = ({ project }) => (
  <motion.div className="featured-project" variants={fadeInUp}>
    <div className="featured-grid">
      <div className="featured-image">
        {project.image && <img src={project.image} alt={project.title} />}
        <div className="featured-image-overlay" />
      </div>
      <div className="featured-content">
        <span className="featured-label">Featured Project</span>
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
            <h4 className="featured-detail-title">Tech Stack</h4>
            <div className="featured-tech-stack">
              {project.techStack?.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="featured-buttons">
          <Button href={project.liveDemo} primary>Live Demo</Button>
          <Button href={project.github}>GitHub</Button>
        </div>
      </div>
    </div>
  </motion.div>
);

const TestimonialCard = ({ name, role, feedback, rating, delay }) => (
  <motion.div className="testimonial-card" variants={fadeInUp} custom={delay} whileHover={{ y: -8 }}>
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

const Terminal = ({ terminal }) => (
  <motion.div className="terminal" variants={fadeInUp}>
    <div className="terminal-header">
      <div className="terminal-btn terminal-btn-red" />
      <div className="terminal-btn terminal-btn-yellow" />
      <div className="terminal-btn terminal-btn-green" />
      <span className="terminal-title">{terminal.user}@{terminal.hostname}</span>
    </div>
    <div className="terminal-body">
      <div className="terminal-line">
        <span className="terminal-prompt">$ </span><span className="terminal-command">whoami</span>
        <div className="terminal-output">{terminal.whoami}</div>
      </div>
      <div className="terminal-line">
        <span className="terminal-prompt">$ </span><span className="terminal-command">cat stack.txt</span>
        <div className="terminal-output">
          {terminal.stack.map((cat) => (
            <div key={cat.category} className="terminal-output-item">
              <span className="terminal-category">{cat.category}:</span> [{cat.items.join(', ')}]
            </div>
          ))}
        </div>
      </div>
      <div className="terminal-line">
        <span className="terminal-prompt">$ </span><span className="terminal-command">echo "Ready to build 🚀"</span>
        <div className="terminal-output"><span style={{ color: '#00FF9C' }}>"Ready to build 🚀"</span></div>
      </div>
      <div className="terminal-line">
        <span className="terminal-prompt">$ </span><span className="terminal-cursor" />
      </div>
    </div>
  </motion.div>
);

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          className="back-to-top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const MobileMenu = ({ isOpen, onClose, navItems, navIds, activeSection }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.nav className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
          <div className="mobile-menu-header">
            <span className="brand-text">Menu</span>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="mobile-nav-links">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${navIds[i]}`}
                className={activeSection === navIds[i] ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection(navIds[i]); onClose(); }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
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

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'terminal', 'skills', 'featured', 'projects', 'testimonials', 'contact'];
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

  const { hero, summary, skills, testimonials, featuredProject, projects, contact, terminal } = mockPortfolio;

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Testimonials', 'Contact'];
  const navIds = ['home', 'about', 'terminal', 'skills', 'featured', 'testimonials', 'contact'];

  return (
    <div className="page">
      <ScrollProgress />
      <BackToTop />

      <motion.nav className="nav" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <img src="/img/haridevx.png" alt="Logo" className="brand-logo" />
          <span className="brand-text">Mr. Hariharan</span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${navIds[navItems.indexOf(item)]}`}
              className={activeSection === navIds[navItems.indexOf(item)] ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection(navIds[navItems.indexOf(item)]); }}
            >
              {item}
            </a>
          ))}
        </div>

        <button className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span /><span /><span />
        </button>
      </motion.nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} navItems={navItems} navIds={navIds} activeSection={activeSection} />

      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <motion.div className="hero-content" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="hero-badge" variants={fadeInUp}>
            <span className="hero-badge-dot" />
            Available for Work
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeInUp}>
            <span className="hero-title-text">{hero.heading}</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeInUp}>
            {hero.subtext}
          </motion.p>

          <motion.div className="hero-cta" variants={fadeInUp}>
            <Button href="#projects" primary><span className="btn-icon">🚀</span> View Projects</Button>
            <Button href={contact.github}><span className="btn-icon">🖥️</span> GitHub</Button>
          </motion.div>
        </motion.div>

        <motion.div className="scroll-indicator" animate={{ y: [0, 15, 0] }} transition={{ duration: 1.5, repeat: Infinity }} onClick={() => scrollToSection('about')}>
          <div className="scroll-mouse" />
        </motion.div>
      </section>

      <Section id="about">
        <SectionHeader label="About" title="About Me" desc="Frontend developer building modern web applications" />
        <motion.div className="about-card" variants={fadeInUp}>
          <p className="about-text">{summary}</p>
        </motion.div>
      </Section>

      <Section id="terminal">
        <Terminal terminal={terminal} />
      </Section>

      <Section id="skills">
        <SectionHeader label="Expertise" title="Skills & Technologies" desc="Tools and technologies I work with" />
        <div className="skills-grid">
          <SkillCard icon="🎨" title="Frontend" items={skills.frontend} delay={0} />
          <SkillCard icon="🗄️" title="Database" items={skills.backend} delay={1} />
          <SkillCard icon="🔧" title="Tools" items={skills.tools} delay={2} />
        </div>
      </Section>

      <Section id="featured">
        <SectionHeader label="Highlight" title="Featured Project" desc="A showcase of my best work" />
        <FeaturedProject project={featuredProject} />
      </Section>

      <Section id="projects">
        <SectionHeader label="Work" title="Projects" desc="Things I've built and shipped" />
        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} delay={i} />
          ))}
        </div>
      </Section>

      <Section id="testimonials">
        <SectionHeader label="Reviews" title="Testimonials" desc="What people say about my work" />
        <div className="testimonials-grid">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} {...testimonial} delay={i * 0.2} />
          ))}
        </div>
      </Section>

      <Section id="contact">
        <SectionHeader label="Connect" title="Let's Work Together" desc="Feel free to reach out" />
        <motion.div className="contact-section" variants={staggerContainer}>
          <motion.h2 className="contact-title" variants={fadeInUp}>Let's build something great</motion.h2>
          <motion.p className="contact-subtitle" variants={fadeInUp}>
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </motion.p>
          <motion.div className="contact-buttons" variants={fadeInUp}>
            <Button href={`mailto:${contact.email}`} primary><span className="btn-icon">✉️</span> Email Me</Button>
            <Button href={contact.github}><span className="btn-icon">🖥️</span> GitHub</Button>
            <Button href={contact.linkedin}><span className="btn-icon">💼</span> LinkedIn</Button>
          </motion.div>
        </motion.div>
      </Section>

      <footer className="footer">
        <div className="footer-socials">
          <a href={contact.github} className="footer-social">🖥️</a>
          <a href={contact.linkedin} className="footer-social">💼</a>
          <a href={contact.email} className="footer-social">✉️</a>
        </div>
        <p className="footer-text">
          Designed & Built by <a href={contact.github}>Mr. Hariharan</a> · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}