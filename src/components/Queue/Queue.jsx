import React, { useEffect, useState } from 'react';
import { BsFillPlayFill } from "react-icons/bs";
import { CgPlayListRemove } from "react-icons/cg";
import { MdDownload } from "react-icons/md";
import { setLoadingAction } from '../../actions/loading.action';
import { setCurrentMusicAction, setQueueItemAction } from '../../actions/queue.action';
import { currentMusicStore, playerStore, queuesStore } from '../../features';
import { useAppDispatch, useAppSelector } from '../../hooks';
import musicService from '../../services/music.service';
import './Queue.scss';
function Queue(props) {
    const queues = useAppSelector(queuesStore);
    const currentMusic = useAppSelector(currentMusicStore);
    const dispatch = useAppDispatch();
    const [isGetQueue, setIsGetQueue] = useState(false);
    const isOpenPlayer = useAppSelector(playerStore);
    useEffect(() => {
        const getQueueList = async () => {
            dispatch(setLoadingAction({isLoading: true}));
            let response = await musicService.getQueueList();
            dispatch(setLoadingAction({isLoading: false}));
            if (!response || !response.result) return;
            response.result.queue.forEach(element => {
                if (!element.ggDriveId) {
                    setIsGetQueue(true);
                }
            });
            dispatch(setQueueItemAction(response.result.queue));
        }
        getQueueList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        let interval = null;
        const getQueueList = async () => {
            let response = await musicService.getQueueList();
            if (!response || !response.result) return;
            const data = response.result.queue.filter(item => !item.ggDriveId);
            if (!data.length) {
                setIsGetQueue(false);
                dispatch(setQueueItemAction(response.result.queue));
            }
        }
        
        if (isGetQueue) {
            interval = setInterval(() => {
                getQueueList();
            }, 30000);
        }
        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGetQueue]);

    const updateCurrentMusic = async(music) => {
        if (currentMusic._id === music._id) {
            return;
        }
        dispatch(setLoadingAction({isLoading: true}));
        await musicService.updateCurrentMusic(music.youtubeId);
        dispatch(setLoadingAction({isLoading: false}));
        dispatch(setCurrentMusicAction(music));
    }

    const removeItem = async(music) => {
        dispatch(setLoadingAction({isLoading: true}));
        const response = await musicService.removeItemQueue(music._id);
        dispatch(setLoadingAction({isLoading: false}));
        if (!response || !response.result || !response.result.queue) {
            return;
        }
        dispatch(setQueueItemAction(response.result.queue));
    }

    return (
        <div className='queue'>
            <div className='queue__header'>
                <h3>Hàng đợi ({queues.length})</h3>
            </div>
            <div className={`queue__list ${isOpenPlayer ? 'active-mobile-queue' : ''}`}>
                {  queues && queues.map((element, i) => {
                    return(
                    <div key={i}>
                        <div className={`queue__list--item ${!element.ggDriveId ? 'downloading' : ''}`} >
                            <div className={`queue__list--item--icon ${element.ggDriveId && currentMusic.ggDriveId === element.ggDriveId ? 'playing' : ''}`}>
                                <span className='play-icon' onClick={() => updateCurrentMusic(element)}>{<BsFillPlayFill/>}</span>
                                <img className='image-play' src={process.env.PUBLIC_URL + 'equaliser-animated-green.f93a2ef4.gif'} alt='play-icon' />
                                <img className='image-loading' src={process.env.PUBLIC_URL + 'loading.gif'} alt='play-icon' />
                            </div>
                            <div className='queue__list--item--thumb' onClick={() => updateCurrentMusic(element)}><img src={element.audioThumb} alt="" /></div>
                            <div onClick={() => updateCurrentMusic(element)} className={`queue__list--item--name ${element.ggDriveId && currentMusic.ggDriveId === element.ggDriveId ? 'playing' : ''}`}>
                                <div>{element.name}</div> 
                                <div>{element.authorName}</div>
                            </div>
                        </div>
                        <div className='queue__list--remove'>   
                            <CgPlayListRemove className={element.ggDriveId && currentMusic.ggDriveId === element.ggDriveId ? 'non-remove' : ''} onClick={() => removeItem(element)}/>
                            <a className={!element.ggDriveId ? 'non-remove' : ''} href={`http://docs.google.com/uc?export=download&id=${element.ggDriveId}`}><MdDownload/></a> 
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Queue;