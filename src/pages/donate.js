import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DonationLink({href, children}) {
  return href ? (
    <a className="button button--primary" href={href} target="_blank" rel="noopener noreferrer external">{children}</a>
  ) : <span className="disabledButton">Link not configured</span>;
}

export default function Donate() {
  const {siteConfig} = useDocusaurusContext();
  const paypal = siteConfig.customFields.paypalUrl;
  const kofi = siteConfig.customFields.kofiUrl;
  return (
    <Layout title="Donate" description="Support Project Sentinel through secure third-party donation providers.">
      <main>
        <section className="pageHero">
          <div className="eyebrow">SUPPORT THE PROJECT</div>
          <Heading as="h1">Help Project Sentinel grow.</Heading>
          <p>Donations support documentation, testing, hosting, compatibility research and future tools. Payments happen only on the provider's secure website; Project Sentinel never receives card or bank details.</p>
        </section>
        <section className="homeSection">
          <div className="container">
            <div className="donateGrid">
              <article className="donateCard">
                <Heading as="h2">PayPal</Heading>
                <p>Use your public PayPal.Me link or an official PayPal donation URL. Never use a private account-management link.</p>
                <DonationLink href={paypal}>Open secure PayPal page</DonationLink>
              </article>
              <article className="donateCard">
                <Heading as="h2">Ko-fi</Heading>
                <p>Use your public Ko-fi profile URL. Ko-fi handles the payment and supporter information on its own service.</p>
                <DonationLink href={kofi}>Open secure Ko-fi page</DonationLink>
              </article>
            </div>
            <div className="securityCard">
              <Heading as="h2">Donation safety</Heading>
              <ul>
                <li>No payment form is hosted by Project Sentinel.</li>
                <li>No bank or card information is sent to GitHub Pages or stored in this repository.</li>
                <li>Only public donation-page URLs belong in <code>docusaurus.config.js</code>.</li>
                <li>Passwords, API keys, access tokens and private account links must stay in provider dashboards or encrypted secrets.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
