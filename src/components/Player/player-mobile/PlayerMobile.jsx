import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import {
  BsChevronDown,
  BsFillPlayFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsMusicNoteList,
  BsPauseFill
} from 'react-icons/bs';
import { MdOutlineRepeat, MdOutlineRepeatOne } from 'react-icons/md';
import { colors, LoopType } from '../../../constants/player';
import {
  currentMusicStore,
  playerStore,
  playlistItemStore,
  playlistStore,
  searchTypingStore,
  useAppDispatch,
  useAppSelector,
  useEventListener,
  useOutside
} from '../../../hooks';
import { setVolumeAction } from '../../../reducers/player.reducer';
import { setCurrentMusicAction } from '../../../reducers/queue.reducer';
import musicService from '../../../services/music.service';
import Queue from '../../Queue/Queue';
import Toast from '../../Toast/Toast';
import '../Player.scss';

const PlayerDesktop = () => {
  const musicPlayer = useRef(null);
  const totalDuration = useRef(null);
  const progressBar = useRef(null);
  const playbackProgress = useRef(null);
  const playbackProgressMobile = useRef(null);
  const volumeBar = useRef(null);
  const loopTypeRef = useRef(LoopType.None);
  const volume = useRef(null);
  const playerMobile = useRef(null);
  const mobilePlayBtn = useRef(null);
  const queuesListRef = useRef([]);
  useOutside(
    volume,
    useCallback(() => setActiveVolume(false), [])
  );
  const dispatch = useAppDispatch();
  const currentMusic = useAppSelector(currentMusicStore);
  const queuesList = useAppSelector(playlistItemStore);
  const volumeStore = useAppSelector(playerStore);
  const typing = useAppSelector(searchTypingStore);
  const playlist = useAppSelector(playlistStore);

  const [isActiveVolume, setActiveVolume] = useState(false);
  const [volumeValue, setVolumeValue] = useState(50);
  const [isPlaying, setPlay] = useState(false);
  const [isClickOnVolumeBar, setClickOnVolumeBar] = useState(false);
  const [loopType, setLoopType] = useState(LoopType.None);
  const [activeNext, setActiveNext] = useState(false);
  const [activePrev, setActivePrev] = useState(false);
  const [activeVolumeMobile, setActiveVolumeMobile] = useState(true);
  const [color, setColor] = useState('rgba(184, 72, 56, .5)');
  const [openPlayer, setOpenPlayer] = useState(false);
  const [pressSpace, setPressSpace] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');
  const [toast, setToast] = useState({
    isShow: false,
    status: false,
    message: ''
  });
  const [openQueue, setOpenQueue] = useState(false);

  const handlePressSpace = useCallback(
    (event) => {
      if (!event || !event.key || typing) return;
      const { key } = event;
      if (key === ' ' && musicPlayer.current) {
        setPressSpace(!pressSpace);
        if (pressSpace) {
          musicPlayer.current.play();
          return;
        }
        musicPlayer.current.pause();
      }
    },
    [pressSpace, typing]
  );

  useEventListener('keydown', handlePressSpace);

  useEffect(() => {
    const getMusicUrl = async () => {
      if (!currentMusic || !currentMusic.youtubeId) return;
      const response = await musicService.getMusicUrl(currentMusic.youtubeId);
      if (!response || !response.result || !response.result.url) return;
      setMusicUrl(response.result.url);
      console.log(response.result.type, 'type');
      console.log(response.result.quality, 'quality');
      console.log(response.result.url, 'url');
    };
    getMusicUrl();
  }, [currentMusic]);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);

    const progressEndMusic = async (music) => {
      resetPlayer();
      const result = await musicService.updateCurrentMusic(music.youtubeId, playlist.playlistId);
      if (!result || !result.status) return;
      dispatch(setCurrentMusicAction(music));
    };

    const setHandleMetaData = () => {
      if (!navigator || !navigator.mediaSession) return;
      const skipTime = 10;
      navigator.mediaSession.setActionHandler('play', () => {
        musicPlayer.current.play();
        setPlay(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        musicPlayer.current.pause();
        setPlay(false);
      });
      const index = queuesList.findIndex(
        (item) => item.youtubeId === currentMusic.youtubeId
      );
      if (index < queuesList.length - 1) {
        navigator.mediaSession.setActionHandler('nexttrack', () =>
          nextPrevBtn('next')
        );
      } else {
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
      if (index > 0) {
        navigator.mediaSession.setActionHandler('previoustrack', () =>
          nextPrevBtn('prev')
        );
      } else {
        navigator.mediaSession.setActionHandler('previoustrack', null);
      }
      navigator.mediaSession.setActionHandler('seekbackward', function () {
        musicPlayer.current.currentTime = Math.max(
          musicPlayer.current.currentTime - skipTime,
          0
        );
      });
      navigator.mediaSession.setActionHandler('seekforward', function () {
        musicPlayer.current.currentTime = Math.min(
          musicPlayer.current.currentTime + skipTime,
          musicPlayer.current.duration
        );
      });
    };

    const ended = async () => {
      const indexCurrentMusic = queuesListRef.current.findIndex(
        (item) => item.youtubeId === currentMusic.youtubeId
      );
      if (indexCurrentMusic === queuesListRef.current.length - 1) {
        if (loopTypeRef.current === LoopType.All) {
          const nextMusic = queuesListRef.current[0];
          progressEndMusic(nextMusic);
        }
        return;
      }
      const nextMusic = queuesListRef.current[indexCurrentMusic + 1];
      if (!nextMusic.youtubeId) return;
      progressEndMusic(nextMusic);
    };

    const isiOSSystem = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }

    const setDuration = () => {
      if (!musicPlayer.current || !musicPlayer.current.duration) return;
      let handleDuration = musicPlayer.current.duration;
      if (isiOSSystem()) {
        console.log('iOS');
        handleDuration = handleDuration / 2;
      }
      console.log('----loadeddata----');
      console.log(handleDuration, 'total duration');
      const duration = formatDuration(handleDuration);
      console.log(duration.minutes, typeof duration.minutes, 'minutes');
      console.log(duration.seconds, typeof duration.seconds ,'seconds');
      totalDuration.current.innerHTML = `${duration.minutes}:${duration.seconds}`;
    };

    const updateProgressBar = () => {
      if (
        !player ||
        !player.duration ||
        !player.currentTime ||
        !minuteDom ||
        !secondDom
      )
        return;
      const { minutes, seconds } = formatDuration(player.currentTime);
      minuteDom.innerHTML = minutes;
      secondDom.innerHTML = seconds;
      let duration = player.duration;
      if (isiOSSystem()) {
        duration = duration / 2;
      }
      const percentage = Math.floor(
        (100 / player.duration) * player.currentTime
      );
      if (playbackProgress && playbackProgress.current) {
        playbackProgress.current.style.width = percentage + '%';
      }
      if (playbackProgressMobile && playbackProgressMobile.current) {
        playbackProgressMobile.current.style.width = percentage + '%';
      }
    };

    const play = () => {
      setPlay(true);
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentMusic.name,
        artist: currentMusic.authorName,
        artwork: [
          { src: currentMusic.audioThumb, sizes: '512x512', type: 'image/png' }
        ]
      });
    };

    const pause = () => {
      setPlay(false);
    };

    const error = (e) => {
      setToast({
        isShow: true,
        status: false,
        message: errObj[e.currentTarget.error.code]
      });
    };

    const errObj = {
      1: "Không thể tải bài hát. Hãy fresh lại trang!!!",
      2: "Lỗi mạng. Hãy fresh lại trang!!!",
      3: "Không thể decode. Hãy fresh lại trang!!!",
      4: "Dạng nhạc không hỗ trợ. Hãy fresh lại trang!!!"
    }

    const volumeChange = () => {
      dispatch(setVolumeAction(player.volume));
      setVolumeValue(player.volume * 100);
    };
    if (
      !musicPlayer ||
      !musicPlayer.current ||
      !playbackProgress ||
      !playbackProgress.current
    )
      return;
    const player = musicPlayer.current;
    const minuteDom = document.getElementById('minutes');
    const secondDom = document.getElementById('seconds');
    player.load();
    const musicP = document.getElementById('musicPlayer');
    musicP.addEventListener('error', error, true);
    player.volume = volumeStore;
    setVolumeValue(volumeStore * 100);
    setHandleMetaData();
    playbackProgress.current.style.width = 0 + '%';
    if (minuteDom && secondDom) {
      minuteDom.innerHTML = '00';
      secondDom.innerHTML = '00';
    }
    player.addEventListener('ended', ended);
    player.addEventListener('loadeddata', setDuration);
    player.addEventListener('timeupdate', updateProgressBar);
    player.addEventListener('play', play);
    player.addEventListener('pause', pause);
    player.addEventListener('volumechange', volumeChange);
    return () => {
      if (!player) return;
      player.removeEventListener('ended', ended);
      player.removeEventListener('loadeddata', setDuration);
      player.removeEventListener('timeupdate', updateProgressBar);
      player.removeEventListener('play', play);
      player.removeEventListener('pause', pause);
      player.removeEventListener('volumechange', volumeChange);
      musicP.removeEventListener('error', error);
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicUrl]);

  useEffect(() => {
    queuesListRef.current = queuesList;
  }, [queuesList]);

  useEffect(() => {
    const checkNextPrev = () => {
      if (!currentMusic ||!currentMusic.youtubeId) return;
      const index = queuesList.findIndex(
        (item) => item.youtubeId === currentMusic.youtubeId
      );
      if (index < queuesList.length - 1) {
        setActiveNext(true);
      } else {
        setActiveNext(false);
      }
      if (index > 0) {
        setActivePrev(true);
      } else {
        setActivePrev(false);
      }
    };
    checkNextPrev();
  }, [queuesList, currentMusic]);

  const formatDuration = (time) => {
    let minutes = Math.floor(time / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = Math.floor(time - (minutes * 60));
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return { minutes, seconds };
  };

  const handleProgressBar = (event) => {
    const player = musicPlayer.current;
    const progress = progressBar.current;
    const progressPlay = playbackProgress.current;
    if (
      !player ||
      !progress ||
      !progressPlay ||
      !player.currentTime | !player.duration
    )
      return;
    const position = event.clientX - progress.getBoundingClientRect().left;
    const percent = position / progress.offsetWidth;
    player.currentTime = percent * player.duration;
    progressPlay.style.width = Math.floor(percent * 100) + '%';
  };

  //Event volume
  const handleVolume = (event) => {
    const volume = volumeBar.current;
    const player = musicPlayer.current;
    if (!player || !volume) return;
    const position = event.clientX - volume.getBoundingClientRect().left;
    let volumeWidth = position.toFixed() * 1;
    if (volumeWidth >= 100) {
      volumeWidth = 100;
    } else if (volumeWidth < 10) {
      volumeWidth = 0;
    }
    player.volume = volumeWidth / 100;
  };

  const handleVolumeWheel = (event) => {
    const player = musicPlayer.current;
    if (!player) return;
    let volume = player.volume;
    if (event.deltaY < 0) {
      volume += 0.1;
      if (volume >= 1) {
        volume = 1;
      }
      player.volume = volume;
      return;
    }
    volume -= 0.1;
    if (volume < 0.1) {
      volume = 0;
    }
    player.volume = volume;
  };

  const onClickVolume = () => setActiveVolume(!isActiveVolume);

  const onMouseDownVolume = (event) => {
    if (!isActiveVolume) {
      return;
    }
    setClickOnVolumeBar(true);
    handleVolume(event);
  };

  const onMouseUpVolume = () => setClickOnVolumeBar(false);

  const onDragVolume = (event) => {
    if (!isClickOnVolumeBar) {
      return;
    }
    handleVolume(event);
  };

  const onOpenPlayer = (event) => {
    if (mobilePlayBtn.current.contains(event.target)) return;
    setOpenPlayer(true);
  };

  const onClosePlayer = () => {
    setOpenPlayer(false);
  };

  //Event Play
  const onClickPlay = () => {
    const player = musicPlayer.current;
    if (!player) return;
    if (isPlaying) {
      if (!player.paused) {
        player.pause();
      }
    } else {
      if (player.paused) {
        player.play();
      }
    }
  };

  //Event Loop
  const handleLoop = () => {
    const player = musicPlayer.current;
    if (!player) return;
    if (loopType === LoopType.None) {
      player.setAttribute('loop', true);
      setLoopType(LoopType.One);
      loopTypeRef.current = LoopType.One;
      return;
    }
    if (loopType === LoopType.One) {
      player.removeAttribute('loop');
      setLoopType(LoopType.All);
      loopTypeRef.current = LoopType.All;
      return;
    }

    player.removeAttribute('loop');
    setLoopType(LoopType.None);
    loopTypeRef.current = LoopType.None;
  };

  const resetPlayer = () => {
    if (playbackProgress && playbackProgress.current) {
      playbackProgress.current.style.width = 0 + '%';
    }
    if (playbackProgressMobile && playbackProgressMobile.current) {
      playbackProgressMobile.current.style.width = 0 + '%';
    }
  };

  const nextPrevBtn = async (type) => {
    const index = queuesList.findIndex(
      (item) => item.youtubeId === currentMusic.youtubeId
    );
    let nextMusic = null;
    if (type === 'next') {
      nextMusic = queuesList[index + 1];
    } else {
      nextMusic = queuesList[index - 1];
    }
    if (!nextMusic || !nextMusic.youtubeId) {
      return;
    }
    const result = await musicService.updateCurrentMusic(nextMusic.youtubeId, playlist.playlistId);
    if (!result || !result.status) return;
    setColor();
    resetPlayer();
    dispatch(setCurrentMusicAction(nextMusic));
  };

  const onClickVolumeMobile = () => {
    setActiveVolumeMobile(!activeVolumeMobile);
    if (!activeVolumeMobile) {
      musicPlayer.current.volume = 0.5;
      return;
    }
    musicPlayer.current.volume = 0;
  };

  return (
    <div className="player" style={{ zIndex: openPlayer ? 1112 : 1000 }}>
      {currentMusic && currentMusic.youtubeId && musicUrl ? (
        <div>
          <audio
            id="musicPlayer"
            ref={musicPlayer}
            controls
            autoPlay
            preload="none"
            style={{ display: 'none' }}
            src={musicUrl ? musicUrl : null}
            type="audio/mpeg"
          >
          </audio>
            <div
              className={`musicPlayer ${openPlayer ? 'active-mobile' : ''}`}
              style={{
                backgroundImage: openPlayer
                  ? `linear-gradient(240deg, rgba(0, 0, 0, 0.3), ${color}`
                  : ''
              }}
            >
              <div
                className="mobile-icon queue-list"
                onClick={() => setOpenQueue(true)}
              >
                <BsMusicNoteList />
              </div>
              <div className="mobile-icon down-mobile" onClick={onClosePlayer}>
                <BsChevronDown />
              </div>
              <div
                className="cd"
                style={{ backgroundImage: `url(${currentMusic.audioThumb})` }}
              ></div>
              <div>
                  <p className="audio-name">{currentMusic.name}</p>
                  <p className="author-name">{currentMusic.authorName}</p>
                  <div className="background"></div>
                  <div
                    id="progressBar"
                    ref={progressBar}
                    onMouseDown={handleProgressBar}
                  >
                    <div
                      id="playbackProgress"
                      ref={playbackProgress}
                      onMouseDown={handleProgressBar}
                    ></div>
                  </div>
                  <div className="music-duration">
                    <div>
                      <span id="minutes">0</span>:<span id="seconds">0</span>
                    </div>
                    <div>
                      <span id="duration" ref={totalDuration}>
                        00:00
                      </span>
                    </div>
                  </div>
                  <div className="controlers">
                    <div id="loopBtn" onClick={handleLoop}>
                      {loopType === LoopType.One ? (
                        <MdOutlineRepeatOne className="active" />
                      ) : (
                        <MdOutlineRepeat
                          className={loopType === LoopType.All ? 'active' : ''}
                        />
                      )}
                    </div>
                    <div
                      id="prevBtn"
                      className={activePrev ? 'activeControl' : ''}
                      onClick={() => nextPrevBtn('prev')}
                    >
                      <BiSkipPrevious />
                    </div>
                    <div id="playBtn" onClick={onClickPlay}>
                      {isPlaying ? <BsPauseFill /> : <BsFillPlayFill />}
                    </div>
                    <div
                      id="nextBtn"
                      className={activeNext ? 'activeControl' : ''}
                      onClick={() => nextPrevBtn('next')}
                    >
                      <BiSkipNext />
                    </div>

                    <div
                      id="volumeBtn"
                      className="volumeDesktop"
                      ref={volume}
                      onWheel={handleVolumeWheel}
                    >
                      {volumeValue > 0 ? (
                        <div
                          onClick={onClickVolume}
                          style={{ position: 'relative', zIndex: 2 }}
                        >
                          <BsFillVolumeUpFill />
                        </div>
                      ) : (
                        <div
                          onClick={onClickVolume}
                          style={{ position: 'relative', zIndex: 2 }}
                        >
                          <BsFillVolumeMuteFill />
                        </div>
                      )}
                      <div
                        className={`volumeProgress ${
                          isActiveVolume ? 'volumeActive' : ''
                        }`}
                      >
                        <div className="volume-overlay">
                          <div
                            id="lines"
                            ref={volumeBar}
                            onMouseDown={onMouseDownVolume}
                            onMouseUp={onMouseUpVolume}
                            onMouseMove={onDragVolume}
                          >
                            <div id="volumeBar"></div>
                            <div
                              id="volumeValue"
                              style={{ width: volumeValue }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="volumeBtn" className="volumeMobile">
                      {activeVolumeMobile ? (
                        <div
                          onClick={onClickVolumeMobile}
                          style={{ position: 'relative', zIndex: 2 }}
                        >
                          <BsFillVolumeUpFill />
                        </div>
                      ) : (
                        <div
                          onClick={onClickVolumeMobile}
                          style={{ position: 'relative', zIndex: 2 }}
                        >
                          <BsFillVolumeMuteFill />
                        </div>
                      )}
                    </div>
                  </div>
              
                
              </div>
            </div>
          {!openPlayer ? (
            <div
              className="player__mobile"
              style={{ background: color }}
              onClick={onOpenPlayer}
              ref={playerMobile}
            >
              <div id="progressBar">
                <div id="playbackProgress" ref={playbackProgressMobile}></div>
              </div>
              <div className="player__mobile--thumb">
                <img src={currentMusic.audioThumb} alt="" />
              </div>
              <div className="player__mobile--name">
                <div>{currentMusic.name}</div>
                <div>{currentMusic.authorName}</div>
              </div>
              <div
                id="playBtn"
                className="player__mobile--play"
                ref={mobilePlayBtn}
              >
                {isPlaying ? (
                  <BsPauseFill onClick={onClickPlay} />
                ) : (
                  <BsFillPlayFill onClick={onClickPlay} />
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      <div className={`queue-container ${openQueue ? 'queue-active' : ''}`}>
        <div
          className="mobile-icon down-mobile"
          onClick={() => setOpenQueue(false)}
        >
          <BsChevronDown />
        </div>
        {queuesList && queuesList.length && openQueue && <Queue closeQueue={() => setOpenQueue(false)} />}
      </div>
      {toast.isShow && (
        <Toast
          isShow={toast.isShow}
          status={toast.status}
          message={toast.message}
        />
      )}
    </div>
  );
};

export default PlayerDesktop;
