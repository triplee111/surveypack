<template lang="pug">
  SubjectContainer(
    :que.sync="que"
    @cancel="$emit('cancel', order - 1)"
    @copy="$emit('copy', que)")

    template(#header="{ editState }")
      HeaderGroup(
        icon="check_box"
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

    template(#que-sub="{ editState }")
      OptEditor(
        :no="no"
        :others.sync="que.config.others"
        :opts.sync="que.opts"
        :editState="editState")

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import SubjectContainer from './SubjectContainer'
import AttrContainer from '@/components/feature/attrs/AttrContainer'

import HeaderGroup from '@/components/feature/que/QueHeaderGroup.vue'
import ContentInput from '@/components/feature/que/QueContentInput.vue'
import OptEditor from '@/components/feature/que/QueOptEditor.vue'

@Component({
  model: {
    event: 'update'
  },
  components: {
    SubjectContainer,
    AttrContainer,
    HeaderGroup,
    ContentInput,
    OptEditor
  }
})
export default class SubjectMultiAnswer extends Vue {
  @Prop({ type: Number })
  readonly order!: number

  @Prop({ type: Number })
  readonly no!: number

  @Prop({ type: Object })
  readonly value!: Que

  private attrs = [
    'comment',
    'required',
    'visible',
    'othersOpt',
    'optsRange',
    'optLayout'
  ]

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }
}
</script>
