<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="star")
    span.q-ml-xs 必選

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import AttrBtn from './attrBtn'

@Component({
  components: {
    AttrBtn
  }
})
export default class AttrRequired extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  private state = false

  get required() {
    return this.queModel.required
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch('required', (value: boolean) => (this.state = value), {
      immediate: true
    })
  }

  private toggle() {
    this.$emit('update:queModel', {
      ...this.queModel,
      required: this.state
    })
  }
}
</script>
