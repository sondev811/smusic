export const playlistStore = (state) => state.queue;
export const playlistItemStore = (state) => state.queue.list;
export const playlistNameStore = (state) => state.queue.playlistName;
export const currentMusicStore = (state) => state.queue.currentMusic;
export const loadingStore = (state) => state.loading.loadingCount;
export const loadingContentStore = (state) => state.loading.content;
export const playerStore = (state) => state.player.volume;
export const searchTypingStore = (state) => state.search.isTyping;
export const searchHistoryStore = (state) => state.search.searchHistory;
export const userStore = (state) => state.user;