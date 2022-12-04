import ColorThief from "colorthief";
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { CgPlayListRemove } from 'react-icons/cg';
import { HiMenuAlt4 } from 'react-icons/hi';
import { MdModeEdit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { currentMusicStore, playlistStore, useAppDispatch, useAppSelector } from '../../hooks';
import { setLoadingAction, setLoadingDoneAction } from "../../reducers/loading.reducer";
import { setPlaylistAction, setSongsPlaylistAction } from "../../reducers/queue.reducer";
import { musicService } from '../../services/music.service';
import { rgba } from '../../utils/general';
import '../Queue/Queue.scss';
import './PlaylistDetail.scss';

function PlaylistDetail(props) {
  let { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [color, setColor] = useState('rgba(87, 64, 101, 0.8)');
  const [colorBlending, setColorBlending] = useState('rgba(87, 64, 101, 0.8)');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const [playlistName, setPlaylistName] = useState('');
  const currentSong = useAppSelector(currentMusicStore);
  const queues = useAppSelector(playlistStore);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    setPlaylistName(playlist?.playlistName || '');
  }, [playlist]);

  const getPlayListDetail = async (loading = true) => {
    if (!id) return;
    const res = await musicService.getPlaylistById(id, loading);
    if (!res || !res.result || !res.result._id) return;
    setPlaylist(res.result);
    if (!res.result.list.length) return;
    const image = `https://img.youtube.com/vi/${res.result.list[0].youtubeId}/mqdefault.jpg`;
    setImageURL(image);
    getColor(image);
  }

  const getColor = (url, loading) => {
    if (loading) {
      dispatch(setLoadingAction({ content: '' }));
    }
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

  const playSong = async (element) => {
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
      await musicService.playSong(currentMusic.youtubeId, id);
    }
    const playlistObj = {
      list,
      currentMusic,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlistObj));
  }
  
  useEffect(() => {
    inputRef?.current?.focus();
  }, [editing]);

  const onChangePlaylistName = async (event) => {
    event.preventDefault();
    setEditing(false);
    const playlistId = playlist._id;
    const body = {
      playlistName,
      playlistId
    }
    await musicService.editPlaylistName(body);
  }

  const removeItem = async (music) => {
    if (!music._id || !playlist || !playlist._id) return;
    const response = await musicService.removeItemPlaylist(music._id, playlist._id);
    if (!response || !response.result || !response.result.queue || !response.result.queue.list) {
      toast.error('Xóa bài hát khỏi hàng chờ không thành công!!!');
      return;
    }
    toast.success('Đã xóa bài hát khỏi hàng chờ!!!');
    getPlayListDetail();
  };

  const handleDragEnd = async (data) => {
    if (!data.destination || !playlist || !playlist._id) return;
    const dragItemSource = playlist.list[data.source.index];
    const dragItemDestination = playlist.list[data.destination.index];
    if (dragItemSource.youtubeId === dragItemDestination.youtubeId) return;
    let items = playlist.list.filter((item) => item !== dragItemSource);
    items.splice(data.destination.index, 0, dragItemSource);
    const body = {
      sourceIndex: data.source.index,
      destinationIndex: data.destination.index,
      playlistId: playlist._id
    };
    playlist.list = items;
    setPlaylist(playlist);
    if (playlist?._id === queues?.playlistId) {
      dispatch(setSongsPlaylistAction(items));
    }
    await musicService.updateQueueList(body);
    getPlayListDetail(false);
  };

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
              {
                editing ?
                  <form onSubmit={onChangePlaylistName}>
                    <input type="text" ref={inputRef} value={playlistName} placeholder="" 
                      onChange={(event) => setPlaylistName(event.target.value)} 
                      onBlur={onChangePlaylistName} 
                    /> 
                  </form>
                : <>
                  <p>{ playlistName }</p><span onClick={() => setEditing(true)}><MdModeEdit/></span>
                </>
              }
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
          <div className="queue">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="playlist">
                {(provided) => (
                  <div
                    className="queue__list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {playlist && playlist.list &&
                      playlist.list.length > 0 &&
                      playlist.list.map((element, i) => {
                        return (
                          <Draggable
                            key={element && element.youtubeId}
                            draggableId={element && element.youtubeId}
                            index={i}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={
                                  element &&
                                  element.youtubeId &&
                                  currentSong.youtubeId === element.youtubeId
                                    ? 'playing'
                                    : ''
                                }
                              >
                                <div className={`queue__list--item `}>
                                  <div className={`queue__list--item--icon`}>
                                    <span style={{padding: 0}}>
                                      <HiMenuAlt4 />
                                    </span>
                                  </div>
                                  <div
                                    className="queue__list--item--thumb"
                                    onClick={() => playSong(element)}
                                  >
                                    <img src={element.audioThumb} alt="" />
                                  </div>
                                  <div
                                    onClick={() => playSong(element)}
                                    className={`queue__list--item--name ${
                                      element.youtubeId &&
                                      currentSong.youtubeId === element.youtubeId
                                        ? 'playing'
                                        : ''
                                    }`}
                                  >
                                    <div>{element.name}</div>
                                    <div>{element.authorName}</div>
                                  </div>
                                </div>
                                <div className="queue__list--remove">
                                  <CgPlayListRemove
                                    className={
                                      element.youtubeId &&
                                      currentSong.youtubeId === element.youtubeId
                                        ? 'non-remove'
                                        : ''
                                    }
                                    onClick={() => removeItem(element)}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
      : null } 
    </div>
  );
}

export default PlaylistDetail;