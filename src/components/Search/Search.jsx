import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChevronLeft, BsChevronRight, BsXLg } from 'react-icons/bs';
import { setLoadingAction } from '../../actions/loading.action';
import {
  setCurrentMusicAction,
  setQueueItemAction
} from '../../actions/queue.action';
import { setSearchTypingAction } from '../../actions/search.action';
import { useAppDispatch } from '../../hooks';
import { search } from '../../services';
import musicService from '../../services/music.service';
import './Search.scss';
function Search() {
  const [searchKey, setSearchKey] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [numberOrder, setNumberOrder] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const dispatch = useAppDispatch();
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
    setHeightSearch();
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

  const addQueueList = async (element) => {
    const data = handleVideoInfo(element);
    if (!data.youtubeId) return;
    const music = await musicService.getMusic(data.youtubeId);
    if (
      !music ||
      !music.result ||
      !music.result.queueList ||
      !music.result.currentMusic
    ) {
      return;
    }
    dispatch(setQueueItemAction(music.result.queueList));
    dispatch(setCurrentMusicAction(music.result.currentMusic));
  };

  const handleVideoInfo = (data) => {
    return {
      audioThumb: `https://img.youtube.com/vi/${data.id.videoId}/0.jpg`,
      authorName: data.snippet.channelTitle,
      name: data.snippet.title,
      youtubeId: data.id.videoId
    };
  };

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
                className="search__list--item"
                key={i}
                onClick={() => addQueueList(element)}
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
    </div>
  );
}

export default Search;
