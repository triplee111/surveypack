<template lang="pug">
  AttrBtn(
    :state="true"
    @toggle="showEditor = true")
    QIcon(
      size="0.9rem"
      name="view_module")
    span.q-ml-xs 選項顯示方式

    QDialog(
      v-model="showEditor"
      persistent)
      QCard(style="min-width: 600px;")
        QCardSection.bg-teal.text-white
          .text-body1 選項顯示方式

        QCardSection.q-pa-xs.q-mb-sm
          .text-body2.q-gutter-x-sm
            QRadio(
              v-model="ui"
              val="radiobox"
              label="一般模式")
            QRadio(
              v-model="ui"
              val="menu"
              label="下拉式選單")

        QSeparator.q-mx-sm

        QCardSection(v-show="ui === 'menu'")
          .col-12.text-center(style="line-height: 2")
            QIcon(
              color="grey"
              size="3rem"
              name="fa fa-list-alt")
            br
            span 此題選項使用下拉式選單方式呈現

        QCardSection.q-pa-xs(v-show="ui === 'radiobox'")
          .row.q-mb-lg
            .col-12.text-body2 每排固定顯示個數
          .row.q-mb-lg
            .col-6.q-pr-md
              QSelect(
                v-model="columns.desktop"
                v-bind="qSelectStyle"
                :options="layoutOpts")
                template(#before)
                  .row.wrap
                    .col-12.text-center(style="line-height: 1")
                      QIcon(
                        size="md"
                        name="desktop_windows")
                      br
                      span.text-blue-grey-6.text-weight-bold 電腦版

            .col-6.q-pr-md
              QSelect(
                v-model="columns.mobile"
                v-bind="qSelectStyle"
                :options="layoutOpts")
                template(#before)
                  .row.wrap
                    .col-12.text-center(style="line-height: 1")
                      QIcon(
                        size="md"
                        name="smartphone")
                      br
                      span.text-blue-grey-6.text-weight-bold 手機版

          .row.q-mx-md
            .col-12.bg-grey-3.q-py-sm
              ul
                li 手機版畫面的呈現尺寸由前台專案開發控制，目前尚未制訂規範

        QCardActions.q-mt-sm.bg-white.text-teal(align="right")
          QBtn(
            v-close-popup
            color="primary"
            flat
            label="取消"
            @click="reset")

          QBtn(
            v-close-popup
            color="primary"
            unelevated
            label="確定"
            @click="confirm")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { QCardActions, QSeparator } from 'quasar'

import { Que } from '@/types'

import AttrBtn from './attrBtn'

@Component({
  components: {
    AttrBtn,
    QCardActions,
    QSeparator
  }
})
export default class AttrOptLayout extends Vue {
  @Prop({ type: Object })
  readonly queModel!: Que

  private showEditor = false
  private ui = 'radiobox'
  private columns = {
    desktop: 2,
    mobile: 1
  }

  private layoutOpts = Array.from(Array(4)).map((_value, index) => {
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
    this.initState()
  }

  private confirm() {
    let config = {
      ...this.queModel.config,
      optsUi: this.ui
    }

    if (this.ui === 'menu' && this.queModel.config?.optsUi === 'radiobox') {
      delete config.optsColumn
    }

    if (this.ui === 'radiobox') {
      config = {
        ...config,
        optsColumn: this.columns
      }
    }

    this.$emit('update:queModel', {
      ...this.queModel,
      config
    })

    this.showEditor = false
  }

  private initState() {
    if (this.queModel.config?.optsUi) {
      this.ui = this.queModel.config.optsUi
    }

    if (this.queModel.config?.optsColumn) {
      this.columns = this.queModel.config.optsColumn
    }
  }

  private reset() {
    this.initState()
    this.showEditor = false
  }
}
</script>
