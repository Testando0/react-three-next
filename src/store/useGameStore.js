import { create } from 'zustand'

export const useGameStore = create((set) => ({
  status: 'playing', // 'playing', 'dead', 'escaped'
  gas: 0,
  playerPos: [0, 0, 0],
  setPlayerPos: (pos) => set({ playerPos: pos }),
  addGas: () => set((state) => ({ gas: Math.min(state.gas + 1, 3) })),
  setStatus: (status) => set({ status }),
  reset: () => set({ status: 'playing', gas: 0 })
}))
