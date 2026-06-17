import React from "react";

export default function InstagramFeed() {
  return (
    <section className="instagram-feed">
      <div className="container">
        <div className="section-header reveal active">
          <div className="section-tag">FOLLOW THE JOURNEY</div>
          <h2>@MNAEEM_FITNESS</h2>
          <p>Daily content. Real training. No filters.</p>
        </div>
        <div className="feed-grid">
          {[...Array(6)].map((_, i) => (
            <div className="feed-item" key={i}>
              <i className="fab fa-instagram"></i>
            </div>
          ))}
        </div>
        <div className="instagram-btn reveal active">
          <a
            href="https://www.instagram.com/mnaeem_fitness"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <i className="fab fa-instagram"></i> Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
