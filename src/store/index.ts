import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    NbRow: 0,
    NbCol: 0,
    NbBomb: 0,
    NbFlagged: 0,
    Run: false,   // player start to interact (aka firts click)
    Boom: false,  // player explode himself
    NbGames: 0,   // nb game played increment when restart is clicked (smiley icon) allows restart watching
    ShowConfig: false,
  },
  mutations: {
    setNbRow(state, v: number): void {
     state.NbRow = v;
    },

    setNbCol(state, v: number) {
      state.NbCol = v;
    },

    setNbBomb(state, v: number) {
      state.NbBomb = v;
    },

    setNbFlagged(state, v: number) {
      state.NbFlagged = v;
    },

    incrementNbFlagged(state, v: number) {
      state.NbFlagged += v; // +- n
    },

    setRunMode(state, v: boolean) {
      state.Run = v;
    },

    setBoom(state, v: boolean) {
      state.Boom = v;
    },

    incrementNbGames(state) {
      state.NbGames++;
    },

    toggleShowConfig(state) {
      state.ShowConfig = !state.ShowConfig;
    },
    
  },
  actions: {
    setNbRow(context, v: number) {
      context.commit('setNbRow', v);
    },

    setNbCol(context, v: number) {
      context.commit('setNbCol', v);
    },

    setNbBomb(context, v: number) {
      context.commit('setNbBomb', v);
    },

    setNbFlagged(context, v: number) {
      context.commit('setNbFlagged', v);
    },

    incrementNbFlagged(context, v: number) {
      context.commit('incrementNbFlagged', v)
    },

    setRunMode(context, v: boolean) {
      context.commit('setRunMode', v);
    },

    setBoom(context, v: boolean) {
      context.commit('setBoom', v);
    },

    incrementNbGames(context) {
      context.commit('incrementNbGames');
    },

    toggleShowConfig(context) {
      context.commit('toggleShowConfig');
    },
  },
  modules: {
  }
})
