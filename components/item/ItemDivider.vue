<template lang="pug">
  ItemContainer(
    :que.sync="que"
    @cancel="$emit('cancel', order - 1)"
    @copy="$emit('copy', que)")

    template(#header="{ editState }")
      HeaderGroup(
        icon="more_horiz"
        :no="order"
        :editState="editState")

    template(#default)
      ContentInput(
        v-model="que"
        dense
        readonly)

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import ItemContainer from './ItemContainer'

import HeaderGroup from '@/components/feature/que/QueHeaderGroup.vue'
import ContentInput from '@/components/feature/que/QueContentInput.vue'

@Component({
  model: {
    event: 'update'
  },
  components: {
    ItemContainer,
    HeaderGroup,
    ContentInput
  }
})
export default class ItemDivider extends Vue {
  @Prop({ type: Number })
  readonly order!: number

  @Prop({ type: Object })
  readonly value!: Que

  private attrs = ['required', 'visible']

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }
}
</script>
