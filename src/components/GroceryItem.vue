<template>
  <li class="grocery-item" :style="imgUrl(grocery.img)">
    <span class="grocery-info">
      <span class="category-marker" :style="{ 'background-color': grocery.color }"></span>
      <span class="label" v-text="grocery.label"></span>
    </span>
  </li>
</template>

<script>

export default {
  name: 'GroceryItem',
  props: {
    grocery: Object
  },
  data () {
    return {
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
    }
  },
  components: {
  },
  computed: {
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
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
</style>
