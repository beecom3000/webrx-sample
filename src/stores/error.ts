import { defineStore } from 'pinia'
import { type ComponentInternalInstance, type ComponentPublicInstance } from 'vue'

type State = {
  error: unknown | null
  instance: ComponentPublicInstance | null
  info: string
}

export const useErrorStore = defineStore({
  id: 'error',
  state: (): State => ({
    error: null,
    instance: null,
    info: ''
  }),
  getters: {
    getError(state): unknown | null {
      return state.error;
    },
    getInstance(state): ComponentPublicInstance | null {
      return state.instance;
    },
    getInfo(state): string {
      return state.info;
    }
  },
  actions: {
    setError(error: unknown | null, instance: ComponentPublicInstance | null, info: string): void  {
      this.error = error;
      this.instance = instance;
      this.info = info;
    }
  }
});
