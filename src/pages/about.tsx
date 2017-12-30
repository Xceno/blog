import Link from "gatsby-link";
import * as React from "react";
import * as aboutImg from "./_assets/about.jpg";

// tslint:disable-next-line:variable-name
const AboutPage = () => (
  <article className="article-open_item">
    <header>
      <h1>About</h1>
    </header>
    <div style={{ float: "left", width: "70%" }}>
      <div>
        <p>
          Hi, I'm Robert!<br />
          For whatever reason, I go under the name of Xceno since I first dialed into the web.<br />
          I started out as automation engineer but switched to full-time coding around 2010.
        </p>

        <p>When I don't code, I make weird music, build strange things or paint.</p>

        <p>
          Oh and I'm a huge fan of all things cyberpunk. Go fetch yourself a nice bowl of Ramen and watch Blade Runner. Seriously
          :)
        </p>

        <h2>Location</h2>
        <p>
          I'm currently based in Germany.<br />
          If you want to get in touch, just drop me a line at <a href="mailto:rob@xceno.io">rob@xceno.io</a>.
        </p>
      </div>
    </div>
    <aside className="img-wrapper" style={{ width: "25%", float: "right", display: "inline-block", marginTop: "-45px" }}>
      <img src={aboutImg} alt="" title="A totaly unrelated picture - Shot in Le Gruyéres" />
    </aside>
  </article>
);

// tslint:disable-next-line:no-default-export
export default AboutPage;
