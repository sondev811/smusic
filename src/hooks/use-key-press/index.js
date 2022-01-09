import { useEffect, useState } from "react";

export const useKeyPress = targetKey => {
    const [keyPressed, setKeyPressed] = useState(false);
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(!keyPressed);
      }
    }
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
      };
    }, []);
    return keyPressed;
  }