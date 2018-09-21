<template>
  <div class="gs-index">
    <div id="food-overview">
      <div id="grocery-head">
        <h1>Groceries</h1>
        <div class="filter filter-search">
          <label for="search">Search</label>
          <input type="text" name="search" v-model="searchInput">
        </div>

        <div class="filter filter-categories">
          <label>Categories</label>
          <Badge v-for="cat in categories" :key="cat.name" :id="cat.name" :label="cat.name" :color="cat.color" :active-on-start="cat.isActive" v-on:badge-clicked="categoryClick(cat)" />
        </div>
      </div>

      <div id="grocery-body">
        <ul id="grocery-list">
          <li v-for="grocery in filteredGroceries" :key="grocery.label" @click="putFoodInBasket(grocery)" :class="{ loading: grocery.isLoading }" :style="imgUrl(grocery.img)">
            <span v-if="grocery.isLoading" class="loading-icon big rotate item-loading-while-put-in-basket">&#9676;</span>
            <span v-if="grocery.inBasket" class="success-icon big">&#10003;</span>
            <span class="grocery-info">
              <span class="category-marker" :style="{ 'background-color': grocery.color }"></span>
              <span class="label" v-text="grocery.label"></span>
            </span>
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
    imgUrl (img) {
      if(img && img.length > 0) {
        return { 'background-image': `url('${require('../img/' + img)}')` };
      }
      return {}
    },
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

  #grocery-head {
    display: grid;
    grid-template-columns: 0.2fr 0.2fr 0.6fr;
    padding: 0 15px;

    * {
      display: flex;
      align-self: flex-end;
      align-items: center;
    }
  }

  #food-overview {
    background-color: #f6f9fc;
  }

  #grocery-body {
    background-color: #f6f9fc;
  }
}

h1 {
  display: inline-block;
  margin: 0;
  text-align: left;
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
      border-radius: 10px;
      box-shadow: inset 0 0 0 0 #efefef;
      background: #ffffff;
      border: 1px solid #e8e8e8;
    }
  }

  &.filter-categories {
    justify-content: flex-end;
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
    display: flex;
    align-items: flex-end;
    margin: 0 10px;
    position: relative;
    border: 2px solid #efefef;
    border-radius: 10px;
    padding: 10px 15px;
    background-size: cover;
    height: 100px;
    width: 100px;
    box-shadow: 0 0 15px #efefef;
    background-color: white;

    span.grocery-info {
      position: absolute;
      bottom: 0px;
      width: 100%;
      background-color: #00000042;
      color: white;
      font-weight: bold;
      left: 0;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding: 5px 0;
      font-size: 0.8em;
    }

    span.category-marker {
      display: inline-block;
      height: 10px;
      width: 10px;
      margin-right: 10px;
      border-radius: 10px;
      border: 1px solid #b3b3b3;
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
