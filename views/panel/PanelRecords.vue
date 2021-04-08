<template lang="pug">
.col
  GridContainer(
    ref="surveyGridContainer"
    :initFetch="true"
    @fetch="getter"
    @reset="resetter")

    //- Header action
    template(v-slot:grid-card-header-action)
      ExcelExportContainer.card-header-action(
        fileName="SurveyRecords"
        :model="gridModel"
        :data="gridData")

    //- Datatable
    template(v-slot:datatable="{ id, fetch }")
      Quasartable.sticky-column-table(
        :gid='id'
        :model="gridModel"
        :data="gridData"
        :paginateConfig="{ descending: true }")

        template(
          v-for="qid in qidList"
          v-slot:[`col-${qid}`]="{ row }")
          .ans-content(
            v-html="replyFormat(row[qid])")

  BaseCard
    template(v-slot:card-header)
      i.fa.fa-map-marker
      | &nbsp;&nbsp;功能說明

    ul.q-gutter-sm.q-px-lg
      li 使用方向鍵左右可進行換頁

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import { recordModel } from '@/units/datatable/survey'

import { GridList } from '@src/types'

import { Que } from '@/types'

import CatchMixin from '@core/mixin/cacheMixin'
import GridContainer from '@m/grid/index'
import ExcelExportContainer from '@m/excel/export'

import Quasartable from '@c/datatable/Quasartable.vue'

@Component({
  components: {
    GridContainer,
    ExcelExportContainer,
    Quasartable
  }
})
export default class PanelRecords extends CatchMixin {
  $refs!: { surveyGridContainer: GridContainer }

  protected gridModel = recordModel
  protected gridData: GridList = []

  private qidList: string[] = []
  private layoutTypes = ['quote', 'divider'] // TODO: update hardcode

  get quesState(): Que[] {
    return this.$store.getters['survey/targetQues']
  }

  private async getter(
    fetch: (url: string, params?: object) => Promise<GridList>
  ) {
    await this.setQuesHeader()

    const gridData = await fetch(`sv/r/id/${this.$route.params.id}`)
    this.gridData = gridData
  }

  private async setQuesHeader() {
    this.gridModel = recordModel // reset

    const headers = [...this.gridModel.headers]
    const columns = [...this.gridModel.columns] as any[]
    let insertPos = 1

    await this.$store.dispatch('survey/read', parseInt(this.$route.params.id))

    // 處理館別欄位
    for (const que of this.quesState) {
      if (this.layoutTypes.includes(que.type)) {
        let field = `que-${que.id}`

        headers.splice(insertPos, 0, que.content)
        columns.splice(insertPos, 0, {
          name: field,
          label: this.truncate(que.content),
          field,
          align: 'left',
          sortable: true,
          style: 'border-right: 1px solid #ccc;',
          headerStyle:
            'min-width: 180px; width: 180px; white-space: normal; border-right: 1px solid #ccc;'
        })
        insertPos++

        this.qidList.push(field)
      }
    }

    this.gridModel = {
      headers,
      columns
    }
  }

  private replyFormat(reply: string) {
    return reply.replaceAll(',', '<br />')
  }

  private truncate(text: string) {
    const length = 100
    const clamp = '...'

    if (text.length <= length) return text

    let tcText = text.slice(0, length - clamp.length)
    let last = tcText.length - 1

    while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0])
      last -= 1

    // Fix for case when text dont have any `space`
    last = last || length - clamp.length

    tcText = tcText.slice(0, last)

    return tcText + clamp
  }

  private resetter(gridData: GridList): void {
    this.gridData = gridData
  }
}
</script>

<style lang="stylus">
.sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width 100%

  td:first-child
    border-right 1px solid #ccc
    background-color #dff7e4

  th:first-child,
  td:first-child
    position sticky
    left 0
    z-index 1
</style>
