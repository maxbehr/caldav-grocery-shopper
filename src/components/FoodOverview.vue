<template>
  <div class="gs-index">
    <div id="food-overview">
      <h1>Groceries</h1>
      <div v-for="food in foods">
        <h2 v-text="food.name"></h2>
        <ul id="food-list">
          <li v-for="item in food.data" @click="putFoodInBasket(item)" :class="{ loading: item.isLoading }" :style="{ 'border-color': food.color }">
            <span class="label" v-text="item.label"></span>
            <span v-if="item.isLoading" class="loading-icon big rotate item-loading-while-put-in-basket">&#9676;</span>
            <span v-if="item.inBasket" class="success-icon big">&#10003;</span>
          </li>
        </ul>
      </div>
    </div>

    <div id="basket">
      <h1>Basket</h1>
      <ul id="basket-list">
        <li v-for="item in basket" :class="{ loading: item.isLoading }">
          <span v-text="item.label"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import dav from 'dav';
import util from '../util';

export default {
  name: 'HelloWorld',
  mixins: [util],
  props: {
  },
  data () {
    return {
      basket: this.$store.state.basket,
      foods: this.$store.state.foods
    }
  },
  methods: {
    putFoodInBasket (item) {
      console.log(item);
      this.$store.dispatch("togglePutToBasketState", { item, attr: "isLoading", val: true });
      this.$store.dispatch("putItemInBasket", { item });
      this.createTodoElement(item);
    },
    createTodoElement (item) {
      let store = this.$store;
      var dav = require('dav');
      let calEntry = this.createICalEntry({ label: item.label });

      var xhr = new dav.transport.Basic(
        new dav.Credentials({
          username: process.env.VUE_APP_DAV_USER,
          password: process.env.VUE_APP_DAV_PASS
        })
      );

      dav.createAccount({ server: process.env.VUE_APP_DAV_SERVER, xhr: xhr })
      .then(function(account) {
        let c = account.calendars.filter(c => c.displayName === "Einkaufsliste")[0];
        console.log(c);

        let filename = item.label.trim().toLowerCase()
                          .replace(' ', '-')
                          .replace('\u00e4', 'ae')
                          .replace('\u00f6', 'oe')
                          .replace('\u00fc', 'ue')
                          .replace('\u00df', 'ss');

        dav.createCalendarObject(c, {
          data: calEntry,
          filename: `${filename}.ics`,
          xhr: xhr
        })
        .then(function(c) {
          store.dispatch('togglePutToBasketState', { item, attr: "isLoading", val: false });
          store.dispatch('togglePutToBasketState', { item, attr: "inBasket", val: true });
        });
        // // account instanceof dav.Account
        // account.calendars.forEach(function(calendar) {
        //   console.log('Found calendar named ', calendar);
        //   // etc.
        // });
      });
    }
  },
  computed: {
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.gs-index {
  display: grid;
  grid-template-columns: 0.8fr 0.2fr;
}

h3 {
  margin: 40px 0 0;
}

ul#food-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 15px;
  list-style-type: none;
  padding: 0;

  li {
    display: inline-block;
    margin: 0 10px;
    position: relative;
    border: 5px solid #efefef;
    border-radius: 10px;
    padding: 10px 15px;
    background-size: cover;
    height: 100px;
    width: 100px;

    span.label {
    }

    span.loading-icon, span.success-icon {
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;

      &.big {
        font-size: 6em;
      }
    }

    span.success-icon {
      color: #41b882;
    }

    span.loading-icon {
      color: #b1b1b1;
    }

    .rotate {
      -webkit-animation: loading-spinner 4s linear infinite;
      -moz-animation: loading-spinner 4s linear infinite;
      animation: loading-spinner 4s linear infinite;
    }

    &:hover { cursor: pointer; }
    &.loading { background-color: #eaeaea; }
    &.in-basket {
      opacity: 0.4;
    }
  }
}

ul#basket-list {
  list-style-type: none;
  text-align: left;

  li {
    display: block;

    &.loading {
      color: #b1b1b1;
    }
  }
}

a {
  color: #42b983;
}

@-moz-keyframes loading-spinner { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes loading-spinner { 100% { -webkit-transform: rotate(360deg); } }
@keyframes loading-spinner { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
