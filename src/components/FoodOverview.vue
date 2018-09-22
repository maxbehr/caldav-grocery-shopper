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
          <Badge v-for="cat in groceryData" :key="cat.name" :id="cat.name" :label="cat.name" :color="cat.color" :active-on-start="cat.isActive" v-on:badge-clicked="categoryClick(cat)" />
        </div>
      </div>

      <div id="grocery-body">
        <div v-if="category.isActive" v-for="category in groceryData">
          <h3 v-text="category.name"></h3>
          <ul id="grocery-list">
            <li v-for="grocery in category.data" :key="grocery.label" @click="addItemToBasket(grocery)" :class="{ loading: grocery.isLoading }" :style="imgUrl(grocery.img)">
              <span class="grocery-info">
                <span class="category-marker" :style="{ 'background-color': grocery.color }"></span>
                <span class="label" v-text="grocery.label"></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div id="basket">
      <h1>Basket</h1>
      <ul id="basket-list">
        <li v-for="entry in basketItems">
          <span>
            <span v-if="entry.amount > 1" v-text="entry.amount + 'x'" class="amount"></span>
          </span>
          <span class="item-label" v-text="entry.item.label"></span>
          <span class="actions">
            <span class="more" @click="addItemToBasket(entry.item)">+</span>
            <span v-if="entry.amount > 1" class="less" @click="reduceAmountInBasket(entry)">－</span>
            <span class="remove" @click="removeEntryFromBasket(entry)">x</span>
          </span>
        </li>
      </ul>
      <div v-if="showBasketButton && !requestsArePending && this.$store.state.basket.length > 0" id="btn-create-list" @click="createShoppingList">create list</div>
      <div id="basket-state">
        <span v-if="requestsArePending" class="loading-icon big rotate">&#9676;</span>
        <span v-if="!showBasketButton && !requestsArePending" class="success-icon big">&#10003;</span>
      </div>
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
      groceryData: this.$store.state.groceries,
      showBasketButton: true,
      requestsArePending: false
    }
  },
  methods: {
    imgUrl (img) {
      if(img && img.length > 0) {
        return { 'background-image': `url('${require('../img/' + img)}')` };
      }
      return {}
    },
    addItemToBasket (item) {
      this.$store.dispatch("addEntryToBasket", { item });
    },
    removeEntryFromBasket (entry) {
      this.$store.dispatch("removeEntryFromBasket", { entry });
    },
    reduceAmountInBasket (entry) {
      this.$store.dispatch("reduceAmountInBasket", { entry });
    },
    categoryClick (category) {
      this.$store.dispatch('setItemState', { item: category, attr: "isActive" });
    },
    createShoppingList () {
      let store = this.$store;

      if(store.state.basket.length > 0) {
        let dav = require('dav');

        let promises = [];
        var xhr = new dav.transport.Basic(
          new dav.Credentials({
            username: process.env.VUE_APP_DAV_USER,
            password: process.env.VUE_APP_DAV_PASS
          })
        );

        this.requestsArePending = true;
        this.showBasketButton = false;
        let p = dav.createAccount({ server: process.env.VUE_APP_DAV_SERVER, xhr: xhr })
          .then(account => {

            store.state.basket.forEach(entry => {
              let label = this.createEntryString(entry);
              let calEntry = this.createICalEntry({ label });
              let filename = this.sanitizeString(label);
              let calendar = account.calendars.filter(c => c.displayName === process.env.VUE_APP_DAV_CALENDAR_NAME)[0];

              dav.createCalendarObject(calendar, {
                data: calEntry,
                filename: `${filename}.ics`,
                xhr: xhr
              })
              .then(function(c) {
                return "done";
              });
            });

          Promise.all(promises).then(values => {
            this.requestsArePending = false;
          })
        });
      }
    }
  },
  components: {
    Badge
  },
  computed: {
    basketItems () {
      return this.$store.state.basket;
    },
    filteredGroceries () {
      let activeCategories = this.groceryData.filter(c => c.isActive).map(c => c.name);
      let g = this.groceryData.filter(g => activeCategories.includes(g.category))
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
    padding: 10px 15px;

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

    h3 {
      font-size: 0.8em;
      text-align: left;
      padding-left: 15px;
    }
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

div#basket-state {
  position: relative;
  font-size: 6em;
}

span.success-icon {
  color: #41b882;
}

span.loading-icon {
  position: absolute;
  color: #828282;
  left: 0;
  right: 0;
}

.rotate {
  -webkit-animation: loading-spinner 4s linear infinite;
  -moz-animation: loading-spinner 4s linear infinite;
  animation: loading-spinner 4s linear infinite;
}

ul#grocery-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 15px;
  list-style-type: none;
  padding: 0;
  padding: 0;
  margin: 10px 0 30px 0;

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

    &:hover { cursor: pointer; }
    &.loading { background-color: #eaeaea; }
    &.in-basket {
      opacity: 0.4;
    }
  }
}

#basket {
  div#btn-create-list {
    position: relative;
    margin: 25px;
    background: #bfe2ca;
    border-radius: 10px;
    padding: 20px;
    font-size: 1.5em;
    cursor: pointer;

    &:hover {
      background: #bfe2ca;
    }

    &.pendingRequests {
      background-color: orange;
    }
  }

  ul#basket-list {
    list-style-type: none;
    text-align: left;

    .actions {
      margin: 0 0 0 10px;

      span.amount {
        font-weight: bold;
      }

      span {
        width: 20px;
        display: inline-block;
        text-align: center;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          &.more { background: #00ff00; }
          &.less { background: #ff1100; }
          &.remove { background: #ff0000; }
        }
      }
    }

    li {
      display: grid;
      grid-template-columns: 0.1fr 0.5fr 0.4fr;
      -webkit-user-select: none; /* Chrome/Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+ */

      &.loading {
        color: #b1b1b1;
      }
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
