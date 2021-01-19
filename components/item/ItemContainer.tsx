import { Component, Watch, Prop, Vue } from 'vue-property-decorator'
import { QItem, QItemSection, QTooltip, QExpansionItem } from 'quasar'

import { Que } from '@/types'

@Component({
  components: {
    QItem,
    QItemSection,
    QTooltip,
    QExpansionItem
  }
})
export default class ItemContainer extends Vue {
  @Prop()
  readonly que!: Que

  private editState = false
  private queActionState = false
  private attrState = false

  private uuid = ''
  private isCollapse = false

  get qid() {
    return this.que.id
  }

  get quesState() {
    return this.$store.getters['survey/targetQues']
  }

  get queModel() {
    return this.que
  }
  set queModel(que: Que) {
    this.$emit('update:que', que)
  }

  @Watch('editState', { immediate: true })
  onEditStateChange(bool: boolean) {
    this.queActionState = bool
    this.attrState = bool
  }

  created() {
    this.uuid = this.generateId()

    if (typeof this.qid === 'string') this.editState = true
  }

  render() {
    const { editState } = this

    const QueAction = (vnode: any) => (
      <q-icon
        name={vnode.data.attrs.name}
        size="1rem"
        class={`que-main-action ${vnode.data.class}`}
        {...{
          on: {
            click: () => vnode.listeners.click()
          }
        }}
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          transition-show="fade"
          transition-hide="fade"
          offset={[0, 5]}
        >
          {vnode.data.attrs.tip}
        </q-tooltip>
      </q-icon>
    )

    const QueActions = () => (
      <div
        class="q-gutter-x-sm"
        style="padding: 3px 0 5px; border-bottom: 1px solid rgba(0,0,0,0.24);"
      >
        <QueAction
          name="edit"
          tip="開啟編輯"
          class="cursor-pointer"
          {...{
            on: {
              click: () => {
                if (editState) return
                this.editState = true
              }
            }
          }}
        />
        <QueAction
          name="content_copy"
          tip="複製內容"
          class="cursor-pointer"
          {...{
            on: { click: () => this.$emit('copy') }
          }}
        />
        <QueAction
          name="fa fa-trash-o"
          tip="刪除題目"
          class="cursor-pointer"
          {...{
            on: { click: () => this.$emit('cancel') }
          }}
        />
        <QueAction class="que-drag" name="height" tip="排序拖曳" />
      </div>
    )

    return (
      <section
        class="row que-container q-mr-lg q-mb-md"
        {...{
          on: {
            mouseover: () => {
              if (editState) return
              this.queActionState = true
            },
            mouseleave: () => {
              if (editState) return
              this.queActionState = false
            }
          }
        }}
      >
        <aside
          class="que-header col-xs-2 q-pt-xs que-drag"
          style="height: fit-content;"
          {...{
            on: {
              click: () => {
                if (editState) return
                this.isCollapse = !this.isCollapse
              }
            }
          }}
        >
          {this.$scopedSlots.header
            ? this.$scopedSlots.header({ editState })
            : ''}
        </aside>
        <div class="que-content col-xs-10">
          <q-item class="que-main" dense style="padding: 2px 0;">
            <q-item-section
              {...{
                on: { click: () => (this.editState = true) }
              }}
            >
              {this.$scopedSlots.default
                ? this.$scopedSlots.default({ editState })
                : ''}
            </q-item-section>
            <q-item-section
              avatar
              style="margin-left: -2px; padding-left: 2px; align-items: flex-start; justify-content: initial;"
            >
              <div v-show={this.queActionState}>
                <QueActions />
              </div>
            </q-item-section>
          </q-item>

          <div v-show={this.attrState} class="que-attrs q-mb-md">
            {this.$scopedSlots['que-attrs']
              ? this.$scopedSlots['que-attrs']({ editState })
              : ''}
          </div>
          <b-collapse id={`que-sub-${this.uuid}`} visible={!this.isCollapse}>
            <div
              class="que-sub"
              {...{
                on: {
                  click: (event: Event) => {
                    if ((event.target as HTMLInputElement).type === 'text') {
                      this.editState = true
                    }
                  }
                }
              }}
            >
              {this.$scopedSlots['que-sub']
                ? this.$scopedSlots['que-sub']({ editState })
                : ''}
            </div>
          </b-collapse>
        </div>

        <div
          v-show={this.editState}
          class="que-footer col-xs-12 text-right q-gutter-x-sm"
        >
          <q-btn
            class="q-px-xs"
            dense
            unelevated
            flat
            color="primary"
            {...{
              on: {
                click: () => {
                  const qno = this.quesState.findIndex(
                    (q: Que) => q.id === this.qid
                  )

                  if (qno === -1) {
                    this.$emit('cancel')
                  } else {
                    const queState = this.quesState[qno]

                    this.queModel = JSON.parse(JSON.stringify(queState))

                    this.editState = false
                  }
                }
              }
            }}
          >
            取消
          </q-btn>
          <q-btn
            class="q-px-xs"
            dense
            unelevated
            color="primary"
            {...{
              on: {
                click: () => {
                  const qno = this.quesState.findIndex(
                    (q: Que) => q.id === this.qid
                  )

                  if (qno === -1) {
                    this.$store.dispatch('survey/addQue', this.que)
                  } else {
                    this.$store.dispatch('survey/updQue', this.que)
                  }

                  this.editState = false
                }
              }
            }}
          >
            完成
          </q-btn>
        </div>
      </section>
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
