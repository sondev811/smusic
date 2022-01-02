import React, { useEffect, useRef, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsChevronCompactDown, BsChevronDown, BsFillPlayFill, BsFillVolumeMuteFill, BsFillVolumeUpFill, BsPauseFill } from "react-icons/bs";
import { MdOutlineRepeat, MdOutlineRepeatOne } from 'react-icons/md';
import { setPlayerAction } from '../../actions/player.action';
import { setCurrentMusicAction } from '../../actions/queue.action';
import { LoopType } from "../../constants/player";
import { currentMusicStore, playerStore, queuesStore, useOutside } from '../../features';
import { useAppDispatch, useAppSelector } from '../../hooks';
import musicService from "../../services/music.service";
import './Player.scss';

const Player = (props) => {
    const musicPlayer = useRef(null);
    const totalDuration = useRef(null);
    const progressBar = useRef(null);
    const playbackProgress = useRef(null);
    const volumeBar = useRef(null);
    const loopTypeRef = useRef(LoopType.None);
    const queuesListRef = useRef([]);
    const volume = useRef(null);
    const playerMobile = useRef(null);
    const mobilePlayBtn = useRef(null);
    useOutside(volume, () => setActiveVolume(false));

    const dispatch = useAppDispatch();

    const currentMusic = useAppSelector(currentMusicStore);
    const queuesList = useAppSelector(queuesStore);
    const isOpenPlayer = useAppSelector(playerStore);

    const [isActiveVolume, setActiveVolume] = useState(false);
    const [volumeValue, setVolumeValue] = useState(50);
    const [durationValue, setDurationValue] = useState({
        minutes: '00',
        seconds: '00'
    });
    const [isPlaying, setPlay] = useState(false);
    const [isClickOnVolumeBar, setClickOnVolumeBar] = useState(false);
    const [loopType, setLoopType] = useState(LoopType.None);
    const [activeNext, setActiveNext] = useState(false);
    const [activePrev, setActivePrev] = useState(false);

    useEffect(() => {

        const progressEndMusic = async(music) => {
            await musicService.updateCurrentMusic(music.youtubeId);
            dispatch(setCurrentMusicAction(music));
        }

        const ended = async() => {
            const indexCurrentMusic = queuesListRef.current.findIndex(item => item.ggDriveId === currentMusic.ggDriveId);
            if (indexCurrentMusic === queuesListRef.current.length - 1) {
                if (loopTypeRef.current === LoopType.All) {
                    const nextMusic = queuesList[0];
                    progressEndMusic(nextMusic);
                }
                return;
            }
            const nextMusic = queuesListRef.current[indexCurrentMusic + 1];
            if (!nextMusic.ggDriveId) return;
            progressEndMusic(nextMusic);
        }

        const setDuration = () => {
            if (!musicPlayer.current) return;
            const duration = formatDuration(musicPlayer.current.duration);
            totalDuration.current.innerHTML = `${duration.minutes}:${duration.seconds}`;
        }

        const updateProgressBar = () => {
            setDurationValue(formatDuration(player.currentTime));
            const percentage = Math.floor((100 / player.duration) * player.currentTime);
            if(!playbackProgress || !playbackProgress.current) return;
            playbackProgress.current.style.width = percentage + '%';
        }

        const play = () => {
            setPlay(true);
        }

        const pause = () => {
            setPlay(false);
        }

        if (!musicPlayer || !musicPlayer.current) return;
        const player = musicPlayer.current;

        player.load();
        playbackProgress.current.style.width = 0 + '%';
        player.addEventListener('ended', ended);
        player.addEventListener('loadedmetadata', setDuration);
        player.addEventListener('timeupdate', updateProgressBar);
        player.addEventListener('play', play);
        player.addEventListener('pause', pause);

        return () => {
            if (!musicPlayer || !musicPlayer.current) return;
            musicPlayer.current.removeEventListener('ended', ended);
            musicPlayer.current.removeEventListener('loadedmetadata', setDuration);
            musicPlayer.current.removeEventListener('timeupdate', updateProgressBar);
            musicPlayer.current.removeEventListener('play', play);
            musicPlayer.current.removeEventListener('pause', pause);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMusic]);

    useEffect(() => {
        queuesListRef.current = queuesList;
    }, [queuesList]);

    useEffect(() => {
        const checkNextPrev = () => {
            const index = queuesList.findIndex(item => item.ggDriveId === currentMusic.ggDriveId);
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
        }
        checkNextPrev();
    }, [queuesList, currentMusic])

    const formatDuration = time => {
        let minutes = Math.floor(time / 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let seconds = Math.floor(time - minutes * 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return { minutes, seconds };
    }

    const handleProgressBar = event => {
        const player = musicPlayer.current;
        const progress = progressBar.current;
        const progressPlay = playbackProgress.current;
        if (!player || !progress || !progressPlay) return;
        const position = event.clientX - progress.getBoundingClientRect().left;
        const percent = position / progress.offsetWidth;
        player.currentTime = percent * player.duration;
        progressPlay.style.width = Math.floor(percent * 100) + '%';
    }

    //Event volume
    const handleVolume = event => {
        const volume = volumeBar.current;
        const player = musicPlayer.current;
        if (!player || !volume) return;
        const position = event.clientX - volume.getBoundingClientRect().left;
        let volumeWidth = position.toFixed()*1;
        if (volumeWidth >= 100) {
            volumeWidth = 100;
        } else if (volumeWidth < 10) {
            volumeWidth = 0;
        }
        setVolumeValue(volumeWidth);
        player.volume = volumeWidth / 100;
    }
    
    const handleVolumeWheel = event => {
        const player = musicPlayer.current;
        if (!player) return;
        let volume = player.volume;
        if (event.deltaY < 0) {
            volume += 0.1;
            if (volume >= 1) {
                volume = 1;
            }
            player.volume = volume;
            setVolumeValue(volume*100);
            return;
        }
        volume -= 0.1;
        if (volume < 0.1) {
            volume = 0;
        }
        player.volume = volume;
        setVolumeValue(volume*100);
    }
    
    const onClickVolume = () => setActiveVolume(!isActiveVolume);

    const onMouseDownVolume = event => {
        if(!isActiveVolume) {
            return;
        }
        setClickOnVolumeBar(true);
        handleVolume(event);
    }

    const onMouseUpVolume = () => setClickOnVolumeBar(false);

    const onDragVolume = event => {
        if (!isClickOnVolumeBar) {
            return;
        }
        handleVolume(event);
    }

    const openPlayer = (event) => {
        if (mobilePlayBtn.current.contains(event.target)) return;
        dispatch(setPlayerAction(true));
        
    }

    const closePlayer = () => {
        dispatch(setPlayerAction(false));
    }
    
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
    }

    //Event Loop
    const handleLoop = () => {
        const player = musicPlayer.current;
        if (!player) return;
        if (loopType === LoopType.None) {
            player.setAttribute('loop', true);
            setLoopType(LoopType.One);
            loopTypeRef.current = LoopType.One;
        } else if (loopType === LoopType.One){
            player.removeAttribute('loop');
            setLoopType(LoopType.All);
            loopTypeRef.current = LoopType.All;
        } else {
            player.removeAttribute('loop');
            setLoopType(LoopType.None);
            loopTypeRef.current = LoopType.None;
        }
    }

    const nextPrevBtn = async(type) => {
        const index = queuesListRef.current.findIndex(item => item.ggDriveId === currentMusic.ggDriveId);
        let nextMusic =null;
        if (type === 'next') {
            nextMusic = queuesListRef.current[index + 1];
        } else {
            nextMusic = queuesListRef.current[index - 1];
        }
        if (!nextMusic.ggDriveId) {
            return;
        }
        await musicService.updateCurrentMusic(nextMusic.youtubeId);
        dispatch(setCurrentMusicAction(nextMusic));
    }

    return (
        <div className='player'>
            {
                currentMusic && currentMusic.ggDriveId ?
                <div>
                    <audio id="musicPlayer" ref={musicPlayer} controls autoPlay preload="auto" style={{display: 'none'}}> 
                        <source src={`http://docs.google.com/uc?export=open&id=${currentMusic.ggDriveId}`} type="audio/mpeg" /> 
                    </audio>
                    <div className='player__desktop'>
                        <div className={`musicPlayer ${isOpenPlayer ? 'active-mobile' : ''}`} >
                            <div className='down-mobile' onClick={closePlayer}>
                                <BsChevronDown />
                            </div>
                            <p className="audio-name">{currentMusic.name}</p>   
                            <p className="author-name">{currentMusic.authorName}</p>
                            <div className="background"></div>
                            <div id='progressBar' ref={progressBar} onMouseDown={handleProgressBar}>
                                <div id="playbackProgress" ref={playbackProgress}></div>
                            </div>
                            <div className="music-duration">
                                <div>
                                    <span id="minutes">{durationValue.minutes}</span>
                                    :
                                    <span id="seconds">{durationValue.seconds}</span>
                                </div>
                                <div>
                                    <span id="duration" ref={totalDuration}>00:00</span> 
                                </div>
                            </div>
                            <div className='controlers'>
                                <div id="loopBtn" onClick={handleLoop}>
                                    { loopType === LoopType.One ? 
                                        <MdOutlineRepeatOne className='active'/> : 
                                        <MdOutlineRepeat className={ loopType === LoopType.All ? 'active' : ''}/>
                                    } 
                                </div>
                                <div id="prevBtn" className={activePrev ? 'activeControl' : ''} onClick={() => nextPrevBtn('prev')}>
                                    <BiSkipPrevious />
                                </div>
                                <div id="playBtn" onClick={onClickPlay}>
                                    {isPlaying ? <BsPauseFill/> : <BsFillPlayFill/>}
                                </div>
                                <div id="nextBtn" className={activeNext ? 'activeControl' : ''} onClick={() => nextPrevBtn('next')}>
                                    <BiSkipNext />
                                </div>
                            
                                <div id="volumeBtn" ref={volume} onWheel={handleVolumeWheel}>
                                    {volumeValue > 0 ? 
                                        <div onClick={onClickVolume} style={{position: 'relative', zIndex: 2}}>
                                            <BsFillVolumeUpFill />
                                        </div>
                                    : 
                                    <div onClick={onClickVolume} style={{position: 'relative', zIndex: 2}}>
                                        <BsFillVolumeMuteFill />
                                    </div>
                                    }
                                    <div className={`volumeProgress ${isActiveVolume ? 'volumeActive' : ''}`}>
                                        <div className="volume-overlay">
                                            <div 
                                                id="lines" 
                                                ref={volumeBar} 
                                                onMouseDown={onMouseDownVolume} 
                                                onMouseUp={onMouseUpVolume}
                                                onMouseMove={onDragVolume}
                                            >
                                                <div id="volumeBar">
                                                </div>
                                                <div id="volumeValue" style={{width: volumeValue}}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='player__mobile' onClick={openPlayer} ref={playerMobile}>
                        <div className='player__mobile--thumb'>
                            <img src={currentMusic.audioThumb} alt="" />
                        </div>
                        <div className='player__mobile--name'>
                            <div>{currentMusic.name}</div> 
                            <div>{currentMusic.authorName}</div>
                        </div>
                        <div id="playBtn" className='player__mobile--play' ref={mobilePlayBtn}>
                            {isPlaying ? <BsPauseFill onClick={onClickPlay} /> : <BsFillPlayFill onClick={onClickPlay}/>}
                        </div>
                    </div>
                </div>
                 : ''
                
            }
        </div>
    );

   
}

export default Player;