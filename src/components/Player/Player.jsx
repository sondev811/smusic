import React, { useEffect, useState } from 'react';
import PlayerDesktop from './player-desktop/PlayerDesktop';
import PlayerMobile from './player-mobile/PlayerMobile';

const Player = () => {
  const [viewPort, setViewPort] = useState(0);
  useEffect(() => {
    setViewPort(window.screen.width);
  }, [])
  return (
    (viewPort > 1024 ? <PlayerDesktop /> : <PlayerMobile />)
  );
};

export default Player;
