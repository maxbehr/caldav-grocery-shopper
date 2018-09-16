import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import foodData from './foods.json';

export default new Vuex.Store({
  state: {
    basket: [],
    foods: foodData
  },
  mutations: {
    ADD_ITEM_TO_BASKET (state, payload) {
      state.basket.push(payload.item);
    },
    SET_ITEM_STATE (state, payload) {
      console.log('payload', payload);
      let item = payload.item;
      let attr = payload.attr;

      if(!item.hasOwnProperty(attr)) {
        Vue.set(item, attr, false);
      }

      if(payload.hasOwnProperty('val')) {
        item[attr] = payload.val;
      } else {
        item[attr] = !item[attr];
      }
    }
  },
  actions: {
    togglePutToBasketState (context, payload) {
      context.commit('SET_ITEM_STATE', payload);
    },
    putItemInBasket (context, payload) {
      context.commit('ADD_ITEM_TO_BASKET', payload);
    }
  }
})
