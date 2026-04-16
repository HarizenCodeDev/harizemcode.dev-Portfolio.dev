import { useEffect, useState } from 'react';
import axios from 'axios';
import { mockPortfolio } from './mockData';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || '';

const Section = ({ id, title, children, accent = 'var(--cyan)' }) => (
  <motion.section 
    id={id} 
    className="section"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="section__header">
      <motion.span 
        className="accent" 
        style={{ background: accent }}
        initial={{ width: 0 }}
        whileInView={{ width: 36 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
      />
      <h2>{title}</h2>
    </div>
    <div className="section__body">{children}</div>
  </motion.section>
);

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Pill = ({ children }) => (
  <motion.span 
    className="pill" 
    variants={pillVariants}
    whileHover={{ scale: 1.05, y: -2 }}
  >
    {children}
  </motion.span>
);

const Card = ({ children, index }) => (
  <motion.article 
    className="card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)' }}
  >
    {children}
  </motion.article>
);

export default function App() {
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [status, setStatus] = useState('idle');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        const { data } = await axios.get(`${API_BASE}/api/portfolio`);
        setPortfolio(data);
        setStatus('ready');
      } catch (err) {
        console.warn('API unreachable, using bundled data', err);
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
          if (rect.top <= 100 && rect.bottom >= 100) {
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

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  return (
    <div className="page">
      <motion.header 
        className="nav"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="brand">
          <motion.img 
            src={hero.nameLogo} 
            alt="logo" 
            height={42}
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <span>Hariharan N</span>
        </div>
        <nav>
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * navItems.indexOf(item) }}
              whileHover={{ y: -2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      <main>
        <section id="home" className="hero" style={{ backgroundImage: `url(${hero.bannerImage})` }}>
          <div className="hero__overlay" />
          <div className="hero__content">
            <motion.img 
              src={hero.nameLogo} 
              alt="Hariharan" 
              className="hero__logo"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <motion.p 
              className="hero__tag"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {hero.tagline}
            </motion.p>
            {hero.lines.map((line, i) => (
              <motion.p 
                key={line} 
                className="hero__line"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                {line}
              </motion.p>
            ))}
            <motion.div 
              className="hero__status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.span 
                className={`dot ${status === 'ready' ? 'dot--live' : 'dot--offline'}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {status === 'ready' ? 'Live API' : 'Offline sample'}
            </motion.div>
            <motion.a 
              className="primary" 
              href="#projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(59, 209, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.a>
          </div>
        </section>

        <Section id="summary" title="Executive Summary" accent="var(--pink)">
          <motion.p 
            className="lede"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {summary}
          </motion.p>
        </Section>

        <Section id="education" title="Education" accent="var(--amber)">
          <div className="grid two">
            {education.map((edu, i) => (
              <Card key={edu.degree} index={i}>
                <h3>{edu.degree}</h3>
                <p className="muted">{edu.school}</p>
                <p>{edu.years}</p>
                <p className="muted">{edu.score}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills" accent="var(--cyan)">
          <div className="stack">
            <motion.div 
              className="pill-row"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </motion.div>
            <motion.div 
              className="marquee"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="marquee__track">
                {[...skillLogos, ...skillLogos].map((logo, idx) => (
                  <motion.img 
                    key={`${logo}-${idx}`} 
                    src={logo} 
                    alt="logo"
                    whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        <Section id="gallery" title="Gallery" accent="var(--violet)">
          <div className="gallery">
            {gallery.slice(0, 12).map((img, i) => (
              <motion.img 
                key={img} 
                src={img} 
                alt="Certificate" 
                loading="lazy"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10, boxShadow: '0 20px 40px rgba(154, 123, 255, 0.3)' }}
              />
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects" accent="var(--green)">
          <div className="grid two">
            {projects.map((project, i) => (
              <Card key={project.title} index={i}>
                <h3>{project.title}</h3>
                <p className="muted">{project.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact" accent="var(--cyan)">
          <div className="contact">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p><strong>Email</strong> — <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
              <p><strong>Phone</strong> — {contact.phone}</p>
              <p>
                <strong>LinkedIn</strong> — <a href={contact.linkedin} target="_blank" rel="noreferrer">{contact.linkedin}</a>
              </p>
              <p>
                <strong>GitHub</strong> — <a href={contact.github} target="_blank" rel="noreferrer">{contact.github}</a>
              </p>
              <p><strong>Discord</strong> — {contact.discord}</p>
            </motion.div>
            <motion.div 
              className="cta-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.a 
                className="secondary" 
                href={contact.resume} 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
              >
                Download Resume
              </motion.a>
              <motion.a 
                className="primary" 
                href="/api/contact" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(59, 209, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                Ping API
              </motion.a>
            </motion.div>
          </div>
        </Section>
      </main>

      <footer className="footer">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built with MERN · React + Vite front-end · Express API · Ready for MongoDB
        </motion.p>
      </footer>
    </div>
  );
}
