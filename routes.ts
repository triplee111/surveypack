import Layout from '@t/layouts/LayoutMain.vue' // layouts base
import Wrapper from '@t/layouts/wrapper' // content wrapper

import { Route } from 'vue-router'

export default [
  {
    path: '/',
    name: 'Home',
    redirect: '/survey',
    component: Layout,
    children: [
      {
        path: 'survey',
        name: 'Survey',
        component: Wrapper,
        redirect: '/survey/list',
        meta: {
          title: 'Survey Pack'
        },
        children: [
          {
            path: 'list',
            name: 'list',
            component: () =>
              import(
                /* webpackChunkName: "list-group" */ '@/views/survey/SurveyList.vue'
              ),
            meta: {
              roles: ['super'],
              title: '問卷列表',
              icon: 'icon-list'
            }
          }
        ]
      },
      // Panel routes
      {
        panel: true,
        path: 'panel',
        name: 'Panel',
        component: Wrapper,
        children: [
          {
            path: 'config-survey/:id/:step',
            name: 'ConfigSurvey',
            props: (route: Route) => ({
              id: route.params.id,
              step: route.params.step,
              parentView: '/survey/list'
            }),
            component: () =>
              import(
                /* webpackChunkName: "config-group" */ '@/views/panel/PanelSurveyEditor.vue'
              ),
            meta: {
              roles: ['super'],
              title: '問卷設定',
              icon: 'icon-settings',
              confirm: process.env.NODE_ENV === 'production'
            }
          },
          {
            path: 'invited/:id',
            name: 'Invited',
            component: () =>
              import(
                /* webpackChunkName: "list-group" */ '@/views/panel/PanelInvitedList.vue'
              ),
            meta: {
              roles: ['super'],
              title: '可參加列表',
              icon: 'icon-list'
            }
          },
          {
            path: 'invited-upload/:id',
            name: 'ListUpload',
            component: () =>
              import(
                /* webpackChunkName: "config-group" */ '@/views/panel/PanelInvitedListImport.vue'
              ),
            meta: {
              roles: ['super'],
              title: '名單上傳',
              icon: 'icon-cloud-upload'
            }
          }
        ]
      }
    ]
  }
]
