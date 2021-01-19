import { Survey, Que, QueOpt } from '@/types'

export const survey: Survey = {
  id: -1,
  name: '新問卷活動',
  active: true,
  dateRange: [],
  limited: 0,
  restrict: false,
  title: '無標題問卷',
  intro: '',
  ques: []
}

const queBase: Que = Object.freeze({
  id: -1,
  content: '',
  type: '',
  comment: '',
  required: true,
  visible: true,
  config: {}
})

const radiobox = Object.freeze({
  ...queBase,
  type: 'radio-box',
  config: {
    others: false
  },
  opts: [
    {
      id: -1,
      item: '選項一',
      visible: true
    }
  ]
})

const checkbox = Object.freeze({
  ...queBase,
  type: 'check-box',
  config: {
    others: false
  },
  opts: [
    {
      id: -1,
      item: '選項一',
      visible: true
    }
  ]
})

const text = Object.freeze({
  ...queBase,
  type: 'text-input'
})

const textarea = Object.freeze({
  ...queBase,
  type: 'textarea'
})

const quote = Object.freeze({
  ...queBase,
  type: 'quote',
  config: {
    quote: ''
  }
})

const divider = Object.freeze({
  ...queBase,
  content: '分隔線/分頁',
  type: 'divider'
})

export const QueTypes = {
  radiobox,
  checkbox,
  text,
  textarea,
  quote,
  divider
} as const

export const optOthers: QueOpt = Object.freeze({
  id: -1,
  item: '其它',
  visible: true
})
