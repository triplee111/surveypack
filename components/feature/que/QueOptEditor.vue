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
            @input="updOpt")

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

          //- QIcon.cursor-pointer.inline(
          //-   size="xs"
          //-   color="grey-5"
          //-   name="launch")
          //-   QTooltip(
          //-     anchor="top middle"
          //-     self="bottom middle"
          //-     transition-show="fade"
          //-     transition-hide="fade"
          //-     :offset="[0, 5]") 跳至指定問題

          //- QIcon.cursor-pointer.inline(
          //-   size="xs"
          //-   color="grey-5"
          //-   name="link")
          //-   QTooltip(
          //-     anchor="top middle"
          //-     self="bottom middle"
          //-     transition-show="fade"
          //-     transition-hide="fade"
          //-     :offset="[0, 5]") 連接隱藏問題

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
          @input="updOpt")

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

        //- QIcon.cursor-pointer.inline(
        //-   size="xs"
        //-   color="grey-5"
        //-   name="launch")
        //-   QTooltip(
        //-     anchor="top middle"
        //-     self="bottom middle"
        //-     transition-show="fade"
        //-     transition-hide="fade"
        //-     :offset="[0, 5]") 跳至指定問題

        //- QIcon.cursor-pointer.inline(
        //-   size="xs"
        //-   color="grey-5"
        //-   name="link")
        //-   QTooltip(
        //-     anchor="top middle"
        //-     self="bottom middle"
        //-     transition-show="fade"
        //-     transition-hide="fade"
        //-     :offset="[0, 5]") 連接隱藏問題

</template>

<script lang="ts">
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'

import { QueOpt } from '@/types'
import { optOthers } from '@/units/template'

import { QTooltip } from 'quasar'
import { Prop, Component, Watch, Vue } from 'vue-property-decorator'

@Component({
  components: {
    QTooltip,
    draggable
  }
})
export default class QueOptEditor extends Vue {
  @Prop({ type: Number })
  readonly no!: number

  @Prop({ type: Boolean, default: false })
  readonly others!: boolean

  @Prop({ type: Array, default: () => [] })
  readonly opts!: QueOpt[]

  @Prop({ type: Boolean, default: false })
  readonly editState!: boolean

  private optsModel: QueOpt[] = []
  private optOthers = { ...optOthers }

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

  private add() {
    if (this.optNums >= 15) return

    this.optsModel.push({
      id: -1,
      item: '',
      visible: true
    })

    this.updOpt()
  }

  private remove(index: number) {
    if (this.optNums <= 1) return

    this.optsModel.splice(index, 1)

    this.updOpt()
  }

  private toggleVisible(index: number, opt: QueOpt) {
    opt.visible = !opt.visible

    this.optsModel[index].visible = opt.visible

    this.updOpt()
  }

  private removeOtherOpt() {
    if (!this.hasOthers) return

    this.hasOthers = false
    this.$emit('update:opts', this.optsModel)
  }

  private updOpt() {
    if (this.hasOthers) {
      this.$emit('update:opts', this.optsModel.concat(this.optOthers))
    } else {
      this.$emit('update:opts', this.optsModel)
    }
  }

  private getChar(index: number) {
    return String.fromCharCode(index + 97)
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
</style>
