<template lang="pug">
  .col
    GridContainer(
      :initFetch="true"
      @fetch="getter"
      @reset="resetter")

      template(v-slot:grid-card-header)
        i(:class="$route.meta.icon")
        | &nbsp;&nbsp;{{ $route.query.title }}

      //- Header action
      template(v-slot:grid-card-header-action)
        ExcelExportContainer.card-header-action(
          fileName="InvitedList"
          :model="gridModel"
          :data="gridData")

      //- Toolbar
      template(v-slot:grid-card-toolbar)
        QForm.q-gutter-x-md.q-my-xs
          QBtn(
            unelevated
            outline
            size="md"
            color="primary"
            label="上傳可參加會員"
            icon="cloud_upload"
            @click="uploadList")
          QBtn(
            unelevated
            outline
            size="md"
            color="red-4"
            label="清空可參與名單"
            icon="delete"
            @click="showClear = true")

      //- Datatable
      template(v-slot:datatable="{ id, fetch, del }")
        Quasartable(
          :gid="id"
          :model="gridModel"
          :data="gridData")

          template(v-slot:col-action="{ row }")
            QBtn(
              flat
              dense
              size="md"
              color="grey-10"
              icon="reorder")
              QMenu(
                anchor="center middle"
                self="center middle"
                auto-close)
                QList
                  QItem(
                    clickable
                    @click="$set(showCancel, row.account, true)")
                    QItemSection(
                      avatar
                      style="min-width: 10px; padding-right: 5px;")
                      QIcon(
                        size="xs"
                        left
                        name="delete")
                    QItemSection 移除會員

            QDialog(
              v-model="showCancel[row.account]"
              persistent
              position="top")
              QCard
                QCardSection.row.items-center
                  QAvatar(
                    size="md"
                    icon="notifications_active"
                    color="red"
                    text-color="white")
                  span.q-ml-md 確定要移除會員【{{ row.account }}】?
                QCardActions(align="right")
                  QBtn(
                    v-close-popup
                    unelevated
                    label="刪除"
                    color="primary"
                    @click="delMember(row.account)")
                  QBtn(
                    v-close-popup
                    flat
                    label="取消"
                    color="primary")

    QDialog(
      v-model="showClear"
      persistent
      position="top")
      QCard
        QCardSection.row.items-center
          QAvatar(
            size="md"
            icon="notifications_active"
            color="red"
            text-color="white")
          span.q-ml-md 確定要清空可參與名單?
        QCardActions(align="right")
          QBtn(
            v-close-popup
            unelevated
            label="刪除"
            color="primary"
            @click="clearList")
          QBtn(
            v-close-popup
            flat
            label="取消"
            color="primary")

    BaseCard
      template(v-slot:card-header)
        i.fa.fa-map-marker
        | &nbsp;&nbsp;功能說明

      ul.q-gutter-sm.q-px-lg
        li 可參加名單的綁定對象為特定群組的特定館別
        li 目前僅提供個別會員的移除功能
        li 移除該群組館別可參加會員並不會刪除該會員的參與記錄

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import {
  QMenu,
  QList,
  QItem,
  QItemSection,
  QSeparator,
  QDialog,
  QCardActions,
  QAvatar
} from 'quasar'

import { invitedModel } from '@/units/datatable/upload'

import { GridList } from '@src/types'
import service from '@/service/serviceContainer'

import CatchMixin from '@core/mixin/cacheMixin'
import GridContainer from '@m/grid/index'
import ExcelExportContainer from '@m/excel/export'

import Quasartable from '@c/datatable/Quasartable.vue'

@Component({
  components: {
    QMenu,
    QList,
    QItem,
    QItemSection,
    QSeparator,
    QDialog,
    QCardActions,
    QAvatar,
    GridContainer,
    ExcelExportContainer,
    Quasartable
  }
})
export default class PanelInvitedList extends CatchMixin {
  protected gridModel = invitedModel
  protected gridData: GridList = []

  private showCancel: { [prop: string]: boolean } = {}
  private showClear = false

  private async getter(
    fetch: (url: string, params?: object) => Promise<GridList>
  ) {
    const gridData = await fetch(`sv/q/id/${this.$route.params.id}`)

    if (gridData) {
      this.gridData = gridData
    }
  }

  private resetter(gridData: GridList): void {
    this.gridData = gridData
  }

  private uploadList(): void {
    this.$router.push({
      path: `/panel/invited-upload/${this.$route.params.id}`,
      query: {
        name: this.$route.query.name,
        title: `${this.$route.query.name} 名單上傳`
      }
    })
  }

  private async clearList() {
    const { list } = await service.$survey.clearQualifyList(
      this.$route.params.id
    )
    this.gridData = list
  }

  private async delMember(account: string) {
    const { list } = await service.$survey.delQualifyUser(
      this.$route.params.id,
      account
    )
    this.gridData = list
  }
}
</script>
