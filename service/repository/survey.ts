import { HttpClient } from '@src/types'
import { Axios } from '@src/utils/http' // defaul http client

import { SurveyInfo, Que } from '@/types'

class SurveyService {
  private $http: HttpClient

  constructor(httpClient: HttpClient) {
    this.$http = httpClient
  }

  addSurvey(
    info: SurveyInfo,
    ques: Que[],
    admin: { id: number; name: string }
  ) {
    return this.$http.post('sv/s', {
      info,
      ques,
      admin,
      platform: process.env.PROJ_PLATFORM
    })
  }

  updSurvey(
    info: SurveyInfo,
    ques: Que[],
    admin: { id: number; name: string }
  ) {
    return this.$http.put(`sv/s/id/${info.id}`, {
      info,
      ques,
      admin,
      platform: process.env.PROJ_PLATFORM
    })
  }

  delSurvey(sid: number) {
    return this.$http.delete(`sv/s/id/${sid}`, {
      id: sid
    })
  }

  getQues(sid: number) {
    return this.$http.get(`sv/s/id/${sid}`)
  }

  getToken(sid: number) {
    return this.$http.get(`sv/t/id/${sid}`)
  }
}

export default new SurveyService(Axios)
