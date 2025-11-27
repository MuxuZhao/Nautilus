import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { storiesData } from './data/stories-loader';




// ==================== Main App ====================
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedStory, setSelectedStory] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [spiralRotation, setSpiralRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      
      // Nautilus spiral rotation based on scroll
      setSpiralRotation(scrolled * 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openStory = (story) => {
    setSelectedStory(story);
    setCurrentView('story');
    window.scrollTo(0, 0);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <button 
            onClick={() => { setCurrentView('home'); setSelectedStory(null); }}
            className="nav-logo"
          >
            {/* Nautilus spiral icon */}
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 100 100" 
              className="nautilus-icon"
              style={{ transform: `rotate(${spiralRotation % 360}deg)` }}
            >
              <path
                d="M 50 50 Q 50 30, 70 30 Q 90 30, 90 50 Q 90 80, 60 80 Q 20 80, 20 40 Q 20 10, 50 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>
            <span className="nav-title">NAUTILUS</span>
          </button>
          
          <div className="nav-links">
            <button 
              onClick={() => setCurrentView('home')}
              className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            >
              STORIES
            </button>
            <button 
              onClick={() => setCurrentView('about')}
              className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
            >
              ABOUT
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Pages */}
      {currentView === 'home' && <HomePage stories={storiesData} onStoryClick={openStory} />}
      {currentView === 'about' && <AboutPage />}
      {currentView === 'story' && selectedStory && <StoryView story={selectedStory} onClose={closeStory} />}
    </div>
  );
}


// ==================== Home Page ====================
function HomePage({ stories, onStoryClick }) {
  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        {/* Animated water ripples */}
        <div className="ripples">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="ripple"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                animationDelay: `${i * 0.6}s`
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            I found <br/> something <br/>
          </h1>
          <p className="hero-subtitle">
            inside a nautilus shell<br/>
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="stories-section">
        <div className="stories-grid">
          {stories.map((story, index) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              index={index}
              onClick={() => onStoryClick(story)}
            />
          ))}
        </div>

        {stories.length === 0 && (
          <div className="empty-state">
            <svg width="120" height="120" viewBox="0 0 100 100" className="empty-icon">
              <path
                d="M 50 50 Q 50 20, 80 20 Q 100 20, 100 50 Q 100 90, 60 90 Q 10 90, 10 40 Q 10 5, 50 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
            <h3 className="empty-title">Stories are forming</h3>
            <p className="empty-text">Like a nautilus building its chambers, one at a time</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Story Card ====================
function StoryCard({ story, index, onClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={cardRef}
      className={`story-card ${isVisible ? 'visible' : ''} ${isEven ? 'even' : 'odd'}`}
    >
      {/* Image */}
      <div 
        className="story-image"
        onClick={onClick}
      >
        <img 
          src={story.coverImage} 
          alt={story.title}
        />
        <div className="story-overlay" />
      </div>

      {/* Text */}
      <div className="story-text">
        <div className="story-type">
          {story.type === 'photos' ? 'PHOTOS' : 
           story.type === 'essay' ? 'ESSAY' : 
           story.type === 'story' ? 'STORY' : 'OTHER'}
        </div>
        <h2 className="story-title">{story.title}</h2>
        <p className="story-excerpt">
          {story.content[0].content.split('\n')[0]}
        </p>
        <button 
          onClick={onClick}
          className="story-button"
        >
          <span>READ MORE</span>
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ==================== Story Reading View ====================
function StoryView({ story, onClose }) {
  return (
    <div className="story-view">
      {/* Back button */}
      <button 
        onClick={onClose}
        className="back-button"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 100 100"
          className="back-icon"
        >
          <path
            d="M 50 50 Q 50 30, 70 30 Q 90 30, 90 50 Q 90 80, 60 80 Q 20 80, 20 40 Q 20 10, 50 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span>BACK</span>
      </button>

      {/* Story title */}
      <div className="story-header">
        <div className="story-type-badge">
          {story.type === 'photos' ? 'PHOTOS' : 
           story.type === 'essay' ? 'ESSAY' : 
           story.type === 'story' ? 'STORY' : 'OTHER'}
        </div>
        <h1 className="story-main-title">{story.title}</h1>
      </div>

      {/* Story content */}
      <div className="story-content">
        {story.content.map((block, index) => (
          <StoryBlock key={index} block={block} index={index} />
        ))}
      </div>

      {/* End mark */}
      <div className="story-end">
        <svg width="100" height="80" viewBox="0 0 100 100" className="end-icon">
          <path
            d="M 50 50 Q 50 30, 70 30 Q 90 30, 90 50 Q 90 80, 60 80 Q 20 80, 20 40 Q 20 10, 50 10"
            fill="none"
            stroke={
              story.type === 'photos' ? '#f59e0b' :
              story.type === 'story' ? '#3b82f6' :
              story.type === 'essay' ? '#10b981' :
              '#a8a29e'
            }
            strokeWidth="1.5"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="2" 
            fill={
              story.type === 'photo-collection' ? '#f59e0b' :
              story.type === 'story' ? '#3b82f6' :
              story.type === 'essay' ? '#10b981' :
              '#a8a29e'
            }
          />
        </svg>
        <button onClick={onClose} className="return-button">   fin.</button>
      </div>
    </div>
  );
}

// ==================== Story Content Block ====================
function StoryBlock({ block, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (block.type === 'text') {
    return (
      <div 
        ref={blockRef}
        className={`content-text ${isVisible ? 'visible' : ''}`}
      >
        <div className="text-content">
          {block.content}
        </div>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div 
        ref={blockRef}
        className={`content-image ${isVisible ? 'visible' : ''}`}
      >
        <div className="image-wrapper">
          <img 
            src={block.src} 
            alt={block.caption}
          />
          {block.caption && (
            <p className="image-caption">{block.caption}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ==================== About Page ====================
function AboutPage() {
  return (
    <div className="about-page">
      {/* introduction */}
      <section className="about-hero">
        <div className="hero-spiral">
          <svg 
            width="300" 
            height="300" 
            viewBox="0 0 100 100" 
            className="large-colorful-spiral"
          >
            <defs>
              <linearGradient id="largeSpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path
              d="M 50 50 Q 50 20, 80 20 Q 100 20, 100 50 Q 100 90, 60 90 Q 10 90, 10 40 Q 10 5, 50 5"
              fill="none"
              stroke="url(#largeSpiralGradient)"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="50" r="3" fill="#44403c" />
          </svg>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Nautilus</h1>
          <div className="golden-text">
            <p>The nautilus shell grows in a logarithmic spiral, closely approximating the golden ratio (φ ≈ 1.618). This mathematical perfection appears throughout nature — in galaxies, in sunflowers, in the way stories unfold.</p>
          </div>
        </div>
      </section>

      {/* 3 Reasons
      <section className="reasons-section">
        <div className="section-container">
          <h2 className="section-title">3 reasons why I love the nautilus:</h2>
          
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-number">1</div>
              <h3>Yorushika</h3>
              <p>That one song that hits different - <a href="https://www.youtube.com/watch?v=zFZ5cO13A6Q" target="_blank" rel="noopener noreferrer">"今天就以这样的速度游下去吧"</a></p>
            </div>
            
            <div className="reason-card">
              <div className="reason-number">2</div>
              <h3>Jules Verne</h3>
              <p>Captain Nemo's <a href="https://en.wikipedia.org/wiki/Nautilus_(Verne)" target="_blank" rel="noopener noreferrer">Nautilus submarine</a> - the coolest fictional vehicle ever</p>
            </div>
            
            <div className="reason-card">
              <div className="reason-number">3</div>
              <h3>Living Fossil</h3>
              <p>Survived 500 million years - <a href="https://en.wikipedia.org/wiki/Nautilus" target="_blank" rel="noopener noreferrer">proof that some designs are timeless</a></p>
            </div>
          </div>

          <div className="bonus-reason">
            <div className="reason-number">+1</div>
            <div className="bonus-content">
              <h3>Math Nerd Bonus</h3>
              <p>That sweet, sweet <a href="https://en.wikipedia.org/wiki/Golden_ratio" target="_blank" rel="noopener noreferrer">golden ratio spiral</a> gets me every time</p>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* bio */}
      <section className="bio-section">
        <div className="section-container">
          <div className="bio-content">
            {/* avatar and basic info */}
            <div className="bio-header">
              <div className="avatar-container">
                <img 
                  src="/images/avatar.jpg" 
                  alt="me!" 
                  className="avatar"
                />
                {/* little nautilus */}
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 100 100" 
                  className="avatar-spiral"
                >
                  <path
                    d="M 50 50 Q 50 30, 70 30 Q 90 30, 90 50 Q 90 80, 60 80 Q 20 80, 20 40 Q 20 10, 50 10"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              
              <div className="bio-basic">
                <h2 className="bio-name"></h2>
                <p className="bio-tagline"> </p>
              </div>
            </div>

            {/* description */}
            <div className="bio-details">
              <div className="bio-text">
                <p> </p>
                <p> Hi! I am currently a student majored in . Another mundane fact about me is that I take photos and write things :D </p>
                <p> Sometimes the photos and words go together, sometimes they don't. You'll find my photography here, along with short stories, essays, and random thoughts about books, anime, movies, or whatever's on my mind.</p>
                <p> When I'm not behind the camera, I'm probably reading novels, playing the flute, cycling around town, binge-watching anime, or cooking something in my kitchen (with varying degrees of success).</p>
                <p> - </p>
                <p> This site is named Nautilus — after the shell that's been growing in spirals for 500 million years, one chamber at a time.</p>
              </div>
              
              {/* 
                <div className="bio-stats">
                  <div className="stat">
                    <span className="stat-number">∞</span>
                    <span className="stat-label">Photos taken</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">φ</span>
                    <span className="stat-label">Golden ratio enthusiast</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">500M+</span>
                    <span className="stat-label">Years of nautilus wisdom</span>
                  </div>
                </div>
              */}
            </div>
            

            {/* contact */}
            <div className="bio-contact">
              <p>Say hello: <a href="mailto:"></a></p>
              <div className="social-links">
                <a href="" className="social-link">Instagram</a>
                <span className="divider">•</span>
                <a href="" className="social-link">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}