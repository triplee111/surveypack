<template lang="pug">
  SubjectContainer(
    :que.sync="que"
    @cancel="$emit('cancel', order - 1)"
    @copy="$emit('copy', que)")

    template(#header="{ editState }")
      HeaderGroup(
        icon="notes"
        :no="no"
        :editState="editState"
        :required="que.required"
        :visible="que.visible")

    template(#default)
      ContentInput(v-model="que")

    template(#que-attrs)
      AttrContainer(
        :que.sync="que"
        :queAttrs="attrs")

    template(#que-sub)
      QInput(
        style="max-width: 500px;"
        :input-style="{ color: '#999' }"
        value="多行文字"
        readonly
        filled
        dense)

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import SubjectContainer from './SubjectContainer'
import AttrContainer from '@/components/feature/attrs/AttrContainer'

import HeaderGroup from '@/components/feature/que/QueHeaderGroup.vue'
import ContentInput from '@/components/feature/que/QueContentInput.vue'

@Component({
  model: {
    event: 'update'
  },
  components: {
    SubjectContainer,
    AttrContainer,
    HeaderGroup,
    ContentInput
  }
})
export default class SubjectTextarea extends Vue {
  @Prop({ type: Number })
  readonly order!: number

  @Prop({ type: Number })
  readonly no!: number

  @Prop({ type: Object })
  readonly value!: Que

  private attrs = ['comment', 'required', 'visible']

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }
}
</script>
