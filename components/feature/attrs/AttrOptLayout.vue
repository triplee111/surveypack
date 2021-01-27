<template lang="pug">
  AttrBtn(
    :state="state"
    @toggle="toggle")
    QIcon(
      size="0.9rem"
      name="view_module")
    span.q-ml-xs 選項顯示方式

    QDialog(
      v-model="showEditor"
      persistent)
      QCard(style="min-width: 550px;")
        QCardSection.bg-teal.text-white
          .text-body1 選項顯示方式

        QCardSection.q-pa-xs.q-mb-sm
          .text-body2.q-gutter-x-sm
            QRadio(
              val="radiobox"
              label="一般模式")
            QRadio(
              val="select"
              label="下拉式選單")

        QSeparator.q-mx-sm

        QCardSection.q-pa-xs
          .row.q-mb-lg
            .col-12.text-body2 每排固定顯示個數
          .row.q-mb-lg
            .col-6.q-px-md
              QSelect(
                v-bind="qSelectStyle"
                option-label="label"
                option-value="value"
                :options="layoutOpts")
                template(#before)
                  span.text-blue-grey-6.text-weight-bold.q-mr-md 電腦版

            .col-6.q-px-md
              QSelect(
                v-bind="qSelectStyle"
                :options="layoutOpts")
                template(#before)
                  span.text-blue-grey-6.text-weight-bold.q-mr-md 手機版
          .row.q-mx-md
            .col-12.bg-grey-3.q-py-sm
              ul
                li 手機版畫面的呈現尺寸由前台專案開發控制，目前尚未制訂規範

        QCardActions.q-mt-sm.bg-white.text-teal(align="right")
          QBtn(
            v-close-popup
            color="primary"
            flat
            label="取消")

          QBtn(
            v-close-popup
            color="primary"
            unelevated
            label="確定")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { QDialog, QCardActions, QSeparator } from 'quasar'

import { Que } from '@/types'

import AttrBtn from './attrBtn'

@Component({
  components: {
    AttrBtn,
    QDialog,
    QCardActions,
    QSeparator
  }
})
export default class AttrOptLayout extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  @Prop({ type: String })
  readonly portalId!: string

  private state = true
  private showEditor = false

  private layoutOpts = Array.from(Array(5)).map((_value, index) => {
    const squares = Array.from(Array(index + 1)).reduce(acc => {
      acc += '<i class="fa fa-square q-mr-xs"></i>'
      return acc
    }, '')

    return {
      label: `${squares} <span class="float-right q-mr-lg">${index + 1}</span>`,
      value: index + 1
    }
  })
  private qSelectStyle = {
    outlined: true,
    dense: true,
    'no-error-icon': true,
    'emit-value': true,
    'options-dense': true,
    'map-options': true
  }

  mounted() {
    this.observeState()
  }

  private toggle() {
    this.showEditor = true
    // if (this.state) {

    //   const config = {
    //     ...this.queModel.config,
    //     quote: this.quote
    //   }

    //   this.$emit('update:queModel', {
    //     ...this.queModel,
    //     config
    //   })
    // } else {
    //   this.reset()
    // }
  }

  private observeState() {
    // this.$watch(
    //   'hasRange',
    //   (value: boolean) => {
    //     this.state = value
    //     if (value) {
    //       this.range = this.optsRange
    //     }
    //   },
    //   {
    //     immediate: true
    //   }
    // )
  }
}
</script>
