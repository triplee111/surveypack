<template lang="pug">
.col
  GridContainer(
    ref="surveyGridContainer"
    :initFetch="true"
    @fetch="getter"
    @reset="resetter")

    //- Toolbar
    template(#grid-card-toolbar="{ fetch }")
      .q-gutter-x-md.q-my-xs
        //- QSelect.inline(
        //-   v-model="actId"
        //-   v-bind="qSelectStyle"
        //-   :options="activityOps"
        //-   @input="getter(fetch)")
        //-   template(#prepend)
        //-     span.text-blue-grey-6.text-weight-bold 選擇活動

        //-   template(#after)
        //-     QBtn(
        //-       v-if="actId && gridData.length === 0"
        //-       unelevated
        //-       dense
        //-       color="danger"
        //-       icon="delete"
        //-       @click.prevent="delActConfirm = true")

        QBtn(
          unelevated
          outline
          size="md"
          color="primary"
          label="建立新問卷"
          icon="add"
          @click="openAddPanel")


    //- Datatable
    template(v-slot:datatable="{ id, fetch }")
      Quasartable(
        :gid='id'
        :model="gridModel"
        :data="gridData"
        :paginateConfig="{ descending: true }")

        template(v-slot:col-action="{ row }")
          QBtn(
            flat
            dense
            size="md"
            color="grey-10"
            icon="reorder")
            QMenu(
              auto-close
              anchor="center middle"
              self="center middle")
              QList
                QItem(
                  clickable
                  @click="openUpdPanel(row.id, row.name)")
                  QItemSection(
                    avatar
                    style="min-width: 10px; padding-right: 5px;")
                    QIcon(
                      size="xs"
                      left
                      name="edit")
                  QItemSection 編輯

                QItem(
                  clickable
                  @click="getToken(row.id)")
                  QItemSection(
                    avatar
                    style="min-width: 10px; padding-right: 5px;")
                    QIcon(
                      size="xs"
                      left
                      name="link")
                  QItemSection API 接口

                //- QItem(
                //-   clickable
                //-   @click="openUpdPanel(row.id, row.name)")
                //-   QItemSection(
                //-     avatar
                //-     style="min-width: 10px; padding-right: 5px;")
                //-     QIcon(
                //-       size="xs"
                //-       left
                //-       name="content_copy")
                //-   QItemSection 複製

                QItem(
                  v-if="isInQueued(row.id)"
                  clickable
                  disable
                  @click.stop)
                  QItemSection(
                    avatar
                    style="min-width: 10px; padding-right: 5px;")
                    QIcon(
                      size="xs"
                      left
                      name="delete")
                  QItemSection 編輯中...
                QItem(
                  v-else
                  clickable
                  @click="cancelConfirm = true, targetRow = row")
                  QItemSection(
                    avatar
                    style="min-width: 10px; padding-right: 5px;")
                    QIcon(
                      size="xs"
                      left
                      name="delete")
                  QItemSection 刪除

      QDialog(
        v-model="cancelConfirm"
        persistent
        position="top")
        QCard
          QCardSection.row.items-center
            QAvatar(
              size="sm"
              icon="notifications_active"
              color="red"
              text-color="white")
            span.q-ml-md 確定要移除：
            span.text-primary 【{{targetRow.id}}】{{ targetRow.name }} ?
          QCardSection
            span 這個動作是不能復原的唷！建議您刪除前備份填答資料。

          QCardActions.q-mr-sm(align="right")
            QBtn(
              v-close-popup
              flat
              label="取消"
              color="primary")
            QBtn(
              v-close-popup
              unelevated
              label="刪除"
              color="primary"
              @click.prevent="delSurvey")

  QDialog(
    v-model="hasToken"
    persistent)
    QCard
      QCardSection.bg-teal.text-white
        span.text-body1 問卷接口

        QBtn.float-right(
          v-close-popup
          size="0.7rem"
          dense
          flat
          icon="close")

      QCardSection.text-body2.q-gutter-y-sm
        .q-gutter-x-md
          span 取得問卷:
          QInput.inline(
            style="min-width: 300px;"
            readonly
            dense
            outlined
            :value="getApi")

        .q-gutter-x-md
          span 送出問卷:
          QInput.inline(
            style="min-width: 300px;"
            readonly
            dense
            outlined
            :value="postApi")

        .text-center 問卷接口提供給前端開發進行串接

      QCardActions.bg-white.text-teal(align="right")
        QBtn(
          v-close-popup
          color="primary"
          unelevated
          label="關閉")

  BaseCard
    template(v-slot:card-header)
      i.fa.fa-map-marker
      | &nbsp;&nbsp;功能說明

    ul.q-gutter-sm.q-px-lg
      li 「名稱」相等於查詢系統的活動名稱，僅用於後台系統；前台顯示的問卷名稱請在「顯示標題」設定
      li 問卷狀態與進行區間為問卷開放填寫的兩項必要條件，沒設定區間等同於不限時間
      li 問卷活動進行時，可透過改變狀態暫時性的關閉填寫
      li 使用方向鍵左右可進行換頁

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  QDialog,
  QMenu,
  QList,
  QItem,
  QItemSection,
  QCardActions,
  QAvatar
} from 'quasar'

import { listModel } from '@/units/datatable/survey'

import { SurveyInfo } from '@/types'
import { GridList } from '@src/types'

import service from '@/service/serviceContainer'

import CatchMixin from '@core/mixin/cacheMixin'
import GridContainer from '@m/grid/index.tsx'
import ExcelExportContainer from '@m/excel/export'

import Quasartable from '@c/datatable/Quasartable.vue'

@Component({
  components: {
    QMenu,
    QList,
    QItem,
    QItemSection,
    QCardActions,
    QAvatar,
    GridContainer,
    ExcelExportContainer,
    Quasartable
  }
})
export default class SurveyList extends CatchMixin {
  $refs!: { surveyGridContainer: GridContainer }

  protected gridModel = listModel
  protected gridData: GridList = []

  private cancelConfirm = false
  private targetRow = {}

  // 前台使用的接口
  private getApi = ''
  private postApi = ''
  private hasToken = false

  private async getter(
    fetch: (url: string, params?: object) => Promise<void | GridList>
  ) {
    const gridData = await fetch(`sv?platform=${process.env.PROJ_PLATFORM}`)

    if (gridData) {
      this.gridData = gridData
      this.$store.dispatch(
        'survey/setList',
        this.gridData.map(record => {
          const {
            id,
            name,
            title,
            intro,
            active,
            restrict,
            limited,
            dateRange
          } = record

          return {
            id,
            name,
            title,
            intro,
            active,
            restrict,
            limited,
            dateRange: [...dateRange]
          }
        })
      )
    }
  }

  private resetter(gridData: GridList): void {
    this.gridData = gridData
  }

  private openAddPanel(): void {
    this.$router.push({
      path: '/panel/config-survey/add',
      query: { title: '新增問卷' }
    })
  }

  private openUpdPanel(sid: number, name: string): void {
    this.$router.push({
      path: `/panel/config-survey/${sid}`,
      query: { title: this.truncateStr(name, 8) }
    })
  }

  private async delSurvey() {
    await this.$store.dispatch(
      'survey/delete',
      (this.targetRow as SurveyInfo).id
    )

    this.targetRow = {}
    this.cancelConfirm = false

    this.getter(this.$refs.surveyGridContainer.fetch)
  }

  private async getToken(sid: number) {
    const token = await service.$survey.getToken(sid)

    this.getApi = `${window.location.protocol}//${window.location.host}/fsv/s/${token}`
    this.postApi = `${window.location.protocol}//${window.location.host}/fsv/send`

    this.hasToken = true
  }

  private isInQueued(sid: number) {
    return this.$store.state.view.queuedList.some(
      (view: any) => view.path === `/panel/config-survey/${sid}`
    )
  }

  private truncateStr(str: string, num: number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '..'
  }
}
</script>
