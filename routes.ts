import Layout from '@t/layouts/LayoutMain.vue' // layouts base
import Wrapper from '@t/layouts/wrapper' // content wrapper

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
            path: 'config-survey/:id',
            name: 'ConfigSurvey',
            props: {
              parentView: '/survey/list'
            },
            component: () =>
              import(
                /* webpackChunkName: "config-group" */ '@/views/panel/PanelSurveyEditor.vue'
              ),
            meta: {
              roles: ['super'],
              title: '問卷設定',
              icon: 'icon-settings',
              confirm: process.env === 'production'
            }
          }
        ]
      }
    ]
  }
]
