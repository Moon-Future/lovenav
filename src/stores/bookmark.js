import { defineStore } from 'pinia'

export const useBookmarkStore = defineStore({
  id: 'bookmark',
  state: () => ({
    sortStatus: false
  }),
  actions: {
    changeSortStatus(status) {
      this.sortStatus = status
    }
  },
})
