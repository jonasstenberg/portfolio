import { CSSProperties, useRef } from 'react';

import { ReactComponent as Email } from './assets/email.svg';
import { ReactComponent as Github } from './assets/github.svg';
import { ReactComponent as LinkedIn } from './assets/linkedin.svg';

import { useIntersectionObserver } from './hooks/observer';

export const App = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(elementRef, {});
  const isOnScreen = !!entry?.isIntersecting;

  const main = document.querySelector('main');
  const mainWidthBelowThreshold = main && main.offsetWidth < 600;

  const header = document.querySelector('header');
  const marginTop = header && header?.offsetHeight - 92;

  const introStyles = (
    isOnScreen
      ? {
          position: 'fixed',
          top: '0',
          width: mainWidthBelowThreshold ? main.offsetWidth : '37.5rem',
          marginTop: `${marginTop}px`,
          marginLeft: mainWidthBelowThreshold ? -(main.offsetWidth / 2) : '-18.75rem',
          left: '50%',
        }
      : {
          position: 'relative',
        }
  ) as CSSProperties;

  return (
    <>
      <header>
        <div className='front'>
          <img
            src='/jonas.webp'
            alt='Jonas Stenberg'
            className='front-portrait'
            width='100%'
            height='auto'
          />
          <h1 className='front-hello'>Hello! I'm Jonas from Malmö.</h1>
          <h2 className='front-desc'>
            I work with communication, collaboration, and people, whether it's through{' '}
            <span>leadership</span> or <span>developing software</span>.
          </h2>
        </div>
      </header>
      <div className='sentinal' ref={elementRef}></div>
      <div className='zigzag-container'>
        <div className='zigzag'></div>
      </div>
      <div className='zigzag-og'></div>
      <main
        style={{ height: document.querySelector<HTMLElement>('div.main-wrapper')?.offsetHeight }}
      >
        <div className='main-wrapper' style={introStyles} key='z'>
          <h2>Introduction</h2>
          <h3>My life and work</h3>
          <ul className='life'>
            <li className='life-row'>
              <span className='life-year'>1985</span>
              <span className='life-info'>Hello World</span>
              <span className='life-location'>Kalmar, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2007 - 2010</span>
              <span className='life-info'>Interaction Design student @ Malmö Univerity</span>
              <span className='life-location'>Malmö, Sweden and Berlin, Germany</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2008 - 2009</span>
              <span className='life-info'>Programming tutor @ Malmö University</span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2010 - 2013</span>
              <span className='life-info'>
                Co-founder, developer and interaction designer @ Ixagon AB
              </span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2013 - 2014</span>
              <span className='life-info'>Developer @ Capgemini</span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2014 - 2017</span>
              <span className='life-info'>Tech lead and Developer @ Ductus</span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2017 - 2020</span>
              <span className='life-info'>Developer @ Jayway</span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2020-2022</span>
              <span className='life-info'>Tech lead and hiring manager @ Madefrom</span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
            <li className='life-row'>
              <span className='life-year'>2022 - ∞</span>
              <span className='life-info'>
                Studio Lead / Consultant Manager @ Jayway / Devoteam
              </span>
              <span className='life-location'>Malmö, Sweden</span>
            </li>
          </ul>
          <p className='myself'>
            I am a people focused developer and manager. Driven by making a difference and a desire
            to create a positive impact in the world. Strongly believe that thriving organisations
            come from leading with context and embracing trust, transparency, and co-creation.
          </p>
          <h2>Contact</h2>
          <h3>Say Hello!</h3>
          <ul className='contact'>
            <li>
              <a href='mailto:portfolio@stenberg.io' aria-label='Twitter'>
                <Email />
              </a>
            </li>
            <li>
              <a href='https://github.com/jonasstenberg' aria-label='Github'>
                <Github />
              </a>
            </li>
            <li>
              <a href='https://www.linkedin.com/in/jonasstenberg/' aria-label='LinkedIn'>
                <LinkedIn />
              </a>
            </li>
          </ul>
        </div>
      </main>
      <footer className={isOnScreen ? '' : 'footer-hidden'}>
        <div className='zigzag-inverse'></div>
      </footer>
    </>
  );
};
