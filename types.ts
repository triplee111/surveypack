interface QueConfig {
  others?: boolean
  optsRange?: {
    min: number
    max: number
  }
  quote?: string
  optsUi?: 'radiobox' | 'menu'
  optsColumn?: {
    desktop: number
    mobile: number
  } // 每列個數
}

export interface QueOpt {
  id: number
  item: string
  visible: boolean
  jump?: number // 跳題
  concat?: number // 接題
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
  limited: number
  restrict: boolean
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
