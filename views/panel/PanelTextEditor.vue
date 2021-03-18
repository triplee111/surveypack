<template lang="pug">
  .col
    EditorContainer(
      @fetch="getter"
      @save="setter"
      @reset="reset")

      template(v-slot:editor-card-header)
        i(:class="$route.meta.icon")
        | &nbsp;&nbsp;{{ $route.query.title }}

      template(v-slot:text-editor="{ id }")
        QuasarEditor(
          v-model="content"
          :qid="`${id}-rule`")

    BaseCard
      template(v-slot:card-header)
        i.fa.fa-map-marker
        | &nbsp;&nbsp;功能說明

      ul.q-gutter-sm.q-px-lg
        li 受限於活動本身的樣式設計，目前主要功能為誤字校正或可行範圍內的文案調整，如果有較複雜的修改請一樣聯繫系統部
        li 文案編輯不限定於規則頁，依專案需求彈性擴充

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import { EditorContent } from '@src/types'
import service from '@/service/serviceContainer'

import { normal, danger } from '@u/notify/notify-quasar'
import CatchMixin from '@core/mixin/cacheMixin'
import EditorContainer from '@m/editor/index'
import QuasarEditor from '@c/editor/QuasarEditor.vue'

@Component({
  components: {
    EditorContainer,
    QuasarEditor
  }
})
export default class PanelTextEditor extends CatchMixin {
  private default = ''
  private content = ''

  private async getter() {
    const editorContent = await service.$survey.getCopy(this.$route.params.id)

    if (editorContent) {
      this.content = editorContent
      this.default = editorContent
    }
  }

  private async setter() {
    try {
      await service.$survey.setCopy(this.$route.params.id, this.content)

      normal('編輯內容設定完成')
    } catch (err) {
      danger(err.data)

      throw new Error(err.data)
    }
  }

  private reset() {
    this.content = this.default
  }
}
</script>
