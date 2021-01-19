import camelCase from 'lodash/camelCase'

import { Store } from 'vuex'

import { RootState } from '@src/types'

const requireModule = require.context(
  // Search for files in the current directory.
  '.',
  // Search for files in subdirectories.
  true,
  // Include any .js or .ts files that are not this file or a unit test or types.
  /^((?!index|types|\.unit\.).)*\.(ts|js)$/
)

export default (store: Store<RootState>) => {
  // For every Vuex module...
  requireModule.keys().forEach(fileName => {
    const moduleDefinition = requireModule(fileName).default

    // Auto set namespaced value true
    moduleDefinition.namespaced = true

    // Get the module path as an array.
    const moduleName: string = camelCase(
      fileName
        // Remove the "./" from the beginning.
        .replace(/^\.\//, '')
        // Remove the file extension from the end.
        .replace(/\.\w+$/, '')
    )

    store.registerModule(moduleName, moduleDefinition)

    // 如果 module 存在 action:init, 登入後進行 dispatch 初始化 module 狀態
    if (moduleDefinition.actions.hasOwnProperty('init')) {
      const unwatch = store.watch(
        state => state.permission.token,
        value => {
          if (value) {
            store.dispatch(`${moduleName}/init`)

            if (unwatch) {
              unwatch() // 只在 token 從無到有時觸發
            }
          }
        },
        { immediate: process.env.NODE_ENV !== 'production' }
      )
    }
  })
}
