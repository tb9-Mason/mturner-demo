import { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const LOADING_MESSAGES = [
  'Probably waking up my eco dynos...',
  'Reticulating splines...',
  'Gotta go get this out of the shed...',
  'Read any good books lately?',
  `await new Promise((resolve) => 
  resolve("This shouldn't take long...")
);`,
];

export const RouteLoadingIndicator = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  // Gets a random index for a given length, avoiding the last set index
  const getRandomIndex = (exclude: number, length: number) => {
    let index = exclude;
    while (index === exclude && length > 1) {
      index = Math.floor(Math.random() * length);
    }
    return index;
  };

  // Randomize loading messages. These eco dynos can take a while to spin up
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => getRandomIndex(prev, LOADING_MESSAGES.length));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-10 backdrop-blur-sm min-h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        <ArrowPathIcon className="size-12 animate-spin" />
        <pre className="whitespace-pre text-sm">{LOADING_MESSAGES[messageIndex]}</pre>
      </div>
    </div>
  );
};
