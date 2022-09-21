import http from './http.service';
import { api } from '../constants/api.constant';
class MusicService {
  getMusic(id) {
    return http.get(api.getMusic, { id });
  }

  getPlaylist(isLoading = true) {
    return http.get(api.getPlaylist, {}, isLoading);
  }

  createPlaylist(playlistName) {
    return http.post(api.createPlaylist, { playlistName }, true)
  }

  removePlaylist(playlistId) {
    return http.get(api.removePlaylist, {playlistId});
  }

  updateCurrentPlaylist(playlistId, isLoading = true) {
    return http.get(api.updateCurrentPlaylist, {playlistId}, isLoading);
  }

  getSongsPlaylist(playlistId) {
    return http.get(api.getSongsPlaylist, {playlistId});
  }

  insertSongPlaylist(playlistId, id, isLoading = true) {
    return http.get(api.insertSongPlaylist, {playlistId, id}, isLoading);
  }

  getMusicUrl(id) {
    return http.get(api.stream, { id });
  }

  updateCurrentMusic(youtubeId, playlistId, isLoading = true) {
    return http.get(api.updateCurrentMusic, { youtubeId, playlistId }, isLoading);
  }

  removeItemPlaylist(musicId, playlistId) {
    return http.get(api.removeItemPlaylist, { musicId, playlistId });
  }

  updateQueueList(body) {
    return http.post(api.updateQueueList, body);
  }
}
export default new MusicService();
