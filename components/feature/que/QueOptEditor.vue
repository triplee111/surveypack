<template lang="pug">
  .opts-editor
    draggable(
      v-model="optsModel"
      group="opts"
      :animation="300"
      handle=".opt-drag")
      .row.opt-general.q-my-sm(
        v-for="(opt, index) in optsModel"
        :key="`opt-input-${no}-${index}`")

        label.opt-drag.q-mr-sm.opt-label
          span.text-grey-9 {{ getChar(index) }}

        .opt-item.q-mr-sm
          QInput(
            v-model="opt.item"
            color="grey-5"
            debounce="100"
            outlined
            dense
            @input="updOpts")

          .concat.q-mb-sm(v-if="opt.concat && opt.concat.length")
            .link-icon.float-left
              QIcon(
                name="link"
                size="1rem"
                color="white")

            .link-ques(style="margin-left: 35px;")
              .text-body2.q-pb-sm(v-for="qid in opt.concat")
                span {{ getQueConcated(qid) }}

        .opt-action.q-gutter-x-xs(v-show="editState")
          QIcon.cursor-pointer(
            size="xs"
            color="grey-5"
            name="add"
            @click="add")
            QTooltip(
              anchor="top middle"
              self="bottom middle"
              transition-show="fade"
              transition-hide="fade"
              :offset="[0, 5]") 新增選項

          QIcon.cursor-pointer(
            size="xs"
            color="grey-5"
            name="remove"
            @click="remove(index)")
            QTooltip(
              anchor="top middle"
              self="bottom middle"
              transition-show="fade"
              transition-hide="fade"
              :offset="[0, 5]") 移除選項

          QIcon.cursor-pointer.inline(
            size="xs"
            :color="linkIconColor(opt)"
            name="link"
            @click="showConcatDialog(index)")
            QTooltip(
              anchor="top middle"
              self="bottom middle"
              transition-show="fade"
              transition-hide="fade"
              :offset="[0, 5]") 連接問題

          QIcon.cursor-pointer.inline(
            size="xs"
            color="grey-5"
            name="launch"
            @click="proWarning")
            QTooltip(
              anchor="top middle"
              self="bottom middle"
              transition-show="fade"
              transition-hide="fade"
              :offset="[0, 5]") 跳至問題

          QIcon.cursor-pointer(
            size="xs"
            :color="opt.visible ? 'grey-5' : 'grey-8'"
            :name="opt.visible ? 'visibility' : 'visibility_off'"
            @click="toggleVisible(index, opt)")
            QTooltip(
              anchor="top middle"
              self="bottom middle"
              transition-show="fade"
              transition-hide="fade"
              :offset="[0, 5]") 隱藏選項

    .row.opt-others(v-if='hasOthers')
      label.opt-drag.q-mr-sm.opt-label
        span.text-orange-6 {{ getChar(optNums) }}

      .opt-item.q-mr-sm
        QInput(
          v-model="optOthers.item"
          color="orange-4"
          outlined
          debounce="100"
          dense
          @input="updOpts")

        .concat.q-mb-sm(v-if="optOthers.concat && optOthers.concat.length")
          .link-icon.float-left
            QIcon(
              name="link"
              size="1rem"
              color="white")

          .link-ques(style="margin-left: 35px;")
            .text-body2.q-pb-sm(v-for="qid in optOthers.concat")
              span {{ getQueConcated(qid) }}

      .opt-action.q-gutter-x-xs(v-show="editState")
        QIcon.cursor-pointer.inline(
          size="xs"
          color="grey-5"
          name="delete"
          @click="removeOtherOpt")
          QTooltip(
            anchor="top middle"
            self="bottom middle"
            transition-show="fade"
            transition-hide="fade"
            :offset="[0, 5]") 移除

        QIcon.cursor-pointer.inline(
          size="xs"
          color="grey-5"
          name="link"
          @click="concatDialogState = true")
          QTooltip(
            anchor="top middle"
            self="bottom middle"
            transition-show="fade"
            transition-hide="fade"
            :offset="[0, 5]") 連接問題

        QIcon.cursor-pointer.inline(
          size="xs"
          color="grey-5"
          name="launch"
          @click="proWarning")
          QTooltip(
            anchor="top middle"
            self="bottom middle"
            transition-show="fade"
            transition-hide="fade"
            :offset="[0, 5]") 跳至問題

    QDialog(
      v-model="concatDialogState"
      persistent)
      QCard(style="min-width: 700px;")
        QCardSection.bg-teal.text-white
          span.text-body1 選擇連接的題目

          QBtn.float-right(
            color="grey-5"
            v-close-popup
            size="0.7rem"
            dense
            flat
            icon="close")

        QCardSection.text-body2
          .row.q-mx-md.q-mb-md
            .col-12.bg-light-blue-1.q-py-sm
              span.text-blue-5 接題對象在前台會轉為隱藏狀態，只有在使用者選擇對應選項時，才會出現；單一選項可連接多個題目。
              span.text-blue-5 接題隱藏跟題目的隱藏屬性各別獨立，題項隱藏屬性優先於接題

          QMarkupTable(
            v-if="concatDialogState"
            flat)
            thead
              tr.text-grey-7
                th(width="5%") #
                th(width="4%")
                th 題目
            tbody
              tr(v-for="que in relationQues")
                td(style="padding: 0")
                  QCheckbox(
                    v-model="concatSelected"
                    :val="que.id")
                td.text-blue-grey-6.text-center(style="padding: 0") {{ que.no }}
                td
                  span.text-body2 {{ que.content }}

        QCardActions.q-mt-sm.bg-white.text-teal(align="right")
          QBtn(
            v-close-popup
            color="primary"
            flat
            label="取消接題"
            @click="resetConcat()")
          QBtn(
            v-close-popup
            color="primary"
            unelevated
            label="確定"
            @click="setConcat()")

</template>

<script lang="ts">
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'

import { QTooltip, QIcon, QDialog, QCardActions, QMarkupTable } from 'quasar'
import { Prop, Component, Vue } from 'vue-property-decorator'

import { QueOpt, Que } from '@/types'
import { optOthers } from '@/units/template'

import { warning } from '@src/utils/notify/notify-quasar'

@Component({
  components: {
    QTooltip,
    QIcon,
    draggable,
    QDialog,
    QCardActions,
    QMarkupTable
  }
})
export default class QueOptEditor extends Vue {
  @Prop({ type: Number })
  readonly no!: number

  @Prop()
  readonly qid!: number | string

  @Prop({ type: Boolean, default: false })
  readonly others!: boolean

  @Prop({ type: Array, default: () => [] })
  readonly opts!: QueOpt[]

  @Prop({ type: Boolean, default: false })
  readonly editState!: boolean

  @Prop({ type: Array })
  readonly quesState!: Que[] // 元件的 ques data, 非 store data

  private optsModel: QueOpt[] = []
  private optOthers = { ...optOthers }

  private concatTargetIndex = -1
  private concatSelected: Array<string | number> = []

  private concatDialogState = false

  get relationQues() {
    let no = 0

    return this.quesState.reduce(
      (acc, que) => {
        if (que.type === 'quote' || que.type === 'divider') {
          return acc
        }

        no++

        if (que.id === this.qid) {
          return acc
        }

        acc.push({
          no,
          id: que.id,
          content: que.content
        })

        return acc
      },
      [] as Array<{
        no: number
        id: string | number
        content: string
      }>
    )
  }

  get hasOthers() {
    return this.others
  }
  set hasOthers(bool) {
    this.$emit('update:others', bool)
  }

  get optNums() {
    return this.optsModel.length
  }

  mounted() {
    this.observeOpts()
    this.observeOthers()
    this.observeRelationQuesState()
  }

  private observeOpts() {
    this.$watch(
      'opts',
      (opts: QueOpt[]) => {
        const optsCopy = cloneDeep(opts)

        if (this.hasOthers && opts.length) {
          this.optOthers = optsCopy.pop()!
        }
        this.optsModel = optsCopy
      },
      {
        deep: true,
        immediate: true
      }
    )
  }

  private observeOthers() {
    this.$watch('others', (state: boolean, oldState: boolean) => {
      if (state && !oldState) {
        this.hasOthers = true
        this.$emit('update:opts', this.optsModel.concat(this.optOthers))
      } else if (!state && oldState) {
        this.optOthers = { ...optOthers }
        this.hasOthers = false
        this.$emit('update:opts', this.optsModel)
      }
    })
  }

  private observeRelationQuesState() {
    this.$watch('relationQues', (state: Que[], oldState: Que[]) => {
      if (state.length < oldState.length) {
        const queRemoved = oldState.filter(
          ({ id: id1 }) => !state.some(({ id: id2 }) => id2 === id1)
        )
        const qid = queRemoved[0].id

        this.optsModel = this.optsModel.map(opt => {
          if (opt.concat && opt.concat.includes(qid)) {
            const index = opt.concat.indexOf(qid)
            opt.concat.splice(index, 1)

            if (opt.concat?.length === 0) {
              delete opt.concat
            }
          }

          return opt
        })

        this.updOpts()
      }
    })
  }

  private add() {
    if (this.optNums >= 15) return

    this.optsModel.push({
      id: -1,
      item: '',
      visible: true
    })

    this.updOpts()
  }

  private remove(index: number) {
    if (this.optNums <= 1) return

    this.optsModel.splice(index, 1)

    this.updOpts()
  }

  private toggleVisible(index: number, opt: QueOpt) {
    opt.visible = !opt.visible

    this.optsModel[index].visible = opt.visible

    this.updOpts()
  }

  private removeOtherOpt() {
    if (!this.hasOthers) return

    this.hasOthers = false
    this.$emit('update:opts', this.optsModel)
  }

  private updOpts() {
    if (this.hasOthers) {
      this.$emit('update:opts', this.optsModel.concat(this.optOthers))
    } else {
      this.$emit('update:opts', this.optsModel)
    }
  }

  private getChar(index: number) {
    return String.fromCharCode(index + 97)
  }

  private getQueConcated(qid: string | number) {
    const que = this.relationQues.find(que => que.id === qid)

    return que?.content
  }

  private linkIconColor(opt: QueOpt) {
    return opt.concat?.length ? 'blue' : 'grey-5'
  }

  private showConcatDialog(index: number) {
    const opt = this.optsModel[index]

    if (opt.concat) {
      this.concatSelected = [...opt.concat]
    }

    this.concatTargetIndex = index
    this.concatDialogState = true
  }

  private setConcat() {
    if (this.concatSelected.length > 0) {
      if (this.concatTargetIndex === -1) {
        // option others handler
        this.optOthers.concat = [...this.concatSelected]
      } else {
        const opt = this.optsModel[this.concatTargetIndex]
        opt.concat = [...this.concatSelected]

        this.optsModel.splice(this.concatTargetIndex, 1, opt)
      }
    } else {
      if (this.concatTargetIndex === -1) {
        delete this.optOthers.concat
      } else {
        const opt = this.optsModel[this.concatTargetIndex]
        delete opt.concat

        this.optsModel.splice(this.concatTargetIndex, 1, opt)
      }
    }

    this.updOpts()

    this.concatTargetIndex = -1
    this.concatSelected = []
  }

  private resetConcat() {
    const opt = this.optsModel[this.concatTargetIndex]

    if (this.concatTargetIndex === -1) {
      if (this.optOthers.concat && this.optOthers.concat.length === 0) {
        delete this.optOthers.concat

        this.updOpts()
      }
    } else {
      if (opt.concat && opt.concat.length === 0) {
        delete opt.concat

        this.optsModel.splice(this.concatTargetIndex, 1, opt)
        this.updOpts()
      }

      this.concatTargetIndex = -1
    }

    this.concatSelected = []
  }

  private proWarning() {
    warning('專案版功能，請付費解鎖')
  }
}
</script>

<style lang="stylus">
.opts-editor
  .q-field
    &--dense
      .q-field__control, .q-field__marginal
        height: 30px !important

  .opt-general
  .opt-others
    .opt-item
      width 75%
    .opt-action
      padding-left 5px;

  .opt-action
    padding-top 2px

    i
      &:hover
        color #9e9e9e !important

  .opt-label
    min-width 30px
    font-size 0.95rem
    text-align center
    font-weight bold
    padding-top 2px
    cursor grab

  .opt-general
    .opt-label
      &:hover
        background-color #eee

  .link-icon
    display inline
    background-color #29b6f6
    border-radius 1.5rem
    padding 0 2.5px
    line-height 1rem
    height 20px
</style>
