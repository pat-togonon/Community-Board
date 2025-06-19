import homepageCopy from "../helper/homepageCopy"
import { useNavigate } from "react-router-dom"

const Homepage = () => {

  const navigate = useNavigate()

  return (
    <div className="homepage">
      <div className="hero-section">
        <div>
          <h1>{homepageCopy.hero.title}</h1>
          <p>{homepageCopy.hero.sub}</p>
          <div className="ctas">
            <button onClick={() => navigate('/signup')} className="loginHomepage button">{homepageCopy.hero.cta1}</button>
            <span className="textLink cta2" onClick={() => navigate('/register-a-community')}>{homepageCopy.hero.cta2}</span>
          </div>
        </div>
        <img src="/Hero-desktop.jpg" alt="Komi hero image" className="hero-image desktop-hero"/>
        <img src="/Hero-landscape.jpg" alt="Komi hero image" className="hero-image mobile-hero"/>
      </div>
      <section className="section1">
        <h2>{homepageCopy.section1.title}</h2>
        <img src="/demo-png.png" className="demo-image"/>
        <img src="/demo-image-mobile.png" className="demo-image-mobile"/>
        <p>{homepageCopy.section1.sub1}</p>
        <p>{homepageCopy.section1.sub2}</p>
      </section>
      <section className="section2">
        <div className="features-group">
          <div className="feature-section">
            <img src='/join-community.svg'/>
            <h3>{homepageCopy.section2.subhead1}</h3>
            <p>{homepageCopy.section2.subhead1_description}</p>
          </div>
          <div className="feature-section">
            <img src='/stay-in-loop.svg' />
            <h3>{homepageCopy.section2.subhead2}</h3>
            <p>{homepageCopy.section2.subhead2_description}</p>
          </div>
        </div>
        <div className="features-group">
          <div className="feature-section">
            <img src='/shops.svg' />
            <h3>{homepageCopy.section2.subhead3}</h3>
            <p>{homepageCopy.section2.subhead3_description}</p>
          </div>
          <div className="feature-section">
            <img src='/help-each-other.svg' />
            <h3>{homepageCopy.section2.subhead4}</h3>
            <p>{homepageCopy.section2.subhead4_description_1}</p>
            <p>{homepageCopy.section2.subhead4_description_2}</p>
          </div>
        </div>
        <div className="feature-section">
          <img src='/events.svg' className="events-img"/>
          <h3>{homepageCopy.section2.subhead5}</h3>
          <p>{homepageCopy.section2.subhead5_description}</p>
        </div>
      </section>
      <section className="section3">
        <h2>{homepageCopy.section3.title}</h2>
        <div className="ctas">
            <button onClick={() => navigate('/signup')} className="loginHomepage button connect-button">{homepageCopy.hero.cta1}</button>
            <span className="textLink cta2" onClick={() => navigate('/register-a-community')}>{homepageCopy.hero.cta2}</span>
        </div>
      </section>
  
    </div>
  )
}

export default Homepage