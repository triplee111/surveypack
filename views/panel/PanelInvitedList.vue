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
      template(v-slot:grid-card-header-actions)
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
                self="center middle")
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
                      span.q-ml-md {{ row.hall }} 確定要移除會員【{{ row.account }}】?
                    QCardActions(align="right")
                      QBtn(
                        v-close-popup
                        unelevated
                        label="刪除"
                        color="primary"
                        @click="delInvitedMember(row, del)")
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
  private rowToCancel: any

  get api() {
    const get = `sv/q/id/${this.$route.params.id}`
    const del = `sv/q/id/${this.$route.params.id}`
    return { get, del }
  }

  private async getter(
    fetch: (url: string, params?: object) => Promise<GridList>
  ) {
    const gridData = await fetch(this.api.get)

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

  private delInvitedMember(
    row: any,
    del: (api: string, params?: object) => void
  ): void {
    const { account, groups, hallId } = row

    del(`${this.api.del}`, {
      account,
      groups,
      hallId
    })

    // TODO: update store and remove cache
  }
}
</script>
