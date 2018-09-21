<template>
  <div class="badge">
    <span :class="{ active: active }" :style="{ backgroundColor: color }" v-text="label" @click="badgeClick"></span>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    id: String,
    label: String,
    color: String,
    activeOnStart: Boolean
  },
  data () {
    return {
      active: this.activeOnStart
    }
  },
  methods: {
    badgeClick () {
      this.active = !this.active;
      let payload = { id: this.id };
      this.$emit('badge-clicked', payload);
    }
  }
}
</script>

<style scoped lang="scss">
.badge {
  display: inline-block;

  span {
    padding: 5px 15px;
    border: 1px solid #e8e8e8;
    border-radius: 25px;
    margin: 0 2px;
    font-size: 0.9em;
    opacity: 0.5;

    &.active {
      opacity: 1;
      font-weight: bold;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
