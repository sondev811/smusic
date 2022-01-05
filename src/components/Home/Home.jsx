import React, { useEffect, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { setLoadingAction } from '../../actions/loading.action';
import { setCurrentMusicAction, setQueueItemAction } from '../../actions/queue.action';
import { useAppDispatch } from '../../hooks';
import { getTrending } from '../../services';
import musicService from '../../services/music.service';
import './Home.scss';

function Home(props) {
    const [trendingData, setTrendingData] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [prevPageToken, setPrevPageToken] = useState('');
    const [numberOrder, setNumberOrder] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        console.log('SMusic version 1.2');
        const getTrendingYoutube = async () => {
            const response = await getTrending();
            setSearchState(response);
        }
        getTrendingYoutube();
    }, [])

    useEffect(() => {
        const setHeightQueue = () => {
            const player = document.getElementsByClassName('player');
            const trendingList = document.getElementsByClassName('trending__list');
            const header = document.getElementsByClassName('header');
            if (!player || !trendingList || !header) {
                return;
            }
            const windownWidth = window.screen.width;
            if (windownWidth <= 1024) {
                const height = window.innerHeight - trendingList[0].offsetTop - player[0].offsetHeight - header[0].offsetHeight + 'px';
                trendingList[0].style.height = height;
                return;
            }
            trendingList[0].style.height = window.innerHeight - trendingList[0].offsetTop - player[0].offsetHeight + 'px';
        }
        setHeightQueue();
    }, [trendingData]);

    const setSearchState = (response) => {
        if (!response || !response.result || !response.result.items || !response.result.items.length) {
            return;
        }
        const result = response.result;
        setTrendingData(result.items);
        result.nextPageToken ? setNextPageToken(result.nextPageToken) : setNextPageToken('');
        result.prevPageToken ? setPrevPageToken(result.prevPageToken) :  setPrevPageToken('');
        setItemsPerPage(result.pageInfo.resultsPerPage);
    }

    const addQueueList = async(element) => {
        const data = handleVideoInfo(element);
        if (!data.youtubeId) return;
        dispatch(setLoadingAction({isLoading: true}));
        const music = await musicService.getMusic(data.youtubeId);
        dispatch(setLoadingAction({isLoading: false}));
        if (!music || !music.result || !music.result.queueList || !music.result.currentMusic) {
            return;
        }
        dispatch(setQueueItemAction(music.result.queueList));    
        dispatch(setCurrentMusicAction(music.result.currentMusic));
    }

    const handleVideoInfo = (data) => {
        return {
            audioThumb: `https://img.youtube.com/vi/${data.contentDetails.videoId}/0.jpg`,
            authorName: data.snippet.videoOwnerChannelTitle,
            name: data.snippet.title,
            youtubeId: data.contentDetails.videoId
        }
    }

    const prev = async() => {
        dispatch(setLoadingAction({isLoading: true}));
        const response = await getTrending(prevPageToken);
        setNumberOrder(numberOrder - 1);
        dispatch(setLoadingAction({isLoading: false}));
        setSearchState(response);
    }

    const next = async() => {
        dispatch(setLoadingAction({isLoading: true}));
        const response = await getTrending(nextPageToken);
        setNumberOrder(numberOrder + 1);
        dispatch(setLoadingAction({isLoading: false}));
        setSearchState(response);
    }

    const formatNumber = (number) => {
        if (number < 10) return `0${number}`;
        return number;
    }
    
    return (
        <div className='trending'>
            <div className='trending__header'>
                <div className='trending__header--pagination'>
                    <span onClick={prev} className={prevPageToken ? 'activePagination' : ''}>
                        <BsChevronLeft/>
                    </span>  
                    <span onClick={next} className={nextPageToken ? 'activePagination' : ''}>
                        <BsChevronRight/>
                    </span> 
                </div>
                <div>
                    <h3>Thịnh hành</h3>
                </div>
            </div>
            <div className='trending__list'>
            {  trendingData && trendingData.map((element, i) => {
                return(
                    <div className='trending__list--item' key={i} onClick={() => addQueueList(element)}>
                        <div>
                            <div className='trending__list--item--icon'>
                                { numberOrder > 0 ? formatNumber(numberOrder * itemsPerPage + i + 1) : formatNumber(i + 1)}
                            </div>
                            <div className='trending__list--item--thumb'>
                                <img src={element.snippet.thumbnails.high.url} alt={element.snippet.channelTitle} />
                            </div>
                            <div className='trending__list--item--name'>
                                <div>{element.snippet.title}</div> 
                                <div>{element.snippet.channelTitle}</div>
                            </div>
                        </div>
                    </div>
                )})
            }
            </div>
        </div>
    );
}

export default Home;