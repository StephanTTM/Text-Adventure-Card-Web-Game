import React, { useState, useEffect } from 'react';

export default function TypewriterText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      const char = text.charAt(i);
      setDisplayed((prev) => prev + char);
      i += 1;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}
