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
                v-for="(que, no) in ques"
                v-model="ques[no]"
                :key="que.id"
                :order="no + 1"
                :is="getQueComp(que.type)"
                @cancel="cancel"
                @copy="cloneQue")

          .ques-empty.text-center(v-else)
            span.text-body1.text-grey-5 點選右方的題型，開始設計你的問卷！

      template(#after)
        .row.q-ml-lg.q-gutter-y-md(v-once)
          .col-12.text-grey-7.q-pt-lg
            span 選項題型
          .col-6
            QBtn.full-width(
              outline
              icon="radio_button_checked"
              color="primary"
              label="單選題"
              @click="addQue('radiobox')")
          .col-6
            QBtn.full-width(
              outline
              icon="check_box"
              color="primary"
              label="多選題"
              @click="addQue('checkbox')")
          .col-6
            QBtn.full-width(
              outline
              icon="grid_on"
              color="primary"
              disable
              label="矩陣題")

          .col-12.text-grey-7.q-pt-sm
            span 輸入題型
          .col-6
            QBtn.full-width(
              outline
              icon="short_text"
              color="primary"
              label="單行文字"
              @click="addQue('text')")
          .col-6
            QBtn.full-width(
              outline
              icon="notes"
              color="primary"
              label="多行文字"
              @click="addQue('textarea')")
          .col-6
            QBtn.full-width(
              outline
              icon="fa fa-sliders"
              color="primary"
              disable
              label="數字滑桿")

          .col-12.text-grey-7.q-pt-sm
            span 排版項目
          .col-6
            QBtn.full-width(
              outline
              icon="format_quote"
              color="primary"
              label="引言"
              @click="addQue('quote')")
          .col-6
            QBtn.full-width(
              outline
              icon="more_horiz"
              color="primary"
              label="分隔線/分頁"
              @click="addQue('divider')")

          .col-12
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
            v-close-popup
            size="0.7rem"
            dense
            flat
            icon="close")

        QCardSection.text-body2
          p 確認要刪除這個題目嗎？
          p.text-primary(v-show="queToRemove.content") {{ queNoToRemove }}. {{ queToRemove.content }}
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

import { Prop, Component } from 'vue-property-decorator'
import { QSplitter, QCardActions } from 'quasar'

import { QueTypes } from '@/units/template'
import service from '@/service/serviceContainer'

import { Que } from '@/types'

import CatchMixin from '@core/mixin/cacheMixin'

const RadioBox = () => import('./item/ItemRadioBox.vue')
const CheckBox = () => import('./item/ItemCheckBox.vue')
const TextInput = () => import('./item/ItemTextInput.vue')
const Textarea = () => import('./item/ItemTextarea.vue')
const Quote = () => import('./item/ItemQuote.vue')
const Divider = () => import('./item/ItemDivider.vue')

@Component({
  model: {
    event: 'update'
  },
  components: {
    QSplitter,
    QCardActions,
    RadioBox,
    CheckBox,
    TextInput,
    Textarea,
    Quote,
    Divider,
    draggable
  }
})
export default class QuesConfig extends CatchMixin {
  @Prop()
  readonly value!: Que[]

  private confirmState = false
  private queToRemove = {}
  private queNoToRemove = 0

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
    this.queNoToRemove = index + 1

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
    this.ques.splice(this.queNoToRemove - 1, 1)

    this.queToRemove = {}
    this.queNoToRemove = 0
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
</style>
