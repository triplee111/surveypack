<template lang="pug">
  AttrBtn(
    :state.sync="state"
    @toggle="toggle")
    QIcon(name="format_quote")
    span.q-ml-xs 設定引言

    Portal(
      v-if="state"
      :to="`attr-footer-${portalId}`"
      :order="2")

      .q-mt-md
        .row
          .col-xs-11
            QInput(
              :input-style="{ cursor: 'pointer' }"
              rows="1"
              readonly
              outlined
              :value="quote"
              type="textarea"
              label="預覽"
              @click.prevent="showEditor = true")

      QDialog(
        v-model="showEditor"
        persistent)

        QCard(style="min-width: 550px;")
          QCardSection.bg-teal.text-white
            .text-body1 設定引言內容

          QCardSection.q-pa-none
            QuasarEditor(
              v-model="quote"
              :qid="`quote-${queModel.id}`")

          QCardActions.q-mt-sm.bg-white.text-teal(align="right")
            QBtn(
              v-close-popup
              color="primary"
              flat
              label="清除內容"
              @click="state = false, reset()")

            QBtn(
              v-close-popup
              :disable="quote === ''"
              color="primary"
              unelevated
              label="確定")

</template>

<script lang="ts">
import { QCardActions } from 'quasar'
import { Prop, Component, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import QuasarEditor from '@c/editor/QuasarEditor.vue'
import AttrBtn from './attrBtn'

@Component({
  components: {
    QCardActions,
    QuasarEditor,
    AttrBtn
  }
})
export default class AttrQuote extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  @Prop({ type: String })
  readonly portalId!: string

  private state = false
  private quote = ''
  private showEditor = false

  get quoteCurrent() {
    return this.queModel.config?.quote || ''
  }

  get hasQuote() {
    return !!this.queModel.config?.quote
  }

  mounted() {
    this.observeState()
  }

  private observeState() {
    this.$watch(
      'hasQuote',
      (value: boolean) => {
        this.state = value

        if (value) {
          this.quote = this.quoteCurrent
        }
      },
      {
        immediate: true
      }
    )
  }

  private toggle() {
    if (this.state) {
      this.showEditor = true

      const config = {
        ...this.queModel.config,
        quote: this.quote
      }

      this.$emit('update:queModel', {
        ...this.queModel,
        config
      })
    } else {
      this.reset()
    }
  }

  private reset() {
    this.quote = ''
    this.showEditor = false

    const config = {
      ...this.queModel.config,
      quote: ''
    }

    this.$emit('update:queModel', {
      ...this.queModel,
      config
    })
  }
}
</script>
