<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="visibility_off")
    span.q-ml-xs 隱藏

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
export default class AttrVisible extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  private state = false

  get visible() {
    return this.queModel.visible
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch('visible', (value: boolean) => (this.state = !value), {
      immediate: true
    })
  }

  private toggle() {
    this.$emit('update:queModel', {
      ...this.queModel,
      visible: !this.state
    })
  }
}
</script>
