import React, { useEffect, useState } from 'react';
import { MdPlaylistAdd } from "react-icons/md";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { getTrending } from '../../services';
import './Home.scss';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setLoadingAction } from '../../actions/loading.action';
import { playerStore, queuesStore } from '../../features';
import { setQueueItemAction } from '../../actions/queue.action';
import musicService from '../../services/music.service';

function Home(props) {
    const [trendingData, setTrendingData] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [prevPageToken, setPrevPageToken] = useState('');
    const [numberOrder, setNumberOrder] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const dispatch = useAppDispatch();
    const queueListStore = useAppSelector(queuesStore);
    const isOpenPlayer = useAppSelector(playerStore);
    useEffect(() => {
        const getTrendingYoutube = async () => {
            const response = await getTrending();
            setSearchState(response);
        }
        getTrendingYoutube();
    }, [])

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
        if (queueListStore.find(item => item.youtubeId === data.youtubeId)) {
            return;
        }
        const queueListTemp = [...queueListStore, data];
        dispatch(setQueueItemAction(queueListTemp));
        dispatch(setLoadingAction({isLoading: true}));
        const music = await musicService.getMusic(data.youtubeId);
        dispatch(setLoadingAction({isLoading: false}));
        dispatch(setQueueItemAction(music.result.queueList));    
    }

    const handleVideoInfo = (data) => {
        return {
            audioThumb: `https://img.youtube.com/vi/${data.contentDetails.videoId}/0.jpg`,
            authorName: data.snippet.videoOwnerChannelTitle,
            ggDriveId: '',
            name: data.snippet.title,
            nameFormatted: '',
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
            <div className={`trending__list ${isOpenPlayer ? 'active-mobile-queue' : ''}`}>
            {  trendingData && trendingData.map((element, i) => {
                return(
                    <div className='trending__list--item' key={i}>
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
                        <div className='trending__list--item--action'>
                            <span onClick={() => addQueueList(element)}><MdPlaylistAdd/></span>
                        </div>
                    </div>
                )})
            }
            </div>
        </div>
    );
}

export default Home;