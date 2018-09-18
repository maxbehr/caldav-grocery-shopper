<template>
  <div class="gs-index">
    <div id="food-overview">
      <h1>Groceries</h1>
      <div class="filter">
        <label for="search">Search</label>
        <input type="text" name="search" v-model="searchInput">
      </div>

      <div class="filter">
        <label>Categories</label>
        <Badge v-for="cat in categories" :key="cat.name" :id="cat.name" :label="cat.name" :color="cat.color" :active-on-start="cat.isActive" v-on:badge-clicked="categoryClick(cat)" />
      </div>

      <div>
        <ul id="grocery-list">
          <li v-for="grocery in filteredGroceries" :key="grocery.label" @click="putFoodInBasket(grocery)" :class="{ loading: grocery.isLoading }" :style="{ 'border-color': grocery.color }">
            <span class="label" v-text="grocery.label"></span>
            <span v-if="grocery.isLoading" class="loading-icon big rotate item-loading-while-put-in-basket">&#9676;</span>
            <span v-if="grocery.inBasket" class="success-icon big">&#10003;</span>

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
import Badge from './Badge';

export default {
  name: 'HelloWorld',
  mixins: [util],
  props: {
  },
  data () {
    return {
      searchInput: null,
      basket: this.$store.state.basket,
      groceries: this.$store.getters.groceries,
      categories: this.$store.state.groceryCategories
    }
  },
  methods: {
    putFoodInBasket (item) {
      console.log(item);
      this.$store.dispatch("setItemState", { item, attr: "isLoading", val: true });
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
          store.dispatch('setItemState', { item, attr: "isLoading", val: false });
          store.dispatch('setItemState', { item, attr: "inBasket", val: true });
        });
        // // account instanceof dav.Account
        // account.calendars.forEach(function(calendar) {
        //   console.log('Found calendar named ', calendar);
        //   // etc.
        // });
      });
    },
    categoryClick (category) {
      this.$store.dispatch('setItemState', { item: category, attr: "isActive" });
    }
  },
  components: {
    Badge
  },
  computed: {
    filteredGroceries () {
      let activeCategories = this.$store.state.groceryCategories.filter(c => c.isActive).map(c => c.name);
      let g = this.groceries.filter(g => activeCategories.includes(g.category))
                            .filter(g => {
                              if(this.searchInput && this.searchInput.trim().length > 0) {
                                return g.label.includes(this.searchInput);
                              }
                              return true;
                            });
      return g;
    }
  },
  created () {
    this.$store.dispatch('initStore');
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

label {
  font-weight: bold;
  font-size: 0.8em;
  margin-right: 10px;
}

.filter {
  display: inline-block;
  margin: 0 10px;

  &.filter-search {
    input {
      padding: 5px 7px;
    }
  }
}

ul#grocery-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 15px;
  list-style-type: none;
  padding: 0;
  margin: 30px 0;

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
