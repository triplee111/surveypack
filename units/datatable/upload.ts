export const invitedModel = {
  headers: ['會員帳號', '上傳人員'], // for export
  columns: [
    {
      name: 'account',
      label: '會員帳號',
      field: 'account',
      align: 'left',
      sortable: true
    },
    {
      name: 'editor',
      label: '上傳人員',
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

export const importModel = {
  headers: ['會員帳號'], // for export
  columns: [
    {
      name: 'account',
      label: '會員帳號',
      field: 'account',
      align: 'left',
      sortable: true
    }
  ]
}
