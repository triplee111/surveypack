import { Prop, Component, Vue } from 'vue-property-decorator'

@Component
export default class AttrBtn extends Vue {
  @Prop({ type: String, default: 'primary' })
  readonly active!: string

  @Prop({ type: String, default: 'grey-5' })
  readonly inactive!: string

  @Prop({ type: Boolean })
  readonly state!: boolean

  get checkState() {
    return this.state
  }
  set checkState(bool) {
    this.$emit('update:state', bool)
  }

  get btnColor() {
    return this.checkState ? this.active : this.inactive
  }

  render() {
    return (
      // @ts-ignore
      <QBtn
        style="padding: 1px 3px;"
        size="xs"
        dense
        unelevated
        color={this.btnColor}
        {...{
          attrs: this.$attrs,
          on: {
            click: () => {
              this.checkState = !this.checkState
              this.$emit('toggle')
            }
          },
          scopedSlots: {
            default: () => this.$slots.default
          }
        }}
      />
    )
  }
}
