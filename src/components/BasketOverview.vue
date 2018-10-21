<template>
  <div class="basket-overview">
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

export default {
  name: 'BasketOverview',
  mixins: [util],
  props: {
  },
  data () {
    return {
      searchInput: null,
      showBasketButton: true,
      requestsArePending: false
    }
  },
  methods: {
    addItemToBasket (item) {
      this.$store.dispatch("addEntryToBasket", { item });
    },
    removeEntryFromBasket (entry) {
      this.$store.dispatch("removeEntryFromBasket", { entry });
    },
    reduceAmountInBasket (entry) {
      this.$store.dispatch("reduceAmountInBasket", { entry });
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
  },
  computed: {
    basketItems () {
      return this.$store.state.basket;
    }
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

input {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 5px 7px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 0 #efefef;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  width: 50%;

  &:focus {
    outline: none;
  }
}

.filter {
  display: inline-block;
  margin: 0 10px;

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
    transition: opacity 0.5s;

    &.selected {
      opacity: 0.3;
      transition: opacity 0.5s;
    }

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

  &.filtered-by-search {
    li:nth-child(1) {
      border: 2px solid yellow;
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
      background: #b1d2bb;
    }

    &.pendingRequests {
      background-color: orange;
    }
  }

  ul#basket-list {
    list-style-type: none;
    text-align: left;

    span.amount {
      font-weight: bold;
    }

    .actions {
      margin: 0 0 0 10px;


      span {
        width: 20px;
        display: inline-block;
        text-align: center;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        border-radius: 15px;

        &:hover {
          background: #e8e8e8;
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
