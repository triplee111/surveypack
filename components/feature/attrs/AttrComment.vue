<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="fa fa-tag")
    span.q-ml-xs 備註

    Portal(
      v-if="state"
      :to="`attr-header-${portalId}`"
      :order="1")

      .que-comment
        QInput.q-pt-none(
          v-model="comment"
          input-style="padding-left: 6px;"
          color="grey"
          debounce="100"
          dense
          placeholder="備註")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { QRange, QItem, QItemSection } from 'quasar'

import { Que } from '@/types'

import AttrBtn from './attrBtn'

@Component({
  components: {
    AttrBtn,
    QRange,
    QItem,
    QItemSection
  }
})
export default class AttrComment extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  @Prop({ type: String })
  readonly portalId!: string

  private state = false

  get comment() {
    return this.queModel.comment
  }
  set comment(comment: string) {
    this.$emit('update:queModel', {
      ...this.queModel,
      comment
    })
  }

  get hasComment() {
    return !!this.comment
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch(
      'hasComment',
      (value: boolean) => {
        this.state = value

        if (value) {
          this.comment = this.queModel.comment
        }
      },
      {
        immediate: true
      }
    )
  }

  private toggle() {
    if (!this.state) {
      this.$emit('update:queModel', {
        ...this.queModel,
        comment: ''
      })
    }
  }
}
</script>

<style lang="stylus">
.que-comment
  .q-field
    &--dense
      .q-field__control, .q-field__marginal
        height: 30px !important

    input
      color #666
</style>
