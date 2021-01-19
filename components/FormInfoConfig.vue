<template lang="pug">
.col-xs-12.col-md-8
  QForm(ref="survey-edit-step1")
    .row
      .col-md-2.q-pt-sm
        span.body-text2.text-blue-grey.text-weight-bold 問卷活動名稱
      .col-md-10
        QInput(
          v-model.trim="form.name"
          v-bind="qInputStyle"
          :rules="[val => val !== '' || '請設定問卷活動名稱']"
          hint="問卷活動名稱，前台不使用，可選擇性將活動編號加註於此")

      .col-xs-12.q-gutter-y-sm
        .row.col-xs-12
          .col-md-2.q-pt-md
            span.body-text2.text-blue-grey.text-weight-bold 開放狀態
          .col-md-10
            QToggle(
              v-model="form.active"
              :label="form.active ? '開放填寫' : '關閉/維護'"
              size="lg"
              checked-icon="check"
              color="success"
              unchecked-icon="clear")

        .row.col-xs-12
          .col-md-2.q-pt-sm
            span.body-text2.text-blue-grey.text-weight-bold 進行區間
          .col-md-10
            Datetimepicker.q-ml-sm(
              v-model="form.dateRange"
              mode="range")

        .row.col-xs-12
          .col-md-2.q-pt-md
            span.body-text2.text-blue-grey.text-weight-bold 回收數量上限
          .col-md-10.q-gutter-x-sm
            QToggle(
              v-model="isLimited"
              size="lg"
              checked-icon="check"
              color="success"
              unchecked-icon="clear")

            QInput.inline(
              v-show="isLimited"
              v-model.number="form.limited"
              v-bind="qInputStyle"
              :rules="[val => isInteger(val) || '請輸入正整數']"
              type="number"
              style="width: 120px;"
              input-style="text-align: center;")

        .row.q-mb-md.col-xs-12
          .col-md-2.q-pt-md
            span.body-text2.text-blue-grey.text-weight-bold 參與名單設定
          .col-md-10
            QToggle(
              v-model="form.restrict"
              size="lg"
              checked-icon="check"
              color="success"
              disabled
              unchecked-icon="clear")

        QSeparator.q-mb-lg

        .row
          .col-md-2.q-pt-sm
            span.body-text2.text-blue-grey.text-weight-bold 問卷標題
          .col-md-10
            QInput(
              v-model.trim="form.title"
              v-bind="qInputStyle"
              :rules="[val => val !== '' || '請輸入問卷標題']")

        .row
          .col-md-2.q-pt-sm
            span.body-text2.text-blue-grey.text-weight-bold 問卷描述
          .col-md-10
            QuasarEditor(
              v-model="form.intro"
              qid="survey-edit-intro"
              placeholder="在這裡設定此份問卷/活動的敘述，非必填項目，依前台專案需求而定，可用於規則文案")

</template>

<script lang="ts">
import { Prop, Watch, Component } from 'vue-property-decorator'
import { QSeparator } from 'quasar'

import { Survey, SurveyConfig } from '@/types'

import service from '@/service/serviceContainer'
import QuasarEditor from '@c/editor/QuasarEditor.vue'

import CatchMixin from '@core/mixin/cacheMixin'
import Datetimepicker from '@c/datepicker/Flatpickr.vue'
import errorMessageHandler from '@u/store/error-message-handler'
import { danger } from '@u/notify/notify-quasar'

@Component({
  model: {
    event: 'update'
  },
  components: {
    QSeparator,
    Datetimepicker,
    QuasarEditor
  }
})
export default class InfoConfig extends CatchMixin {
  @Prop()
  readonly value!: SurveyConfig

  private activeLable = '可填寫'
  private isLimited = false

  private qInputStyle = {
    outlined: true,
    dense: true,
    'no-error-icon': true,
    'hide-hint': true
  }

  private qSelectStyle = {
    outlined: true,
    dense: true,
    'no-error-icon': true,
    'emit-value': true,
    'options-dense': true,
    'map-options': true
  }

  get form(): SurveyConfig {
    return this.value
  }
  set form(config: SurveyConfig) {
    this.$emit('update', config)
  }

  @Watch('isLimited')
  onIsLimitedEnable(bool: boolean) {
    this.form.limited = bool ? 0 : -1
  }

  private isInteger(n: number | string) {
    if (typeof n === 'string') n = parseInt(n)

    return !isNaN(n) && isFinite(n) && Number.isInteger(n) && n >= 0
  }
}
</script>
