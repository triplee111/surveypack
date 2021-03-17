<template lang="pug">
  .col
    BaseCard
      template(v-slot:card-header)
        i(:class="$route.meta.icon")
        | &nbsp;&nbsp;{{ $route.query.name }} 名單上傳

      ExcelImportContainer(
        demoFileName="InvitedListDemo"
        :demoModel="importModel"
        :demoData="demoData"
        :verifyUrl="verifyUrl"
        :sendUrl="sendUrl")

        //- Datatable
        template(v-slot:datatable="{ id, sheetData, sheetModel }")
          Quasartable(
            :gid="`import-${id}`"
            :model="sheetModel"
            :data="sheetData")

            template(v-slot:col-verifyMessage="{ row }")
              .body-text2
                VerifyChip(
                  :status="row.verifyStatus"
                  :message="row.verifyMessage")

    BaseCard
      template(v-slot:card-header)
        i.fa.fa-map-marker
        | &nbsp;&nbsp;功能說明

      ul.q-gutter-sm.q-px-lg
        li 可參加會員進行活動時的規則一樣依循活動的設定內容
        li 群組與館別名稱(簡繁體)需要與活動設定值一致

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import { importModel } from '@/units/datatable/upload'

import CatchMixin from '@core/mixin/cacheMixin'
import ExcelImportContainer from '@m/excel/import/index'
import VerifyChip from '@m/excel/import/_component/VerifyChip'

import Quasartable from '@c/datatable/Quasartable.vue'

@Component({
  components: {
    ExcelImportContainer,
    Quasartable,
    VerifyChip
  }
})
export default class PanelInvitedListImport extends CatchMixin {
  private importModel = importModel
  private demoData = [
    {
      account: 'test123'
    }
  ]

  private verifyUrl = `ub/ubsurvey/ajaxVerifyExcel/${this.$route.params.id}`
  private sendUrl = `sv/q/id/${this.$route.params.id}`
}
</script>
