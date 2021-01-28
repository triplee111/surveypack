<template lang="pug">
  ItemContainer(
    :que.sync="que"
    @cancel="$emit('cancel', order - 1)"
    @copy="$emit('copy', que)")

    template(#header="{ editState }")
      HeaderGroup(
        icon="more_horiz"
        :editState="editState")

    template(#default)
      ContentInput(
        v-model="que"
        dense
        readonly)

    template(#que-attrs)
      AttrBtn(
        :state="false"
        @toggle="showInfo = true")
        span.q-ml-xs 操作與顯示說明

      QDialog(
        v-model="showInfo"
        persistent)
        QCard(style="min-width: 550px;")
          QCardSection.bg-teal.text-white.q-pa-md
            span.text-body1 選項顯示方式
            QBtn.float-right(
              color="grey-5"
              v-close-popup
              size="0.7rem"
              dense
              flat
              icon="close")

          QCardSection.q-gutter-y-sm.q-pa-md
            .text-body1 直式單頁
            .text-body2.text-grey-7
              span 當處於桌機螢幕尺寸時，分隔線由個別前端專案，可以使用單純線條、虛線、或只產生一個間距的方式顯示。

          QCardSection.q-gutter-y-sm.q-pa-md
            .text-body1 多頁小冊
            .text-body2.text-grey-7
              p 當處於手機螢幕尺寸時，分隔線不顯示，將變成分頁的依據，若題目遇到分隔線則會產生下一頁。
              p 若無使用分隔線，則預設為與桌機版顯示模式相同。

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Que } from '@/types'

import ItemContainer from './ItemContainer'

import HeaderGroup from '@/components/feature/que/QueHeaderGroup.vue'
import ContentInput from '@/components/feature/que/QueContentInput.vue'
import AttrBtn from '@/components/feature/attrs/attrBtn'

@Component({
  model: {
    event: 'update'
  },
  components: {
    ItemContainer,
    HeaderGroup,
    ContentInput,
    AttrBtn
  }
})
export default class ItemDivider extends Vue {
  @Prop({ type: Number })
  readonly order!: number

  @Prop({ type: Object })
  readonly value!: Que

  private showInfo = false

  get que() {
    return this.value
  }
  set que(queObj: Que) {
    this.$emit('update', queObj)
  }
}
</script>
