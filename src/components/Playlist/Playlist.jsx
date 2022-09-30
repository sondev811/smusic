import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiPlusCircle } from 'react-icons/bi';
import { CgPlayListRemove } from 'react-icons/cg';
import { playlistStore, useAppDispatch, useAppSelector, userStore } from '../../hooks';
import { setPlaylistAction } from '../../reducers/queue.reducer';
import musicService from '../../services/music.service';
import Toast from '../Toast/Toast';
import './Playlist.scss';

function Playlist() {
  const queues = useAppSelector(playlistStore);
  const user = useAppSelector(userStore);
  const dispatch = useAppDispatch();
  const [toast, setToast] = useState({
    isShow: false,
    status: false,
    message: ''
  });
  const [playlist, setPlaylist] = useState([]);
  const [isAddPlaylist, setIsAddPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  useEffect(() => {
    getPlaylist();
  }, []);

  useEffect(() => {
    const setHeightQueue = () => {
      const player = document.getElementsByClassName('player');
      const queueList = document.getElementsByClassName('queue__list');
      const header = document.getElementsByClassName('header');
      if (!player || !queueList || !header ||
        !player[0] || !queueList[0] || !header[0] ) {
        return;
      }
      const windowWidth = window.screen.width;
      if (windowWidth <= 1024) {
        const height =
          window.innerHeight -
          queueList[0].offsetTop -
          player[0].offsetHeight -
          header[0].offsetHeight +
          'px';
        queueList[0].style.height = height;
        return;
      }
      queueList[0].style.height =
        window.innerHeight -
        queueList[0].offsetTop -
        player[0].offsetHeight +
        'px';
    };
    setHeightQueue();
  }, [queues, playlist]);

  const getPlaylist = async () => {
    let response = await musicService.getPlaylist();
    if (!response || !response.result || !response.result.playlist) return;
    setPlaylist(response.result.playlist);
  };

  const removeItem = async (element) => {
    if (!element._id) return;
    const response = await musicService.removePlaylist(element._id);
    if (!response || !response.status) {
      setToast({
        isShow: true,
        status: false,
        message: `Xóa playlist ${element.playlistName} không thành công!!!`
      });
      return;
    }
    setToast({
      isShow: true,
      status: true,
      message: `Xóa playlist ${element.playlistName} thành công!!!`
    });
    getPlaylist();
  };

  const getSongFromPlaylist = async (element) => {
    const id = element._id;
    if (!queues || !queues.playlistId || !id || queues.playlistId === id || element.list.length <= 0) return;
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
    const playlist = {
      list,
      currentMusic,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlist));
  }

  const addPlaylist = async () => {
    if (!playlistName) return;
    const result = await musicService.createPlaylist(playlistName);
    setIsAddPlaylist(false);
    if (!result || !result.status) {
      setToast({
        isShow: true,
        status: true,
        message: `Đã thêm playlist ${playlistName}`
      });
      return;
    }
    getPlaylist();
    setToast({
      isShow: true,
      status: true,
      message: `Đã thêm playlist ${playlistName}`
    });
  }

  const openAdd = useCallback(() => {
    setIsAddPlaylist(true)
  }, [])

  return (
    <div className="playlist">
      <div className="playlist__header">
        <div>
          <h3>
            Playlist
          </h3>
        </div>
        <div style={{ display: 'flex' }}>
          <BiPlusCircle onClick={() => openAdd()}/>
        </div>
      </div>
      <div className="playlist__list">
        {playlist &&
          playlist.map((element, i) => {
            return (
              <div key={i} className={ queues && queues.playlistId && 
                queues.playlistId === element._id ? 'playing' : ''}>
                <div className={`playlist__list--item `} onClick={() => getSongFromPlaylist(element)}>
                  <div>{element.playlistName}({element.list.length})</div>
                </div>
                <div className={`playlist__list--remove ${user && 
                  user.queueListId && user.queueListId === element._id ? 'disable-delete' : ''}`}>
                  <CgPlayListRemove onClick={() => removeItem(element)} />
                </div>
              </div>
            );
          })}
      </div>
      { isAddPlaylist && 
        <div className='playlist__add'>
          <div>
            <h3>Thêm playlist</h3>
            <span onClick={() => setIsAddPlaylist(false)}><AiOutlineClose /></span>
            <input
              type="text"
              name="add-playlist"
              placeholder="Tên playlist"
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button className={ playlistName ? 'active-btn' : ''} onClick={() => addPlaylist()}>Lưu</button>
          </div>
        </div> 
      }
      {toast.isShow && (
        <Toast
          isShow={toast.isShow}
          status={toast.status}
          message={toast.message}
        />
      )}
    </div>
  );
}

export default Playlist;