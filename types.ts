interface QueConfig {
  others?: boolean
  optsUi?: 'radiobox' | 'menu'
  optsColumn?: {
    desktop: number
    mobile: number
  } // 每列個數
  quote?: string // 引言內容
  rules?: {
    optsRange?: {
      min: number
      max: number
    }
    format?: string
  } // 額外驗證規則
}

export interface QueOpt {
  id: number
  item: string
  visible: boolean
  concat?: Array<number | string> // 接題
  jump?: Array<number | string> // 跳題
}

export interface Que {
  id: number | string
  content: string
  type: string
  comment: string
  required: boolean
  visible: boolean
  config?: QueConfig
  opts?: QueOpt[]
}

export interface SurveyConfig {
  name: string
  active: boolean
  dateRange: string[]
  isShowNo: boolean
  limited: number
  restrict: boolean
  restrictList: Array<{ account: string }>
  title: string
  intro: string
  confirm: string
}

export interface SurveyInfo extends SurveyConfig {
  id: number
  ques?: Que[]
}

export interface Survey extends SurveyInfo {
  ques: Que[]
}

export interface SurveyState {
  list: SurveyInfo[]
  target: Survey // 編輯問卷對象
}
