import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChevronLeft, BsChevronRight, BsXLg } from 'react-icons/bs';
import { playlistStore, useAppDispatch, useAppSelector, useOutside } from '../../hooks';
import { setLoadingAction } from '../../reducers/loading.reducer';
import { setPlaylistAction, setSongsPlaylistAction } from '../../reducers/queue.reducer';
import { setSearchTypingAction } from '../../reducers/search.reducer';
import { search } from '../../services';
import musicService from '../../services/music.service';
import MenuPlaylist from '../Popup/MenuPlaylist';
import Playlist from '../Popup/Playlist';
import Toast from '../Toast/Toast';
import './Search.scss';
function Search() {
  const [searchKey, setSearchKey] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [numberOrder, setNumberOrder] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [contentMenuStyle, setContentMenuStyle] = useState({
    display: 'none',
    position: 'absolute', 
    left: 0,
    top: 0
  });
  const [toast, setToast] = useState({
    isShow: false,
    status: false,
    message: ''
  });
  const [songInfoActive, setSongInfoActive] = useState(null);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);
  const menuPlaylist = useRef(null);
  useOutside(
    menuPlaylist,
    useCallback(() => setOpenMenu(false), [])
  );
  const [playlist, setPlaylist] = useState([]);
  const dispatch = useAppDispatch();
  const queue = useAppSelector(playlistStore);

  useEffect(() => {
    let timeOutSetHeight = null;
    let timeIntervalHeight = null;
    const setHeightSearch = () => {
      timeOutSetHeight = setTimeout(() => {
        const player = document.getElementsByClassName('player');
        const searchList = document.getElementsByClassName('search__list');
        const header = document.getElementsByClassName('header');
        if (!player || !searchList || !header) {
          return;
        }
        const windowWidth = window.screen.width;
        if (windowWidth <= 1024) {
          timeIntervalHeight = setInterval(() => {
            const height =
              window.innerHeight -
              searchList[0].offsetTop -
              player[0].offsetHeight -
              header[0].offsetHeight +
              'px';
            searchList[0].style.height = height;
          }, 3000);
          return;
        }
        searchList[0].style.height =
          window.innerHeight -
          searchList[0].offsetTop -
          player[0].offsetHeight +
          'px';
      }, 2000);
    };
    const getPlaylist = async () => {
      const loading = false;
      let response = await musicService.getPlaylist(loading);
      if (!response || !response.result || !response.result.playlist) return;
      setPlaylist(response.result.playlist);
    };
    setHeightSearch();
    getPlaylist();
    return () => {
      clearTimeout(timeOutSetHeight);
      clearInterval(timeIntervalHeight);
    };
  }, []);
  const onSearch = async (event) => {
    event.preventDefault();
    if (!searchKey) return;
    setNumberOrder(0);
    setItemsPerPage(1);
    setTimeout(() => {
      dispatch(
        setLoadingAction({ isLoading: true, content: 'Đang tìm kiếm...' })
      );
    }, 1);
    const response = await search(searchKey);
    setSearchState(response);
    // if (typing.current) clearTimeout(typing.current);
    // typing.current = setTimeout(async() => {
    //
    // }, 500);
  };

  const searchKeyChange = (event) => {
    setSearchKey(event.target.value);
  };

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
    setSearchData(result.items);
    result.nextPageToken
      ? setNextPageToken(result.nextPageToken)
      : setNextPageToken('');
    result.prevPageToken
      ? setPrevPageToken(result.prevPageToken)
      : setPrevPageToken('');
    setItemsPerPage(result.pageInfo.resultsPerPage);
  };

  const next = async () => {
    const response = await search(searchKey, nextPageToken);
    setNumberOrder(numberOrder + 1);
    setSearchState(response);
  };

  const prev = async () => {
    if (numberOrder === 0) return;
    const response = await search(searchKey, prevPageToken);
    setNumberOrder(numberOrder - 1);
    console.log(response);
    setSearchState(response);
  };

  const clearSearch = () => {
    setSearchKey('');
    setSearchData([]);
    setNextPageToken('');
    setPrevPageToken('');
    setNumberOrder(0);
    setItemsPerPage(1);
  };

  const formatNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
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

  const openPlaylist = () => {
    setOpenMenu(false);
    setIsOpenPlaylist(true);
  }

  const playNow = async (queueListId, res) => {
    const youtubeId = songInfoActive && songInfoActive.contentDetails && songInfoActive.contentDetails.videoId ||
    songInfoActive && songInfoActive.id && songInfoActive.id.videoId;
    const playlistId = res && (res._id || res.playlistId);
    if (!res || !res.playlistName || !playlistId || !res.list || !res.currentMusic ||
      !youtubeId) return;
      setOpenMenu(false);
    setSongInfoActive(null);
    if (queueListId !== queue.playlistId) {
      await musicService.updateCurrentPlaylist(queueListId);
    }
    const list = res.list;
    const playlistName = res.playlistName;
    const findIndex = list.length && list.findIndex(item => item.youtubeId === youtubeId);
    const currentMusic = list.length && list[findIndex];
    await musicService.updateCurrentMusic(currentMusic.youtubeId, queueListId);
    const playlist = {
      list,
      currentMusic,
      playlistName,
      playlistId
    };
    dispatch(setPlaylistAction(playlist));
  }

  const closePlaylist = (playlistId, playlist) => {
    setIsOpenPlaylist(false);
    setSongInfoActive(null);
    if (!playlistId || !queue || !queue.playlistId || !queue.list) return;
    if (queue.playlistId !== playlistId) return;
    dispatch(setSongsPlaylistAction(playlist))
  }

  const showToast = (status, message) => {
    setToast({
      isShow: true,
      status,
      message
    });
  }

  return (
    <div className="search">
      <div className="search__header">
        <div className="search__header--pagination">
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
        <div className="search__header--input">
          <form onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Youtube search..."
              value={searchKey}
              onChange={searchKeyChange}
              onFocus={() => dispatch(setSearchTypingAction(true))}
              onBlur={() => dispatch(setSearchTypingAction(false))}
            />
          </form>
          {searchKey ? (
            <span
              className="clear"
              style={{ cursor: 'pointer' }}
              onClick={clearSearch}
            >
              <BsXLg />
            </span>
          ) : (
            <span className="clear">
              <BiSearch />
            </span>
          )}
        </div>
      </div>
      <div className="search__list">
        {searchData &&
          searchData.map((element, i) => {
            return (
              <div
                className={`search__list--item ${songInfoActive && songInfoActive.id === element.id ? 'active-click' : ''}`}
                key={i}
                onClick={(event) => addQueueList(event, element)}
              >
                <div>
                  <div className="search__list--item--icon">
                    {numberOrder > 0
                      ? formatNumber(numberOrder * itemsPerPage + i + 1)
                      : formatNumber(i + 1)}
                  </div>
                  <div className="search__list--item--thumb">
                    <img
                      src={element.snippet.thumbnails.high.url}
                      alt={element.snippet.channelTitle}
                    />
                  </div>
                  <div className="search__list--item--name">
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

export default Search;
