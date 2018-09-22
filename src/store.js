import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import groceryData from './groceries.json';

export default new Vuex.Store({
  state: {
    basket: [],
    groceries: groceryData,
    groceryCategories: []
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
    },
    INIT_STORE (state, payload) {
      //  Give each grocery item the color of its category
      state.groceries.forEach(g => {
        g.data.forEach(d => {
          Vue.set(d, 'color', g.color);
          Vue.set(d, 'category', g.name);
        });

        //  Fill categories
        state.groceryCategories.push({ name: g.name, color: g.color, isActive: true });
      });
    }
  },
  getters: {
    groceryCategorises: (state, getters) => {
      // let categories = state.groceries.map(f => ({ name: f.name, color: f.color }));
      // return categories;
      return state.groceryCategories;
    },
    groceries: (state, getters) => {
      state.groceries
      return state.groceries.reduce((acc, curr) => acc.concat(curr.data), []);;
    }
  },
  actions: {
    setItemState (context, payload) {
      context.commit('SET_ITEM_STATE', payload);
    },
    putItemInBasket (context, payload) {
      context.commit('ADD_ITEM_TO_BASKET', payload);
    },
    initStore (context, payload) {
      context.commit('INIT_STORE', payload);
    }
  }
})
