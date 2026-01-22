"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <main>
      <h1>Hello World</h1>
      <p>Message from backend: {message}</p>
      <b>
        welcome to our CMDS, I'm new here!
      </b>
    </main>
  );
}
