import { getCurrentInstance } from 'vue'

export function getGlobalProperties() {
  const {
    emit,
    appContext: {
      app: {
        config: { globalProperties },
      },
    },
  } = getCurrentInstance()

  return { ...globalProperties }
}
