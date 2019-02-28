import $ from 'cash-dom'

import '../styles/main.scss'

import { initAccountCheck } from './account-check'
import { initRegisterDialog } from './dialogs'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

$(() => {
  initAccountCheck()
  initRegisterDialog()
})
