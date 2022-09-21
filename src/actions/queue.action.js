export const setPlaylistAction = (playlist) => {
  return {
    type: 'PLAYLIST',
    payload: playlist
  };
};

export const setSongsPlaylistAction = (data) => {
  return {
    type: 'PLAYLIST_ITEM',
    payload: data
  };
};

export const setPlaylistNameAction = (data) => {
  return {
    type: 'PLAYLIST_NAME',
    payload: data
  };
};

export const setCurrentMusicAction = (data) => {
  return {
    type: 'CURRENT_MUSIC',
    payload: data
  };
};
