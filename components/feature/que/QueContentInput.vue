<template lang="pug">
  .que-content.q-mr-sm
    QInput.q-mb-xs(
      v-model="que.content"
      v-bind="$attrs"
      color="blue-grey-4"
      dense
      placeholder="題目內容")
      template(#prepend)
        QIcon(
          v-show="hasComment"
          name="comment"
          size="xs"
          color="blue-grey-5")
          QTooltip(
            anchor="top middle"
            self="bottom middle"
            transition-show="fade"
            transition-hide="fade"
            :offset="[0, 5]") 有備註

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { QTooltip } from 'quasar'

import { Que } from '@/types'

@Component({
  inheritAttrs: false,
  components: {
    QTooltip
  }
})
export default class QueContentInput extends Vue {
  @Prop({ type: Object })
  readonly value!: Que

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }

  get hasComment() {
    return !!this.que.comment
  }
}
</script>

<style lang="stylus">
.que-content
  .q-field
    &--dense
      .q-field__control, .q-field__marginal
        height: 30px !important

    &--readonly
      input
        color #777
</style>
