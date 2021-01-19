<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="height")
    span.q-ml-xs 選項區間

    Portal(
      v-if="state"
      :to="`attr-footer-${portalId}`"
      :order="1")

      .q-ml-sm.q-mt-lg
        QRange(
          v-model="range"
          color="orange-4"
          label-always
          markers
          :min="1"
          :max="optNums"
          @change="changeRange")

      span.text-body2.text-grey-7 請滑動滑桿設定需要勾選的項目區間，例如 1-5、3-3 等


</template>

<script lang="ts">
import { Prop, Component, Watch, Vue } from 'vue-property-decorator'
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
export default class AttrOptsRange extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  @Prop({ type: String })
  readonly portalId!: string

  private state = false

  private range = {
    min: 1,
    max: 1
  }

  get optNums() {
    const nums = this.queModel.opts!.length
    return nums >= 1 ? nums : 1
  }

  get optsRange() {
    return (
      this.queModel.config!.optsRange || {
        min: 1,
        max: 1
      }
    )
  }

  get hasRange() {
    return !!this.queModel.config!.optsRange
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch(
      'hasRange',
      (value: boolean) => {
        this.state = value

        if (value) {
          this.range = this.optsRange
        }
      },
      {
        immediate: true
      }
    )
  }

  private toggle() {
    if (this.state) {
      this.changeRange()
    } else {
      const config = { ...this.queModel.config }
      delete config.optsRange

      this.range = {
        max: 1,
        min: 1
      }

      this.$emit('update:queModel', {
        ...this.queModel,
        config
      })
    }
  }

  private changeRange() {
    const config = {
      ...this.queModel.config,
      optsRange: this.range
    }

    this.$emit('update:queModel', {
      ...this.queModel,
      config
    })
  }
}
</script>
