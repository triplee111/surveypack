import { Module, GetterTree, MutationTree, ActionTree } from 'vuex'

import { RootState } from '@src/types'
import { SurveyState, Survey, SurveyConfig, SurveyInfo, Que } from '@/types'

import service from '@/service/serviceContainer'

import { survey as surveyTemplate } from '@/units/template'

const emptySurvey = Object.freeze(surveyTemplate)

const surveyState: SurveyState = {
  list: [],
  target: { ...emptySurvey }
}

const getters: GetterTree<SurveyState, RootState> = {
  targetConfig: state => {
    const {
      id,
      name,
      active,
      dateRange,
      isShowNo,
      limited,
      restrict,
      title,
      confirm,
      intro
    } = state.target
    return {
      id,
      name,
      active,
      dateRange,
      isShowNo,
      limited,
      restrict,
      title,
      confirm,
      intro
    }
  },
  targetQues: state => state.target.ques
}

const mutations: MutationTree<SurveyState> = {
  SET_LIST: (state, list: Survey[]) => {
    state.list = list
  },
  SET_SURVEY_IN_LIST: (state, survey: Survey) => {
    const targetId = state.list.findIndex((s: Survey) => s.id === survey.id)

    if (targetId === -1) {
      state.list.push(JSON.parse(JSON.stringify(survey)))
    } else {
      state.list[targetId] = JSON.parse(JSON.stringify(survey))
    }
  },
  SET_EMPTY_SURVEY: state => {
    state.list = [...state.list, { ...emptySurvey }]
  },
  RESET_SURVEY: (state, index) => {
    const targetId = state.list.findIndex((s: Survey) => s.id === index)

    if (targetId !== -1) {
      state.list.splice(targetId, 1)
    }
  },
  SET_TARGET: (state, survey: Survey) => {
    state.target = JSON.parse(JSON.stringify(survey))
  },
  ADD_QUE: (state, que: Que) => {
    state.target.ques = [...state.target.ques, JSON.parse(JSON.stringify(que))]
  },
  UPD_QUE: (state, que: Que) => {
    const targetId = state.target.ques.findIndex(q => q.id === que.id)
    state.target.ques[targetId] = JSON.parse(JSON.stringify(que))
  },
  DEL_QUE: (state, qid: number) => {
    const targetId = state.target.ques.findIndex(q => q.id === qid)
    state.target.ques.splice(targetId, 1)
  }
}

const actions: ActionTree<SurveyState, RootState> = {
  setList({ commit }, list) {
    commit('SET_LIST', list)
  },
  setNewSurvey({ commit }) {
    commit('RESET_SURVEY', -1)
    commit('SET_EMPTY_SURVEY')
    commit('SET_TARGET', { ...emptySurvey })
  },
  setListSurvey({ commit }, surveyInfo) {
    commit('SET_SURVEY_IN_LIST', surveyInfo)
  },
  async create(
    { rootState, commit },
    { info, ques }: { info: SurveyInfo; ques: Que[] }
  ) {
    const admin = {
      id: rootState.auth.user.id,
      name: rootState.auth.user.name
    }

    try {
      const sid = await service.$survey.addSurvey(info, ques, admin)

      commit('RESET_SURVEY', -1)
      commit('SET_SURVEY_IN_LIST', {
        ...info,
        id: sid
      })

      return Promise.resolve(sid)
    } catch (err) {
      throw new Error(err)
    }
  },
  async read({ state, commit }, sid: number) {
    const surveyInfo = state.list.find((s: SurveyInfo) => s.id === sid)

    if (!surveyInfo) {
      throw new Error('target survey empty')
    }

    if (surveyInfo.ques && surveyInfo.ques.length) {
      commit('SET_TARGET', surveyInfo)
      return
    }

    const { survey } = await service.$survey.getQues(sid)

    commit('SET_TARGET', survey)
    commit('SET_SURVEY_IN_LIST', survey)
  },
  async update(
    { rootState, commit },
    { info, ques }: { info: SurveyInfo; ques: Que[] }
  ) {
    const admin = {
      id: rootState.auth.user.id,
      name: rootState.auth.user.name
    }

    try {
      await service.$survey.updSurvey(info, ques, admin)

      commit('SET_SURVEY_IN_LIST', info)
    } catch (err) {
      throw new Error(err)
    }
  },
  async delete({ commit }, sid: number) {
    await service.$survey.delSurvey(sid)
    commit('RESET_SURVEY', sid)
  },
  updConfig({ state, commit }, config: SurveyConfig) {
    commit('SET_TARGET', {
      ...state.target,
      ...config
    })
  },
  updQues({ state, commit }, ques: Que[]) {
    commit('SET_TARGET', {
      ...state.target,
      ques
    })
  },
  addQue({ commit }, que: Que) {
    commit('ADD_QUE', que)
  },
  updQue({ commit }, que: Que) {
    commit('UPD_QUE', que)
  },
  delQue({ state, commit }, qid: number | string) {
    commit('DEL_QUE', qid)
    commit('SET_SURVEY_IN_LIST', state.target)
  },
  collapseOn() {},
  collapseOff() {}
}

export default {
  state: surveyState,
  getters,
  mutations,
  actions
} as Module<SurveyState, RootState>
