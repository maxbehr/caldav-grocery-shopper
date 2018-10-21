import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import groceryData from './groceries.json';

export default new Vuex.Store({
  state: {
    basket: [],
    groceries: groceryData
  },
  mutations: {
    ADD_ENTRY_TO_BASKET (state, payload) {
      let item = payload.item;
      let entry = state.basket.filter(e => e.item.label === item.label)[0];
      if(entry) {
        entry.amount = entry.amount + 1;
      } else {
        state.basket.push({ item, amount: 1 });
      }
    },
    ADD_PLAIN_ENTRY_TO_BASKET (state, payload) {
      let item = payload;
      state.basket.push({ item, amount: 1 });
    },
    REDUCE_AMOUNT_IN_BASKET_FOR_ITEM (state, payload) {
      let item = payload.entry.item;
      let entry = state.basket.filter(e => e.item.label === item.label)[0];
      if(entry && entry.amount > 1) {
        entry.amount = entry.amount - 1;
      }
    },
    REMOVE_ENTRY_FROM_BASKET (state, payload) {
      let entry = payload.entry;
      let index = state.basket.indexOf(entry);
      state.basket.splice(index, 1);
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
    },
    INIT_STORE (state, payload) {
      //  Give each grocery item the color of its category
      state.groceries.forEach(g => {
        g.data.forEach(d => {
          Vue.set(d, 'color', g.color);
          Vue.set(d, 'category', g.name);
        });
        Vue.set(g, 'isActive', true);
      });
    }
  },
  getters: {
    groceries: (state, getters) => {
      state.groceries
      return state.groceries.reduce((acc, curr) => acc.concat(curr.data), []);;
    }
  },
  actions: {
    setItemState (context, payload) {
      context.commit('SET_ITEM_STATE', payload);
    },
    addEntryToBasket (context, payload) {
      context.commit('ADD_ENTRY_TO_BASKET', payload);
    },
    addPlainEntryToBasket (context, payload) {
      context.commit('ADD_PLAIN_ENTRY_TO_BASKET', payload);
    },
    removeEntryFromBasket (context, payload) {
      console.log('remove', payload);
      context.commit('REMOVE_ENTRY_FROM_BASKET', payload);
    },
    reduceAmountInBasket (context, payload) {
      context.commit('REDUCE_AMOUNT_IN_BASKET_FOR_ITEM', payload);
    },
    initStore (context, payload) {
      context.commit('INIT_STORE', payload);
    }
  }
})
