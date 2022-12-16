import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    drawerShow: false
  }),
  actions: {
    setDrawerShow(status) {
      this.drawerShow = status
    }
  },
})
