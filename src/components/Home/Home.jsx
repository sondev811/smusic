import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { playlistStore, useAppDispatch, useAppSelector, useOutside } from '../../hooks';
import { setPlaylistAction, setSongsPlaylistAction } from '../../reducers/queue.reducer';
import { getTrending } from '../../services';
import musicService from '../../services/music.service';
import MenuPlaylist from '../Popup/MenuPlaylist';
import Playlist from '../Popup/Playlist';
import Toast from '../Toast/Toast';
import './Home.scss';

function Home() {
  const [trendingData, setTrendingData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [numberOrder, setNumberOrder] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [contentMenuStyle, setContentMenuStyle] = useState({
    display: 'none',
    position: 'absolute', 
    left: 0,
    top: 0
  });
  const [playlist, setPlaylist] = useState([]);
  const [songInfoActive, setSongInfoActive] = useState(null);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    status: false,
    message: ''
  });
  const [isOpenMenu, setOpenMenu] = useState(false);
  const trendingList = useRef(null);
  const menuPlaylist = useRef(null);
  useOutside(
    menuPlaylist,
    useCallback(() => setOpenMenu(false), [])
  );
  const queue = useAppSelector(playlistStore);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTrendingYoutube = async () => {
      const response = await getTrending();
      setSearchState(response);
    };
    const getPlaylist = async () => {
      let response = await musicService.getPlaylist(false);
      if (!response || !response.result || !response.result.playlist) return;
      setPlaylist(response.result.playlist);
    };
    getTrendingYoutube();
    getPlaylist();
  }, []);

  useEffect(() => {
    const setHeightQueue = () => {
      const player = document.getElementsByClassName('player');
      const trendingList = document.getElementsByClassName('trending__list');
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
        return;
      }
      trendingList[0].style.height =
        window.innerHeight -
        trendingList[0].offsetTop -
        player[0].offsetHeight +
        'px';
    };
    setHeightQueue();
  }, [trendingData]);

  const setSearchState = (response) => {
    if (
      !response ||
      !response.result ||
      !response.result.items ||
      !response.result.items.length
    ) {
      return;
    }
    const result = response.result;
    setTrendingData(result.items);
    result.nextPageToken
      ? setNextPageToken(result.nextPageToken)
      : setNextPageToken('');
    result.prevPageToken
      ? setPrevPageToken(result.prevPageToken)
      : setPrevPageToken('');
    setItemsPerPage(result.pageInfo.resultsPerPage);
  };

  const addQueueList = async (e, element) => {
    setSongInfoActive(element);
    setOpenMenu(true);
    const menuStyle = setPosition(e);
    setContentMenuStyle(menuStyle);
  };

  const setPosition = (e) => {
    const haftScreenWidth = window.screen.width / 2;
    const haftScreenHeight = window.screen.height / 2;
    const menuStyle = {
      display: 'block',
      position: 'absolute', 
    }
    if (window.screen.width <= 1024) {
      if (e.pageX <= haftScreenWidth && e.pageY <= haftScreenHeight) {
        menuStyle.left = e.pageX;
        menuStyle.top = e.pageY;
      } else if (e.pageX > haftScreenWidth && e.pageY > haftScreenHeight) {
        menuStyle.right = window.screen.width - e.pageX;
        menuStyle.bottom = window.screen.height - e.pageY;
      } else if (e.pageX >= haftScreenWidth && e.pageY <= haftScreenHeight) {
        menuStyle.right = window.screen.width - e.pageX;
        menuStyle.top = e.pageY;
      } else if (e.pageX <= haftScreenWidth && e.pageY >= haftScreenHeight) {
        menuStyle.left = e.pageX;
        menuStyle.bottom = window.screen.height - e.pageY;
      }
      return menuStyle;
    }
    const header = document.getElementsByClassName('header');
    const player = document.getElementsByClassName('player__desktop'); 
    if (e.pageX <= haftScreenWidth && e.pageY <= haftScreenHeight) {
      menuStyle.left = e.pageX - header[0].offsetWidth;
      menuStyle.top = e.pageY - header[0].offsetTop;
    } else if (e.pageX > haftScreenWidth && e.pageY > haftScreenHeight) {
      menuStyle.right = window.screen.width - e.pageX;
      menuStyle.bottom = window.screen.height - e.pageY - player[0].offsetHeight - 30;
    } else if (e.pageX >= haftScreenWidth && e.pageY <= haftScreenHeight) {
      menuStyle.right = window.screen.width - e.pageX;
      menuStyle.top = e.pageY;
    } else if (e.pageX <= haftScreenWidth && e.pageY >= haftScreenHeight) {
      menuStyle.left = e.pageX - header[0].offsetWidth;
      menuStyle.bottom = window.screen.height - e.pageY - player[0].offsetHeight - 30;
    }
    return menuStyle;
  }

  const prev = async () => {
    const response = await getTrending(prevPageToken);
    setNumberOrder(numberOrder - 1);
    setSearchState(response);
  };

  const next = async () => {
    const response = await getTrending(nextPageToken);
    setNumberOrder(numberOrder + 1);
    setSearchState(response);
  };

  const formatNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  }; 

  const closePlaylist = (playlistId, playlist) => {
    setIsOpenPlaylist(false);
    setSongInfoActive(null);
    if (!playlistId || !queue || !queue.playlistId || !queue.list) return;
    if (queue.playlistId !== playlistId) return;
    dispatch(setSongsPlaylistAction(playlist))
  }

  const playNow = async (queueListId, res) => {
    const playlistId = res && (res._id || res.playlistId);
    if (!res || !res.playlistName || !playlistId || !res.list || !res.currentMusic ||
      !songInfoActive || !songInfoActive.contentDetails || !songInfoActive.contentDetails.videoId) return;
      setOpenMenu(false);
    setSongInfoActive(null);
    if (queueListId !== queue.playlistId) {
      await musicService.updateCurrentPlaylist(queueListId, false);
    }
    const list = res.list;
    const playlistName = res.playlistName;
    const musicId = songInfoActive.contentDetails.videoId;
    const findIndex = list.length && list.findIndex(item => item.youtubeId === musicId);
    const currentMusic = list.length && list[findIndex];
    await musicService.updateCurrentMusic(currentMusic.youtubeId, queueListId, false);
    const playlist = {
      list,
      currentMusic,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlist));
  }

  const openPlaylist = () => {
    setOpenMenu(false);
    setIsOpenPlaylist(true);
  }

  const showToast = (status, message) => {
    setToast({
      isShow: true,
      status,
      message
    });
  }

  return (
    <div className="trending">
      <div className="trending__header">
        <div className="trending__header--pagination">
          <span
            onClick={prev}
            className={prevPageToken ? 'activePagination' : ''}
          >
            <BsChevronLeft />
          </span>
          <span
            onClick={next}
            className={nextPageToken ? 'activePagination' : ''}
          >
            <BsChevronRight />
          </span>
        </div>
        <div>
          <h3>Thịnh hành</h3>
        </div>
      </div>
      <div id="trending-list" style={{position: 'relative'}} className="trending__list" ref={trendingList}>
        {trendingData &&
          trendingData.map((element, i) => {
            return (
              <div
                className={`trending__list--item ${songInfoActive && songInfoActive.id === element.id ? 'active-click' : ''}`}
                key={i}
                onClick={(event) => addQueueList(event, element)}
              >
                <div>
                  <div className="trending__list--item--icon">
                    {numberOrder > 0
                      ? formatNumber(numberOrder * itemsPerPage + i + 1)
                      : formatNumber(i + 1)}
                  </div>
                  <div className="trending__list--item--thumb">
                    <img
                      src={element.snippet.thumbnails.high.url}
                      alt={element.snippet.channelTitle}
                    />
                  </div>
                  <div className="trending__list--item--name">
                    <div>{element.snippet.title}</div>
                    <div>{element.snippet.channelTitle}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      { isOpenMenu && <MenuPlaylist menuPlaylist={menuPlaylist} contentMenuStyle={contentMenuStyle} 
        openPlaylist={openPlaylist} musicInfo={songInfoActive} playNow={playNow}/>}
      { isOpenPlaylist && <Playlist playlist={playlist} closePlaylist={closePlaylist} 
        musicInfo={songInfoActive} showToast={showToast}
      />}
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

export default Home;
