<template>
  <div class="home">
    <food-overview />
    <basket-overview />
  </div>
</template>

<script>
// @ is an alias to /src
import FoodOverview from '@/components/FoodOverview.vue'
import BasketOverview from '@/components/BasketOverview.vue'

export default {
  name: 'home',
  components: {
    FoodOverview,
    BasketOverview
  }
}
</script>

<style lang="scss">
.home {
  display: grid;
  grid-template-columns: 0.8fr 0.2fr;
}
</style>
