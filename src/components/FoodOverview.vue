<template>
  <div class="gs-index">
    <div id="food-overview">
      <div id="grocery-head">
        <h1>Groceries</h1>
        <div class="filter filter-search">
          <input type="text" name="search" v-model="searchInput"
                placeholder="Search..."
                v-on:keyup.13="addItemToBasketFromSearchInput()">
        </div>

        <div class="filter filter-categories">
          <Badge v-for="cat in groceryData" :key="cat.name" :id="cat.name" :label="cat.name" :color="cat.color" :active-on-start="cat.isActive" v-on:badge-clicked="categoryClick(cat)" />
        </div>
      </div>

      <div id="grocery-body">
        <div v-if="category.isActive" v-for="category in filteredGroceries">
          <h3 v-text="category.name"></h3>
          <ul id="grocery-list" :class="{ 'filtered-by-search': isUserIsSearching }">
            <li v-for="grocery, index in category.data" :key="grocery.label + index"
                @click="executeItemClick(grocery)"
                :class="{ loading: grocery.isLoading, selected: isItemInBasket(grocery.label) }"
                :style="imgUrl(grocery.img)">
              <span class="grocery-info">
                <span class="category-marker" :style="{ 'background-color': grocery.color }"></span>
                <span class="label" v-text="grocery.label"></span>
              </span>
            </li>

            <li v-if="isUserIsSearching" :class="{ selected: isItemInBasket(searchInput) }">
              <span class="grocery-info">
                <span class="category-marker"></span>
                <span class="label" v-text="searchInput"></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dav from 'dav';
import util from '../util';
import Badge from './Badge';
import BasketOverview from './BasketOverview';

export default {
  name: 'FoodOverview',
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
    executeItemClick (item) {
      if(this.isItemInBasket(item.label)) {
        this.removeEntryFromBasket(item);
      } else {
        this.addItemToBasket(item);
      }
    },
    addItemToBasket (item) {
      this.$store.dispatch("addEntryToBasket", { item });
    },
    addItemToBasketFromSearchInput () {
      let itemToBeAdded = null;
      //  Access reults array
      let groceries = this.filteredGroceries[0].data;
      itemToBeAdded = groceries.length > 0 ?
                        groceries[0] : this.searchItem;

      this.$store.dispatch("addEntryToBasket", { item: itemToBeAdded });
    },
    removeEntryFromBasket (entry) {
      this.$store.dispatch("removeEntryFromBasket", { entry });
    },
    categoryClick (category) {
      this.$store.dispatch('setItemState', { item: category, attr: "isActive" });
    },
    isItemInBasket (itemName) {
      return this.basketItemStrings.includes(itemName);
    }
  },
  components: {
    Badge,
    BasketOverview
  },
  computed: {
    filteredGroceries () {
      if(this.isUserIsSearching) {
        let results = this.groceryData.reduce((acc, curr) => acc.concat(curr.data), [])
                        .filter(g => g.label.includes(this.searchInput));
        let searchedGroceriesObj = [{ name: "Results", isActive: true, data: results }];
        return searchedGroceriesObj;
      } else {
        let activeCategories = this.groceryData.filter(c => c.isActive).map(c => c.name);
        return this.groceryData.filter(d => activeCategories.includes(d.name));
      }
    },
    isUserIsSearching () {
      return this.searchInput && this.searchInput.trim().length > 0
    },
    searchItem () {
      return {
        label: this.searchInput,
        color: "#000000",
        category: "Search",
        img: "default.png"
      }
    },
    basketItemStrings () {
      return this.$store.state.basket.map(e => e.item.label);
    }
  },
  created () {
    this.$store.dispatch('initStore');
  }
}
</script>

<style scoped lang="scss">
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

a {
  color: #42b983;
}

</style>
