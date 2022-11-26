import React from 'react';
import { playlistStore, useAppSelector, userStore } from '../../hooks';
import { musicService } from '../../services/music.service';
import "./Popup.scss";
function MenuPlaylist(props) {
  const { contentMenuStyle, openPlaylist, menuPlaylist, musicInfo, playNow } = props;
  const user = useAppSelector(userStore);
  const queue = useAppSelector(playlistStore);
  const onPlay = async () => {
    const youtubeId = musicInfo && musicInfo.contentDetails && musicInfo.contentDetails.videoId ||
    musicInfo && musicInfo.id && musicInfo.id.videoId;
    if (!youtubeId || !user || !user.queueListId) return;
    const findIndex = queue && queue.list && queue.list.length && 
      queue.list.findIndex(item => item.youtubeId === youtubeId);
    let res = queue;
    if (findIndex < 0 || queue.playlistId !== user.queueListId) {
      const response = await musicService.insertSongPlaylist(user.queueListId, youtubeId);
      if (response && response.status && response.result && response.result.playlist) {
        res = response.result.playlist
      }
    }
    playNow(user.queueListId, res);
  }
  return (
    <div ref={menuPlaylist} className='popup__menu' style={contentMenuStyle}>
        <div onClick={() => onPlay()}>Phát ngay</div>
        <div onClick={() => openPlaylist()}>Thêm vào playlist</div>
    </div>
  );
}

export default MenuPlaylist;