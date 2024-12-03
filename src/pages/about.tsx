import * as React from "react";
import { Layout } from "../components/layout";
import * as aboutImg from "./_assets/about.jpg";

// tslint:disable-next-line:variable-name
const AboutPage = () => (
  <Layout>
    <article className="article-open_item">
      <header>
        <h1>About</h1>
      </header>
      <div style={{ float: "left", width: "70%" }}>
        <div>
          <p>
            Hi, I'm Ray!
            <br />
            For whatever reason, I go under the name of Xceno since I first dialed into the web.
            <br />I started out as automation engineer but switched to full-time coding around 2010.
          </p>

          <p>When I don't code, I make weird music, build strange things or do other artsy stuff.</p>
          <p>Check out my band <a href="https://www.final-faith.com/">Final Faith</a>, or listen to my <a href="https://xceno.bandcamp.com/">solo stuff</a>.</p>

          <iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/track=94135464/size=large/bgcol=181a1b/linkcol=840d3a/tracklist=false/artwork=small/transparent=true/" seamless><a href="https://xceno.bandcamp.com/track/silence">Silence by xceno</a></iframe>

          <h2>Location</h2>
          <p>
            I'm currently based in Germany.
            <br />
            If you want to get in touch, just drop me a line at{" "}
            <a href="mailto:ray@xceno.io">ray@xceno.io</a>.
          </p>
        </div>
      </div>
      <aside
        className="img-wrapper"
        style={{ width: "25%", float: "right", display: "inline-block", marginTop: "-45px" }}
      >
        <img src={aboutImg} alt="" title="A totaly unrelated picture - Shot in Le Gruyéres" />
      </aside>
    </article>
  </Layout>
);

// tslint:disable-next-line:no-default-export
export default AboutPage;
