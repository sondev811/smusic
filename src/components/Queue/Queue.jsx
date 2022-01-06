import React, { useEffect, useRef, useState } from 'react';
import { BsFillPlayFill } from "react-icons/bs";
import { CgPlayListRemove } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { setLoadingAction } from '../../actions/loading.action';
import { setCurrentMusicAction, setQueueItemAction } from '../../actions/queue.action';
import { currentMusicStore, playerStore, queuesStore } from '../../features';
import { useAppDispatch, useAppSelector } from '../../hooks';
import musicService from '../../services/music.service';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Queue.scss';
function Queue(props) {
    const queues = useAppSelector(queuesStore);
    const currentMusic = useAppSelector(currentMusicStore);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const getQueueList = async () => {
            dispatch(setLoadingAction({isLoading: true}));
            let response = await musicService.getQueueList();
            dispatch(setLoadingAction({isLoading: false}));
            if (!response || !response.result || !response.result.queue) return;
            dispatch(setQueueItemAction(response.result.queue));
        }
        getQueueList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const setHeightQueue = () => {
            const player = document.getElementsByClassName('player');
            const queueList = document.getElementsByClassName('queue__list');
            const header = document.getElementsByClassName('header');
            if (!player || !queueList || !header || !queueList.length) {
                return;
            }
            const windowWidth = window.screen.width;
            if (windowWidth <= 1024) {
                const height = window.innerHeight - queueList[0].offsetTop - player[0].offsetHeight - header[0].offsetHeight + 'px';
                queueList[0].style.height = height;
                return;
            }
            queueList[0].style.height = window.innerHeight - queueList[0].offsetTop - player[0].offsetHeight + 'px';
        }
        setHeightQueue();
    }, [queues])

    const updateCurrentMusic = async(music) => {
        if (currentMusic._id === music._id || !music.youtubeId) {
            return;
        }
        dispatch(setLoadingAction({isLoading: true}));
        await musicService.updateCurrentMusic(music.youtubeId);
        dispatch(setLoadingAction({isLoading: false}));
        dispatch(setCurrentMusicAction(music));
    }

    const removeItem = async(music) => {
        if (!music._id) return;
        dispatch(setLoadingAction({isLoading: true}));
        const response = await musicService.removeItemQueue(music._id);
        dispatch(setLoadingAction({isLoading: false}));
        if (!response || !response.result || !response.result.queue) {
            return;
        }
        dispatch(setQueueItemAction(response.result.queue));
    }
    
    const handleDragEnd = async (data) => {
        if (!data.destination) return;
        const dragItemSource = queues[data.source.index];
        const dragItemDestination = queues[data.destination.index];
        if (dragItemSource.youtubeId === dragItemDestination.youtubeId) return;
        let items = queues.filter(item => item !== dragItemSource);
        items.splice(data.destination.index, 0, dragItemSource);
        dispatch(setQueueItemAction(items));
        const body = {
            sourceIndex: data.source.index,
            destinationIndex: data.destination.index
        }
        await musicService.updateQueueList(body);
      };

    return (
        <div className='queue'>
            <div className='queue__header'>
                <h3>Hàng đợi ({queues.length})</h3>
            </div>
                 <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='queues'>
                        {(provided) => (
                            <div className='queue__list' {...provided.droppableProps} ref={provided.innerRef}>
                                {  queues && queues.map((element, i) => {
                                return(
                                    <Draggable key={element.youtubeId} draggableId={element.youtubeId} index={i}>
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <div className={`queue__list--item`} >
                                                    <div className={`queue__list--item--icon ${element.youtubeId && currentMusic.youtubeId === element.youtubeId ? 'playing' : ''}`}>
                                                        <span className='play-icon' onClick={() => updateCurrentMusic(element)}>{<BsFillPlayFill/>}</span>
                                                        <img className='image-play' src={process.env.PUBLIC_URL + 'equaliser-animated-green.f93a2ef4.gif'} alt='play-icon' />
                                                        <img className='image-loading' src={process.env.PUBLIC_URL + 'loading.gif'} alt='play-icon' />
                                                    </div>
                                                    <div className='queue__list--item--thumb' onClick={() => updateCurrentMusic(element)}><img src={element.audioThumb} alt="" /></div>
                                                    <div onClick={() => updateCurrentMusic(element)} className={`queue__list--item--name ${element.youtubeId && currentMusic.youtubeId === element.youtubeId ? 'playing' : ''}`}>
                                                        <div>{element.name}</div> 
                                                        <div>{element.authorName}</div>
                                                    </div>
                                                </div>
                                                <div className='queue__list--remove'>   
                                                    <CgPlayListRemove className={element.youtubeId && currentMusic.youtubeId === element.youtubeId ? 'non-remove' : ''} onClick={() => removeItem(element)}/>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                                })}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
               
        </div>
    );
}

export default Queue;