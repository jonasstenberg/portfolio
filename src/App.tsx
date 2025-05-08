import { CSSProperties, useRef, RefObject } from 'react';

import { ReactComponent as ArrowDown } from './assets/arrow-down.svg';
import { ReactComponent as Email } from './assets/email.svg';
import { ReactComponent as Github } from './assets/github.svg';
import { ReactComponent as LinkedIn } from './assets/linkedin.svg';

import { useIntersectionObserver } from './hooks/observer';

export const App = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(elementRef as RefObject<Element>, {});
  const isOnScreen = !!entry?.isIntersecting;

  const main = document.querySelector('main');
  const mainWidthBelowThreshold = main && main.offsetWidth < 600;

  const header = document.querySelector('header');
  const marginTop = header && header?.offsetHeight - 240;

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

  const mainContentRef = useRef<HTMLElement>(null);

  const handleScroll = () => {
    if (mainContentRef.current) {
      const offsetPosition =
        mainContentRef.current.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <button
        onClick={handleScroll}
        className={`arrow-down ${isOnScreen ? '' : 'arrow-hidden'}`}
        aria-label='Scroll down'
      >
        <ArrowDown />
      </button>
      <header>
        <div className='front'>
          <h1 className='front-hello'>Hello! I'm Jonas Stenberg.</h1>
          <h2 className='front-desc'>
            I love <span>solving</span> problems with software, mentoring, and leading teams. In my
            free time I tinker with homelab <span>stuff</span> and improve my Vim config.
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
        ref={mainContentRef}
      >
        <div className='main-wrapper' style={introStyles} key='z'>
          <h2>Introduction</h2>
          <h3>Work and education</h3>
          <ul className='experiences'>
            <li>
              <p>2025 - ∞</p>
              <p>Developer @ Squidler</p>
              <p>Malmö, Sweden</p>
              <p>
                At Squidler, I help build tools that automatically test websites for bugs,
                accessibility issues, and language mistakes. We simulate real user behavior to find
                problems that might otherwise slip through the cracks. We are making quality
                assurance smarter and more approachable. I work on everything from the AI-based
                testing logic to making sure we support WCAG accessibility standards out of the box.
              </p>
            </li>
            <li>
              <p>2022 - 2025</p>
              <p>Consultant Manager & Architect @ Jayway / Devoteam</p>
              <p>Malmö, Sweden</p>
              <p>
                Led a team of 25 professionals, oversaw recruitment, onboarding, and ongoing
                personal and professional development. Regularly held one-on-one meetings and
                performance reviews, fostering transparency and open communication. Worked closely
                on client projects with staffing critical roles and competencies and oversaw
                architecture.
              </p>
            </li>
            <li>
              <p>2020 - 2022</p>
              <p>Tech lead & manager of the Swedish office @ Madefrom</p>
              <p>Malmö, Sweden</p>
              <p>
                Built a from-the-ground technical team for a SaaS application which helps extensive
                supply chain analysis in the production of physical goods. Managed the teams
                technology roadmap, goals and individual development.
              </p>
            </li>
            <li>
              <p>2017 - 2020</p>
              <p>Lead Developer @ Jayway</p>
              <p>Malmö, Sweden</p>
              <p>
                Led the development of frontend search functionality for a major retail company,
                optimizing performance and user experience. Built A/B testing tools to measure the
                impact of changes to customer experience and to increase revenue. Built data
                pipelines to allow rapid changes of multi-lingual product data to be ingested,
                indexed and searched across a global ecommerce multi-platform application.
              </p>
            </li>
            <li>
              <p>2014 - 2017</p>
              <p>Developer @ Ductus</p>
              <p>Malmö, Sweden</p>
              <p>Development, architecture.</p>
            </li>
            <li>
              <p>2013 - 2014</p>
              <p>Developer @ Capgemini</p>
              <p>Malmö, Sweden</p>
              <p>Development, configuration manager.</p>
            </li>
            <li>
              <p>2010 - 2013</p>
              <p>Co-founder, developer and interaction designer @ Ixagon AB</p>
              <p>Malmö, Sweden</p>
              <p>
                Co-created SHAPED, a projection mapping and sequencing tool for live video mapping
                and interactive installations. It allowed users to map multiple surfaces with ease
                and attach dynamic content. The content was managed in a sequencer interface similar
                to those found in video-editing and music production software. Built with Java and
                C++.
              </p>
            </li>
            <li>
              <p>2008 - 2009</p>
              <p>Programming tutor @ Malmö University</p>
              <p>Malmö, Sweden</p>
            </li>
            <li>
              <p>2007 - 2010</p>
              <p>Interaction Design student @ Malmö University</p>
              <p>Malmö, Sweden and Berlin, Germany</p>
            </li>
            <li>
              <p>1985</p>
              <p>Hello World</p>
              <p>Kalmar, Sweden</p>
            </li>
          </ul>
          <h2>About</h2>
          <h3>Me</h3>
          <p className='myself'>
            Hey there! I'm Jonas Stenberg, a passionate developer and tech enthusiast from Malmö,
            Sweden. My journey into coding started when I was 10, where I wrote .BAT scripts on the
            schools computer to do silly stuff. It later transitioned into an interest of doing
            websites in ASP (the classic version, not .NET) which led later led me to PHP eventually
            Javascript. Whether it's tinkering with a new programming language or diving deep into
            architecture and design, I love solving problems and building things.
            <br />
            <br />
            Over the years, I've had the chance to work on some really exciting projects, from
            leading teams of developers to co-founding a company with friends and creating
            interactive installations for the World Expo in Shanghai. I've held roles like
            Consultant Manager, Architect, and Lead Developer, and I've been fortunate enough to
            meet some incredibly talented people on the way, whom some I've had the pleasure to
            mentor and guide.
            <br />
            <br />
            On the professional side, I'm all about software architecture, frontend or backend
            development, and leading teams to build scalable solutions. Whether it's JavaScript
            frameworks like React, Golang, or cloud infrastructure on AWS and GCP. I also have a
            soft spot for my homelab setup and tweaking my Neovim config on my free time.
            <br />
            <br />
            Simply put, I love doing techy stuff and building things.
          </p>
          <h2>Skills</h2>
          <h3>I've learned</h3>
          <div className='skills'>
            <div>
              <h4>Hard skills</h4>
              <ul>
                <li>Architecture</li>
                <li>
                  Javascript/Typescript
                  <ul>
                    <li>Node</li>
                    <li>React</li>
                    <li>Vue</li>
                    <li>Hyperapp</li>
                  </ul>
                </li>
                <li>Golang</li>
                <li>Python</li>
                <li>Java</li>
                <li>Kotlin</li>
                <li>
                  SQL
                  <ul>
                    <li>PostgreSQL</li>
                    <li>MariaDB/MySQL</li>
                  </ul>
                </li>
                <li>
                  Infrastructure as code
                  <ul>
                    <li>Terraform</li>
                    <li>AWS CDK</li>
                    <li>Cloudformation</li>
                  </ul>
                </li>
                <li>
                  Protocols
                  <ul>
                    <li>Websockets</li>
                    <li>MQTT</li>
                    <li>REST</li>
                    <li>Kafka</li>
                    <li>SNS/SQS on AWS</li>
                  </ul>
                </li>
                <li>Linux admin</li>
                <li>AWS</li>
                <li>GCP</li>
              </ul>
            </div>

            <div>
              <h4>Soft skills</h4>
              <ul>
                <li>Leadership</li>
                <li>Recruitment & Onboarding</li>
                <li>Staffing</li>
                <li>Mentoring</li>
                <li>Individual Development</li>
                <li>Strategic Planning</li>
                <li>Client Communication</li>
              </ul>
            </div>
          </div>
          <h2>Contact</h2>
          <h3>Say Hello!</h3>
          <ul className='contact'>
            <li>
              <a href='mailto:portfolio@stenberg.io' aria-label='Email'>
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
