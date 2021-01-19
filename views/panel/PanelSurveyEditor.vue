<template lang="pug">
  .col
    FormContainer(
      :stepper="stepper"
      :linear="false")
      template(v-slot:form-card-header)
        i(:class="$route.meta.icon")
        span.q-ml-sm {{ mode === 'add' ? '新增空白問卷' : config.name }}

      template(#form-card-header-action)
        a.card-header-action(
          v-b-tooltip.hover
          :title="isFullScreen ? '結束全螢幕' : '全螢幕模式'"
          href="#"
          @click.prevent="toggleFullScreen")
          QIcon(
            size="1.3rem"
            :name="isFullScreen ? 'fullscreen_exit' : 'fullscreen'")

      //- step1
      template(v-slot:form-step-1="{ id }")
        InfoConfig(v-model="config")

      //- step2
      template(v-slot:form-step-2="{ id }")
        QuesConfig(v-model="ques")

      template(v-slot:form-card-buttons="{ step, stepTo, save }")
        QBtn(
          v-show="step === 1"
          :disable="!step1Checker"
          unelevated
          push
          icon="arrow_forward"
          size="md"
          color="cyan-7"
          label="下一步"
          @click="stepTo(2)")
        QBtn(
          v-show="step === 2"
          unelevated
          push
          icon="arrow_back"
          size="md"
          color="cyan-7"
          label="上一步"
          @click="stepTo(1)")

        QBtn(
          :disable="!(step1Checker && step2Checker)"
          unelevated
          push
          icon="save"
          size="md"
          color="primary"
          label="儲存問卷"
          @click.prevent="setter(save)")

    BaseCard
      template(v-slot:card-header)
        i.fa.fa-map-marker
        | &nbsp;&nbsp;功能說明

      ul.q-gutter-sm.q-px-lg
        li 新增的問題在沒有按下「完成」之前，按「取消」相等於刪除問題
        li 問卷題目較多的時候，建議開啟右上角的全螢幕模式

</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'

import { Survey, SurveyInfo, Que, SurveyConfig } from '@/types'

import InfoConfig from '@/components/FormInfoConfig.vue'
import QuesConfig from '@/components/FormQuesConfig.vue'

import { FormContent } from '@src/types'
import apiPathResolver from '@u/helper/api-path-resolve'
import CatchMixin from '@core/mixin/cacheMixin'
import FormContainer from '@m/form'

@Component({
  components: {
    FormContainer,
    InfoConfig,
    QuesConfig
  }
})
export default class PanelSurveyEditor extends CatchMixin {
  @Prop({ type: String })
  readonly parentView!: string

  private config = {}
  private ques: Que[] = []
  private isFullScreen = false

  get configState(): SurveyInfo {
    return this.$store.getters['survey/targetConfig']
  }

  get quesState(): Que[] {
    return this.$store.getters['survey/targetQues']
  }

  get mode() {
    return this.$route.params.id === 'add' ? 'add' : 'edit'
  }

  get stepper() {
    const { step1Checker } = this
    return [
      {
        title: '基本設定',
        error: !step1Checker,
        done: step1Checker
      },
      {
        title: '題目編輯',
        icon: 'settings',
        error: false,
        done: false
      }
    ]
  }

  get step1Checker(): boolean {
    const { name, title, dateRange } = this.config as SurveyInfo
    return (
      !!name && !!title && (dateRange.length === 0 || dateRange.length === 2)
    )
  }

  get step2Checker(): boolean {
    const isDisable = this.ques.some(que => {
      const { content, opts } = que

      if (content === '') return true

      if (opts) {
        return opts.some(opt => opt.item === '')
      }
    })

    return !isDisable
  }

  init() {
    if (this.mode === 'add') {
      this.$store.dispatch('survey/setNewSurvey').then(() => {
        this.config = {
          ...this.configState,
          dateRange: [...this.configState.dateRange]
        }
      })
    } else {
      this.$store
        .dispatch('survey/read', parseInt(this.$route.params.id))
        .then(() => {
          this.config = {
            ...this.configState,
            dateRange: [...this.configState.dateRange]
          }
          this.ques = JSON.parse(JSON.stringify(this.quesState))
        })
    }
  }

  // leaved() {
  //   this.$store.dispatch('survey/setListSurvey', {
  //     ...this.config,
  //     ques: this.ques
  //   })
  // }

  private async setter(): Promise<void> {
    const currentRoute = this.$route.fullPath
    let sid = this.$route.params.id

    if (this.mode === 'add') {
      sid = await this.$store.dispatch('survey/create', {
        info: this.config,
        ques: this.ques
      })
    } else {
      await this.$store.dispatch('survey/update', {
        info: this.config,
        ques: this.ques
      })
    }

    this.$store.dispatch('cached/clearCache', this.parentView)

    await this.$store.dispatch('view/delView', this.$route)
    await this.$store.dispatch('cached/clearCache', currentRoute)

    this.$router.push({
      path: `/panel/config-survey/${sid}`,
      query: {
        title: this.truncateStr((this.config as SurveyInfo).name, 8)
      }
    })
  }

  private toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen

    const target = document.querySelector('div.card')
    // @ts-expect-error
    this.$q.fullscreen.toggle(target)
  }

  private truncateStr(str: string, num: number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '..'
  }
}
</script>
