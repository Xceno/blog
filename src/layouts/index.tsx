import * as React from "react";
import * as ReactDom from "react-dom";

import Link from "gatsby-link";
import Helmet from "react-helmet";

import "./styles.scss";
// @ts-ignore
import * as wtfpl from "./wtfpl.svg";

const headerLinks = [{ title: "Home", uri: "/" }, { title: "About", uri: "/about" }];
const socialLinks = [
  { title: "GitHub", uri: "https://github.com/users/xceno", icon: "icon-github" },
  { title: "StackOverflow", uri: "https://stackoverflow.com/users/932315/xceno?tab=profile", icon: "icon-stackoverflow" }
];

const toggleMenuClass = () => {
  const body = document.querySelector("body");
  if (body) {
    body.classList.toggle("show-menu");
  }
};

const toggleTheme = (e: Event & any) => {
  if (e) {
    e.preventDefault();
  }

  [document.querySelector("html"), document.querySelector("body")].filter(x => !!x).map(x => x!.classList.toggle("lights-on"));
};

const pageHeader = () => (
  <div className="page-header">
    <button id="menu-toggle-button" onClick={toggleMenuClass}>
      <span className="first" />
      <span className="second" />
      <span className="third" />
    </button>
    <div className="page-nav-wrapper">
      <nav role="navigation">
        <ul>
          {headerLinks.map((x, i) => (
            <li key={i}>
              {
                // @ts-ignore
                <Link to={x.uri}>{x.title}</Link>
              }
            </li>
          ))}
        </ul>
      </nav>
      <div className="additional-nav">
        <div className="social-icons-wrapper">
          {
            <ul>
              {socialLinks.map(x => (
                <li key={x.title}>
                  <a href={x.uri} title={x.title}>
                    <i className={x.icon} />
                  </a>
                </li>
              ))}
            </ul>
          }
        </div>
        <div className="light_switch">
          <a href="" onClick={toggleTheme} role="button" title="Toggle lights">
            <i className="icon-sun lightswitch-icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const pageFooter = () => (
  <footer id="page-footer">
    <div className="footer_block info">
      <div className="footer_block-item copyright">
        <h6>Copyright {new Date().getFullYear()}, Robert Knolmar</h6>
        <a href="http://www.wtfpl.net" className="wtfpl-link" title="WTFPL License">
          <i className="icon-wtfpl" />
        </a>
      </div>
      <div className="footer_block-item disclaimer">
        <h6>Disclaimer</h6>
        <p>Opinions expressed are my own, unless explicitly stated otherwise.</p>
      </div>
      <div className="footer_block-item about">
        <h6>About</h6>
        <p>Welcome to yet another blog about coding.</p>
      </div>
    </div>
    <div className="footer_block social">
      <div className="social_links">
        {socialLinks.map(x => (
          <a key={x.title} href={x.uri} title={x.title}>
            <i className={x.icon} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

const templateWrapper = ({ children, data }: { children: any; data: any }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[{ name: "description", content: "Sample" }, { name: "keywords", content: "sample, something" }]}
    />
    {pageHeader()}
    <div className="main_wrapper--grid-effect">
      <div className="content-wrapper">
        {children()}
        <div className="senseless-footer">
          <svg width="60" height="5">
            <circle className="dot dot--animated" cx="3" cy="2" r="2" style={{ fill: "#f50c35" }} />
            <circle className="dot dot--animated" cx="20" cy="2" r="2" style={{ fill: "#9c011c" }} />
            <circle className="dot dot--animated" cx="37" cy="2" r="1.8" style={{ fill: "#6b0517" }} />
            <circle className="dot dot--animated" cx="55" cy="2" r="1.5" style={{ fill: "#520000" }} />
          </svg>
        </div>
      </div>
    </div>
    {pageFooter()}
  </div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default templateWrapper;
