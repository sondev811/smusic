import ColorThief from "colorthief";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { currentMusicStore, playlistStore, useAppDispatch, useAppSelector } from '../../hooks';
import { setLoadingAction, setLoadingDoneAction } from "../../reducers/loading.reducer";
import { setPlaylistAction } from "../../reducers/queue.reducer";
import { musicService } from '../../services/music.service';
import { rgba } from '../../utils/general';
import ListItem from '../ListItem/ListItem';
import './PlaylistDetail.scss';

function PlaylistDetail(props) {
  let { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [color, setColor] = useState('rgba(87, 64, 101, 0.8)');
  const [colorBlending, setColorBlending] = useState('rgba(87, 64, 101, 0.8)');
  const currentSong = useAppSelector(currentMusicStore);
  const queues = useAppSelector(playlistStore);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getPlayListDetail = async () => {
      if (!id) return;
      const res = await musicService.getPlaylistById(id);
      if (!res || !res.result || !res.result._id) return;
      setPlaylist(res.result);
      if (!res.result.list.length) return;
      const image = `https://img.youtube.com/vi/${res.result.list[0].youtubeId}/mqdefault.jpg`;
      setImageURL(image);
      getColor(image);
    }

    const getColor = (url) => {
        dispatch(setLoadingAction({ content: '' }));
        const src = `https://api.codetabs.com/v1/proxy?quest=${url}`;
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => { 
          const colorThief = new ColorThief();
          const color = colorThief.getColor(image);
          setColor(rgba(color, 0.8));
          setColorBlending(rgba(color, 0.298));
          dispatch(setLoadingDoneAction());
        }
        image.src = src;
    }

    getPlayListDetail();
  }, [id]);

  useEffect(() => {
    const setHeightQueue = () => {
      const player = document.getElementsByClassName('player');
      const trendingList = document.getElementsByClassName('playlist-detail');
      const header = document.getElementsByClassName('header');
      if (!player || !trendingList || !header || 
        !player[0] || !trendingList[0] || !header[0]) {
        return;
      }
      const windowWidth = window.screen.width;
      if (windowWidth <= 1024) {
        const height =
          window.innerHeight -
          trendingList[0].offsetTop -
          player[0].offsetHeight -
          header[0].offsetHeight +
          'px';
        trendingList[0].style.height = height;
        console.log(height);
        return;
      }
      trendingList[0].style.height =
        window.innerHeight -
        trendingList[0].offsetTop -
        player[0].offsetHeight +
        'px';
    };
    setHeightQueue();
  }, [playlist]);
  
  const formatNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  const playSong = async (event, element) => {
    const response = await musicService.updateCurrentPlaylist(playlist._id);
    if (!response || !response.result || !response.result.queue) return;
    const playlistData = response.result.queue;
    if(!playlistData.playlistName || !playlistData._id || !playlistData.list || !playlistData.list.length) return;
    const list = playlistData.list;
    const playlistName = playlistData.playlistName;
    const playlistId = playlistData._id
    await musicService.updateCurrentMusic(element.youtubeId, playlist._id);
    const playlistObj = {
      list,
      currentMusic: element,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlistObj));
  }

  const playAll = async (element) => {
    if (playlist?._id === queues?.playlistId) return;
    const id = element._id;
    if (!id || element.list.length <= 0) return;
    const response = await musicService.updateCurrentPlaylist(id);
    if (!response || !response.result || !response.result.queue) return;
    const playlistData = response.result.queue;
    if(!playlistData.playlistName || !playlistData._id || !playlistData.list || !playlistData.list.length) return;
    const list = playlistData.list;
    const playlistName = playlistData.playlistName;
    const playlistId = playlistData._id
    let currentMusic = playlistData.currentMusic;
    if (!currentMusic && playlistData.list.length) {
      currentMusic = playlistData.list[0];
      await musicService.updateCurrentMusic(currentMusic.youtubeId, id);
    }
    const playlistObj = {
      list,
      currentMusic,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlistObj));
  }

  return (
    <div className='playlist-detail'>
      { playlist ? 
      <div>
        <div className='playlist-detail__info' style={{background: 'rgb(14, 23, 30)'}} >
          <div style={{ background: `linear-gradient(to bottom, ${color} 0%, ${colorBlending} 33%, rgba(15,15,15,1.000) 100%)` }}>
            <div className='playlist-detail__info__image'>
              <img src={imageURL} alt={playlist?.playlistName}/>
            </div>
            <div className='playlist-detail__info__name'>
              { playlist?.playlistName }
            </div>
            <div className='playlist-detail__info__length'>
              { playlist?.list?.length } songs
            </div>
            <div className='playlist-detail__info__playbtn'>
              <button onClick={() => playAll(playlist)} className={`${playlist?._id === queues?.playlistId ? 'disable' : ''}`}>
                { playlist?._id === queues?.playlistId ? 'Playing' : 'Play all'}
              </button>
            </div>
          </div>
        </div>
        <div className='playlist-detail__list'>
          <ListItem 
            listData = {playlist?.list || []} 
            songInfoActive = {currentSong} 
            addQueueList = {playSong} 
            formatNumber= {formatNumber} 
            numberOrder = {10} 
            itemsPerPage = {0}
          />
        </div>
      </div>
      : null } 
    </div>
  );
}

export default PlaylistDetail;