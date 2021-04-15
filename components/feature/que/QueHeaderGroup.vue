<template lang="pug">
  .que-header-group.q-gutter-x-xs
    .que-header-icon.q-py-xs(:class="numberIconBgColor")
      span.text-white(v-if="no") {{ no }}
      span(
        v-else
        :class="numberIconTextColor") -1

    .que-header-icon(:class="otherIconBgColor")
      QIcon(:name="icon")

    .que-header-icon(
      v-show="required"
      :class="otherIconBgColor")
      QIcon(name="star")

    .que-header-icon(
      v-show="!visible"
      :class="otherIconBgColor")
      QIcon(name="visibility_off")

    .que-header-icon(
      v-show="concated.length"
      :class="linkIconBgColor")
      QIcon(name="link")
      QTooltip(
        transition-show="fade"
        transition-hide="fade"
        :offset="[0, 5]")
        ul(style="padding: 0; margin: 0;")
          li(v-for="no in concated")
            | 第 {{ no }} 題

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { QTooltip } from 'quasar'

import { Que, QueOpt } from '@/types'

@Component({
  components: {
    QTooltip
  }
})
export default class QueHeaderGroup extends Vue {
  @Prop({ type: Number })
  readonly no!: number

  @Prop()
  readonly qid?: number | string

  @Prop({ type: Array })
  readonly quesState?: Que[] // 元件的 ques data, 非 store data

  @Prop({ type: Boolean })
  readonly editState!: boolean

  @Prop({ type: String })
  readonly icon!: string

  @Prop({ type: Boolean, default: false })
  readonly required!: boolean

  @Prop({ type: Boolean, default: true })
  readonly visible!: boolean

  private concated: number[] = []

  get numberIconBgColor() {
    return this.editState ? 'bg-success' : 'bg-green-4'
  }

  get numberIconTextColor() {
    return this.editState ? 'text-success' : 'text-green-4'
  }

  get linkIconBgColor() {
    return this.editState ? 'bg-light-blue-5' : 'bg-blue-3'
  }

  get otherIconBgColor() {
    return this.editState ? 'bg-blue-grey-4' : 'bg-blue-grey-3'
  }

  get queWithOpts() {
    if (this.quesState) {
      let no = 0

      return this.quesState.reduce(
        (acc, que) => {
          // TODO: change hard code
          if (que.type === 'quote' || que.type === 'divider') {
            return acc
          }

          no++

          if (que.type === 'choice' || que.type === 'multi-answer') {
            acc.push({
              id: que.id,
              no,
              opts: que.opts as QueOpt[]
            })
          }

          return acc
        },
        [] as Array<{
          id: number | string
          no: number
          opts: QueOpt[]
        }>
      )
    }

    return []
  }

  @Watch('queWithOpts', { deep: true, immediate: true })
  onQueWithOptsChanged(
    ques: Array<{
      id: number | string
      no: number
      opts: QueOpt[]
    }>
  ) {
    this.concated = []

    if (this.qid && ques.length) {
      this.concated = ques.reduce((acc, que) => {
        if (que.opts?.length) {
          if (
            que.opts.some(opt => {
              return (
                opt.concat && opt.concat.includes(this.qid as string | number)
              )
            })
          ) {
            acc.push(que.no)
          }
        }
        return acc
      }, [] as number[])
    }
  }
}
</script>

<style lang="stylus" scoped>
.que-header-group
  .que-header-icon
    width 28px
    padding 3px 0 4.5px
    float left
    cursor pointer
    text-align center
    border-radius 4px

    i
      line-height 1.2px
      color white
</style>
