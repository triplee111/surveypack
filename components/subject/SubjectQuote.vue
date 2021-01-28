<template lang="pug">
  SubjectContainer(
    :que.sync="que"
    @cancel="$emit('cancel', order - 1)"
    @copy="$emit('copy', que)")

    template(#header="{ editState }")
      HeaderGroup(
        icon="format_quote"
        :editState="editState")

    template(#default)
      ContentInput(v-model="que")

    template(#que-attrs)
      AttrContainer(
        :que.sync="que"
        :queAttrs="attrs")

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import SubjectContainer from './SubjectContainer'
import AttrContainer from '@/components/feature/attrs/AttrContainer'

import HeaderGroup from '@/components/feature/que/QueHeaderGroup.vue'
import ContentInput from '@/components/feature/que/QueContentInput.vue'
import AttrQuote from '@/components/feature/attrs/AttrQuote.vue'

@Component({
  model: {
    event: 'update'
  },
  components: {
    SubjectContainer,
    AttrContainer,
    HeaderGroup,
    ContentInput,
    AttrQuote
  }
})
export default class SubjectQuote extends Vue {
  @Prop({ type: Number })
  readonly order!: number

  @Prop({ type: Object })
  readonly value!: Que

  private attrs = ['quote']

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }
}
</script>
