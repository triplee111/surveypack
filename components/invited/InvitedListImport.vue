<template lang="pug">
  .col-12
    QInput(
      filled
      type="file"
      style="padding: 0;"
      @input="importHandler")

    QBtn(
      unelevated
      outline
      icon="file_copy"
      size="sm"
      color="info"
      label="範本下載"
      @click="demoExportHandler")

</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'

import { importModel } from '@/units/datatable/upload'

import CatchMixin from '@core/mixin/cacheMixin'
import ExcelImportContainer from '@m/excel/import/index'

@Component({
  components: {
    ExcelImportContainer
  }
})
export default class InvitedListImport extends CatchMixin {
  @Prop({ type: Array })
  readonly list!: Array<{ account: string }>

  private importModel = importModel
  private demoData = [
    {
      account: 'test123'
    }
  ]

  get sheetData(): Array<{ account: string }> {
    return this.list
  }
  set sheetData(value: Array<{ account: string }>) {
    this.$emit('update:list', value)
  }

  private demoExportHandler() {
    require.ensure([], () => {
      if (!this.importModel) return

      const {
        exportJson2Excel
      } = require('@src/utils/vendor/excel/Export2Excel.js')

      const { demoData, importModel } = this
      const header = importModel.headers.reduce(
        (acc: { [prop: string]: string }, label, index) => {
          const prop = importModel.columns[index].field
          acc[prop] = label
          return acc
        },
        {}
      )

      exportJson2Excel(
        {
          fileName: 'InvitedListDemo',
          header,
          data: demoData,
          bookType: 'xlsx'
        },
        false
      )
    })
  }

  private importHandler(files: File[]) {
    if (!this.importModel) return

    const { columns } = this.importModel
    const header = columns.reduce((acc: string[], column) => {
      acc.push(column.name)
      return acc
    }, [])

    require.ensure([], () => {
      const { importExcel } = require('@src/utils/vendor/excel/ExcelImport.js')

      importExcel(
        files,
        {
          onload: this.onLoad
        },
        header
      )
    })
  }

  private onLoad(sheetData: Array<{ account: string }>) {
    this.sheetData = sheetData.map(row => ({ ...row }))
  }
}
</script>
