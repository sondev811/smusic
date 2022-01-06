import http from "./http.service";
import { api } from "../constants/api.constant";
class MusicService {
    getMusic(id) {
        return http.get(api.getMusic, {id});
    }

    getQueueList() {
        return http.get(api.getQueueList);
    }

    updateCurrentMusic(youtubeId) {
        return http.get(api.updateCurrentMusic, {youtubeId});
    }

    removeItemQueue(musicId) {
        return http.get(api.removeItemQueue, {musicId});
    }

    updateQueueList(body) {
        return http.post(api.updateQueueList, body);
    }
}
export default new MusicService();