export const setQueueAction = (queue) => {
  return {
    type: 'QUEUE',
    payload: queue
  };
};

export const setQueueItemAction = (data) => {
  return {
    type: 'QUEUE_ITEM',
    payload: data
  };
};

export const setCurrentMusicAction = (data) => {
  return {
    type: 'CURRENT_MUSIC',
    payload: data
  };
};
