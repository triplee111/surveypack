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
  confirm: '',
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

const choice = Object.freeze({
  ...queBase,
  type: 'choice',
  config: {
    others: false,
    optsUi: 'radiobox',
    optsColumn: {
      desktop: 2,
      mobile: 1
    }
  },
  opts: [
    {
      id: -1,
      item: '選項一',
      visible: true
    }
  ]
})

const multianswer = Object.freeze({
  ...queBase,
  type: 'multi-answer',
  config: {
    others: false,
    optsColumn: {
      desktop: 2,
      mobile: 1
    }
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
  choice,
  multianswer,
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
