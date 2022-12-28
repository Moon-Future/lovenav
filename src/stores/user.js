import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    drawerShow: false,
    loginVisible: false,
    userInfo: null
  }),
  actions: {
    setDrawerShow(status) {
      this.drawerShow = status
    },
    setLoginVisible(status) {
      this.loginVisible = status
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    }
  },
})
