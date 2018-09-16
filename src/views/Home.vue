<template>
  <div class="home">
    <FoodOverview />
  </div>
</template>

<script>
// @ is an alias to /src
import FoodOverview from '@/components/FoodOverview.vue'

export default {
  name: 'home',
  components: {
    FoodOverview
  }
}
</script>
