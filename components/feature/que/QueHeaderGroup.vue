<template lang="pug">
  .que-header-group.q-gutter-x-xs
    .que-header-icon.q-py-xs(:class="numberIconBgColor")
      span.text-white {{ no }}

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

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class QueHeaderGroup extends Vue {
  @Prop({ type: Number })
  readonly no!: number

  @Prop({ type: Boolean })
  readonly editState!: boolean

  @Prop({ type: String })
  readonly icon!: string

  @Prop({ type: Boolean, default: false })
  readonly required!: boolean

  @Prop({ type: Boolean, default: true })
  readonly visible!: boolean

  get numberIconBgColor() {
    return this.editState ? 'bg-success' : 'bg-green-4'
  }

  get otherIconBgColor() {
    return this.editState ? 'bg-blue-grey-4' : 'bg-blue-grey-3'
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
