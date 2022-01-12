import { useEffect, useState } from 'react';

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(!keyPressed);
      }
    };
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [keyPressed, targetKey]);
  return keyPressed;
};
