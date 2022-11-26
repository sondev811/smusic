import { httpClient } from './http.service';
import { api } from '../constants/api.constant';

export const musicService = {
  getMusic: (id) => httpClient.get(api.getMusic, { id }),

  getPlaylist: (isLoading = true) => httpClient.get(api.getPlaylist, {}, isLoading),

  createPlaylist: (playlistName) => httpClient.post(api.createPlaylist, { playlistName }, true),

  removePlaylist: (playlistId) => httpClient.get(api.removePlaylist, {playlistId}),

  updateCurrentPlaylist: (playlistId, isLoading = true) => httpClient.get(api.updateCurrentPlaylist, {playlistId}, isLoading),

  getSongsPlaylist: (playlistId) => httpClient.get(api.getSongsPlaylist, {playlistId}),

  insertSongPlaylist: (playlistId, id, isLoading = true) => httpClient.get(api.insertSongPlaylist, {playlistId, id}, isLoading),

  getMusicUrl: (id) => httpClient.get(api.stream, { id }),

  updateCurrentMusic: (youtubeId, playlistId, isLoading = true) => httpClient.get(api.updateCurrentMusic, { youtubeId, playlistId }, isLoading),

  removeItemPlaylist: (musicId, playlistId) => httpClient.get(api.removeItemPlaylist, { musicId, playlistId }),

  updateQueueList: (body) => httpClient.post(api.updateQueueList, body)
}
