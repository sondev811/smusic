import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import musicService from '../../services/music.service';
import { toast } from "react-toastify";
import "./Popup.scss";

function Playlist(props) {
  const { playlist, closePlaylist, musicInfo } = props;
  const addToPlaylist = async(id) => {
    const youtubeId = musicInfo && musicInfo.contentDetails && musicInfo.contentDetails.videoId ||
    musicInfo && musicInfo.id && musicInfo.id.videoId;
    if (!youtubeId || !id) return;
    const res = await musicService.insertSongPlaylist(id, youtubeId);
    if (!res || !res.result || !res.status) {
      toast.error('Thêm bài hát vào playlist thất bại.');
      closePlaylist();
      return;
    }
    toast.success('Đã thêm bài hát vào playlist.');
    closePlaylist(id, res.result.playlist.list);
  }
  return (
    <div className='popup__playlist'>
      <div>
        <h3>Thêm vào playlist</h3>
        <span className='popup__playlist--close' onClick={() => closePlaylist()}><AiOutlineClose /></span>
        <div className='popup__playlist--data'>
          {
            playlist && playlist.length && playlist.map((element) => {
              return(
                <div key={element._id} onClick={() => addToPlaylist(element._id)}>{element.playlistName}</div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default Playlist;