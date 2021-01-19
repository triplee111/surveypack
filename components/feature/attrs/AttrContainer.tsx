import { Prop, Component, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

const AttrRequired = () => import('./AttrRequired.vue')
const AttrComment = () => import('./AttrComment.vue')
const AttrOthersOpt = () => import('./AttrOthersOpt.vue')
const AttrVisible = () => import('./AttrVisible.vue')
const AttrOptsRange = () => import('./AttrOptsRange.vue')
const AttrQuote = () => import('./AttrQuote.vue')

@Component({
  components: {
    AttrRequired,
    AttrComment,
    AttrOthersOpt,
    AttrVisible,
    AttrOptsRange,
    AttrQuote
  }
})
export default class AttrContainer extends Vue {
  @Prop({ type: Object })
  readonly que!: Que

  @Prop({ type: Array })
  readonly queAttrs!: string[]

  private uuid = ''
  private attrSorting = [
    'required',
    'comment',
    'othersOpt',
    'visible',
    'optsRange',
    'quote'
  ]
  private attrsHasFooter = ['optsRange', 'quote'] // 擁有額外操作介面的屬性按鈕

  get queModel() {
    return this.que
  }
  set queModel(queObj) {
    this.$emit('update:que', queObj)
  }

  get queAttrsSorted() {
    return [...this.queAttrs].sort((a, b) => {
      return this.attrSorting.indexOf(a) - this.attrSorting.indexOf(b)
    })
  }

  get hasFooter() {
    return this.queAttrs.some(attr => this.attrsHasFooter.includes(attr))
  }

  created() {
    this.uuid = this.generateId()
  }

  render() {
    if (!this.queAttrsSorted.length) {
      return <span class="attr-empty"></span>
    }

    const AttrBtns = this.queAttrsSorted.map(attrName => {
      const AttrComponent = `Attr${attrName.charAt(0).toUpperCase() +
        attrName.slice(1)}`

      return (
        <AttrComponent
          {...{
            props: {
              queModel: this.queModel,
              portalId: this.uuid
            },
            on: {
              'update:queModel': (modelUpdated: Que) => {
                this.queModel = modelUpdated
              }
            }
          }}
        />
      )
    })

    if (this.hasFooter) {
      return (
        <div class="attr-container">
          <portal-target name={`attr-header-${this.uuid}`} />
          <div class="attr-body q-gutter-x-sm q-mt-xs">{AttrBtns}</div>
          <portal-target name={`attr-footer-${this.uuid}`} />
        </div>
      )
    }

    return (
      <div class="attr-container">
        <portal-target name={`attr-header-${this.uuid}`} />
        <div class="attr-body q-gutter-x-sm q-mt-xs">{AttrBtns}</div>
      </div>
    )
  }

  private generateId(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 5)
    )
  }
}
