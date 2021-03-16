import { cnFormat } from '@src/utils/filter/numberFormat'

export const listModel = {
  headers: [
    '名稱',
    '標題',
    '題號',
    '進行區間',
    '問卷狀態',
    '資格限制',
    '新增/修改時間',
    '編輯人員'
  ],
  columns: [
    {
      name: 'itime',
      label: '新增/修改時間',
      field: 'itime',
      align: 'left',
      hide: true
    },
    {
      name: 'name',
      label: '名稱',
      field: 'name',
      required: true,
      align: 'left',
      sortable: true
    },
    {
      name: 'title',
      label: '標題',
      field: 'title',
      required: true,
      align: 'left',
      sortable: true
    },
    {
      name: 'isShowNo',
      label: '題號',
      field: 'isShowNo',
      align: 'left',
      format: (val: number) => (val ? '顯示題號' : '隱藏題號'),
      sortable: true
    },
    {
      name: 'dateRange',
      label: '進行區間',
      field: 'dateRange',
      align: 'left',
      format: (range: string[]) =>
        range[0] && range[1]
          ? `${range[0].substring(0, 16)} 至 ${range[1].substring(0, 16)}`
          : '時間不限',
      sortable: true
    },
    {
      name: 'active',
      label: '問卷狀態',
      field: 'active',
      align: 'left',
      format: (val: number) => (val ? '可填寫' : '維謢中'),
      sortable: true
    },
    {
      name: 'restrict',
      label: '資格限制',
      field: 'restrict',
      align: 'left'
    },
    {
      name: 'timestamp',
      label: '新增/修改時間',
      field: 'timestamp',
      align: 'left',
      sortable: true
    },
    {
      name: 'editor',
      label: '編輯人員',
      field: 'editor',
      align: 'left',
      sortable: true
    },
    {
      name: 'action',
      label: '操作',
      field: 'action',
      align: 'left'
    }
  ]
}
