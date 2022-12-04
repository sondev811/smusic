import { httpClient } from './http.service';
import { api } from '../constants/api.constant';

export const musicService = {
  getMusic: (id) => httpClient.get(api.getMusic, { id }),

  getPlaylist: (isLoading = true) => httpClient.get(api.getPlaylist, {}, isLoading),

  getPlaylistById: (playlistId, isLoading = true) => httpClient.get(api.getPlaylistById, { playlistId }, isLoading),

  createPlaylist: (playlistName) => httpClient.post(api.createPlaylist, { playlistName }, true),

  removePlaylist: (playlistId) => httpClient.get(api.removePlaylist, {playlistId}),

  updateCurrentPlaylist: (playlistId, isLoading = true) => httpClient.get(api.updateCurrentPlaylist, {playlistId}, isLoading),

  getSongsPlaylist: (playlistId) => httpClient.get(api.getSongsPlaylist, {playlistId}),

  insertSongPlaylist: (playlistId, id, isLoading = true) => httpClient.get(api.insertSongPlaylist, {playlistId, id}, isLoading),

  getMusicUrl: (id, device) => httpClient.get(api.stream, { id, device }),

  updateCurrentMusic: (youtubeId, playlistId, isLoading = true) => httpClient.get(api.updateCurrentMusic, { youtubeId, playlistId }, isLoading),

  removeItemPlaylist: (musicId, playlistId, loading = true) => httpClient.get(api.removeItemPlaylist, { musicId, playlistId }, loading),

  updateQueueList: (body) => httpClient.post(api.updateQueueList, body),

  editPlaylistName: (body) => httpClient.post(api.editPlaylistName, body)
}
