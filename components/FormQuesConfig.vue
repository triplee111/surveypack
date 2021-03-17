<template lang="pug">
  .ques-config
    QSplitter(
      :value="70"
      :style="editorHeight()")
      template(#before)
        QForm(ref="survey-edit-step2")
          template(v-if="ques.length")
            draggable(
              v-model="ques"
              v-bind="draggbleOpts"
              @start="grabToggle"
              @end="grabToggle")
              component(
                v-for="(que, index) in ques"
                v-model="ques[index]"
                :key="que.id"
                :no="getQueNo(index)"
                :order="index + 1"
                :is="getQueComp(que.type)"
                @cancel="cancel"
                @copy="cloneQue")

          .ques-empty.text-center(v-else)
            span.text-body1.text-grey-5 點選右方的題型，開始設計你的問卷！

      template(#after)
        .row.q-ml-lg.q-gutter-y-sm(v-once)
          .col-12.text-grey-7
            span 選項題型
          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="radio_button_checked"
              color="primary"
              label="單選題"
              @click="addQue('choice')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 填答者僅能選擇一個選項

          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="check_box"
              color="primary"
              label="多選題"
              @click="addQue('multianswer')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 填答者可以選擇一至多個選項
          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="grid_on"
              color="primary"
              disable
              label="矩陣題")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 以相同基準選項詢問多個題目
                    br
                    | 例如滿意度評分

          .col-12.text-grey-7.q-pt-sm
            span 輸入題型
          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="short_text"
              color="primary"
              label="單行文字"
              @click="addQue('text')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 讓使用者輸入單行純文字
                    br
                    | 適用於資訊蒐集與簡答

          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="notes"
              color="primary"
              disable
              label="多行文字"
              @click="addQue('textarea')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 讓使用者建立可換行純文字
                    br
                    | 適用於詳答

          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="fa fa-sliders"
              color="primary"
              disable
              label="數字滑桿")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 設定數字區間讓填答者拖曳滑桿選取

          .col-12.text-grey-7.q-pt-sm
            span 排版項目
          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="format_quote"
              color="primary"
              label="引言區塊"
              @click="addQue('quote')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 可用於美化版面或設定段落資訊
                    br
                    | 引導使用者填寫問卷

          .col-6
            QBtn.full-width.subject-selector(
              align="left"
              size="0.8rem"
              outline
              icon="more_horiz"
              color="primary"
              label="分隔線/分頁"
              @click="addQue('divider')")
              .subject-hint.q-pb-xs
                QIcon(
                  color="grey-5"
                  size="1rem"
                  name="help")
                  QTooltip(
                    anchor="top middle"
                    self="center middle"
                    content-class="bg-grey-9")
                    | 產生分隔間距或分頁選項

          .col-12.q-mt-lg
            QBtn(
              no-shadow
              dense
              flat
              unelevated
              @click.prevent="$store.dispatch('survey/collapseOff')")
              QIcon(
                color="grey-6"
                size="0.8rem"
                name="fa fa-compress")
              span.text-body2.text-grey-6.q-ml-xs 收合題目

            QBtn(
              no-shadow
              dense
              flat
              unelevated
              @click.prevent="$store.dispatch('survey/collapseOn')")
              QIcon(
                color="grey-6"
                size="0.8rem"
                name="fa fa-expand")
              span.text-body2.text-grey-6.q-ml-xs  展開題目

    QDialog(
      v-model="confirmState"
      persistent)
      QCard(style="min-width: 300px;")
        QCardSection.bg-teal.text-white
          span.text-body1 刪除題目

          QBtn.float-right(
            color="grey-5"
            v-close-popup
            size="0.7rem"
            dense
            flat
            icon="close")

        QCardSection.text-body2
          p 確認要刪除這個題目嗎？
          p.text-primary(v-show="queToRemove.content") {{ queToRemove.content }}
          p 這個動作在儲存問卷後是不能復原的唷？

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
            label="確定"
            @click.prvent="removeQueWithState")

</template>

<script lang="ts">
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import draggable from 'vuedraggable'

import { Prop, Component, Watch } from 'vue-property-decorator'
import { QSplitter, QCardActions, QTooltip } from 'quasar'

import { QueTypes } from '@/units/template'

import { Que } from '@/types'

import CatchMixin from '@core/mixin/cacheMixin'

const Choice = () => import('./subject/SubjectChoice.vue')
const MultiAnswer = () => import('./subject/SubjectMultiAnswer.vue')
const TextInput = () => import('./subject/SubjectTextInput.vue')
const Textarea = () => import('./subject/SubjectTextarea.vue')
const Quote = () => import('./subject/SubjectQuote.vue')
const Divider = () => import('./subject/SubjectDivider.vue')

@Component({
  model: {
    event: 'update'
  },
  components: {
    QSplitter,
    QCardActions,
    Choice,
    MultiAnswer,
    TextInput,
    Textarea,
    Quote,
    Divider,
    QTooltip,
    draggable
  }
})
export default class QuesConfig extends CatchMixin {
  @Prop()
  readonly value!: Que[]

  private confirmState = false
  private queToRemove = {}
  private queOrderToRemove = 0
  private queLayoutIndex: number[] = [] // 存放排版項目 index，用於題號計算(排版項目無題號)

  private draggbleOpts = {
    group: 'ques',
    forceFallback: true,
    animation: 400,
    handle: '.que-drag'
  }

  get ques() {
    return this.value
  }
  set ques(value) {
    this.$emit('update', value)
  }

  get quesState(): Que[] {
    return this.$store.getters['survey/targetQues']
  }

  @Watch('ques', { immediate: true })
  onQuesChanged(value: Que[]) {
    this.queLayoutIndex = value.reduce((acc: number[], que, index) => {
      if (que.type === 'divider' || que.type === 'quote') {
        acc.push(index)
      }
      return acc
    }, [])
  }

  private addQue(type: keyof typeof QueTypes) {
    const que = JSON.parse(JSON.stringify(QueTypes[type]))

    que.id = this.genQueTempId()

    this.ques.push(que)
  }

  private cloneQue(que: Que) {
    const queClone = JSON.parse(JSON.stringify(que))

    queClone.id = this.genQueTempId()

    this.ques.push(queClone)
  }

  private cancel(index: number) {
    this.queToRemove = this.ques[index]
    this.queOrderToRemove = index + 1

    if (
      this.quesState[index] &&
      this.quesState[index].id === (this.queToRemove as Que).id
    ) {
      this.confirmState = true
    } else {
      this.removeQue()
    }
  }

  private removeQueWithState() {
    this.$store.dispatch('survey/delQue', (this.queToRemove as Que).id)
    this.removeQue()
  }

  private removeQue() {
    this.ques.splice(this.queOrderToRemove - 1, 1)

    this.queToRemove = {}
    this.queOrderToRemove = 0
  }

  private getQueNo(index: number) {
    if (this.queLayoutIndex.includes(index)) {
      return -1
    }

    let no = index + 1

    for (let i of this.queLayoutIndex) {
      if (i > index) {
        break
      }
      no -= 1
    }

    return no
  }

  private getQueComp(queType: string) {
    return upperFirst(camelCase(queType))
  }

  private genQueTempId() {
    return `_${Math.random()
      .toString(36)
      .substr(2, 9)}`
  }

  private editorHeight() {
    return this.$q.fullscreen.isActive ? 'height: 75vh' : 'height: 63vh'
  }

  private grabToggle() {
    const body = document.querySelector('body')
    body?.classList.toggle('cursor-grabbing')
  }
}
</script>

<style lang="stylus">
.sortable-ghost
  opacity 1 !important
  background-color #f3f3f3

.sortable-drag
  opacity 0.1 !important

section.que-container
  i.que-drag
  aside.que-drag
    cursor grab

body.cursor-grabbing
  cursor grabbing !important

  section.que-container
    aside.que-drag
    i.que-drag
      cursor grabbing

.subject-selector
  cursor grabbing
  .subject-hint
    display none
    flex inherit
    text-align right

  &:hover
    .subject-hint
      display block
</style>
