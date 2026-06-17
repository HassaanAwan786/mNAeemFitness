import React, { useEffect, useState } from "react";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loaderInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20;
        if (next >= 100) {
          clearInterval(loaderInterval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(loaderInterval);
  }, [onComplete]);

  return (
    <div id="loader">
      <div className="loader-text">MNAEEM FITNESS</div>
      <div className="loader-bar">
        <div className="loader-progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="loader-text" style={{ fontSize: "10px" }}>
        LOADING EXPERIENCE
      </div>
    </div>
  );
}
