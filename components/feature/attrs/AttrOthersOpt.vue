<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="radio_button_checked")
    span.q-ml-xs 其它

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
export default class AttrOthersOpt extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  private state = false

  get hasOthers() {
    return this.queModel.config?.others || false
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch('hasOthers', (value: boolean) => (this.state = value), {
      immediate: true
    })
  }

  private toggle() {
    const config = {
      ...this.queModel.config,
      others: this.state
    }

    this.$emit('update:queModel', {
      ...this.queModel,
      config
    })
  }
}
</script>
