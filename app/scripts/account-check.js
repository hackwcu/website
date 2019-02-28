import $ from 'cash-dom'

import { hideDialog } from './dialogs'

function receiveMessage (event) {
  if (event.data !== 'login')
    return

  const registerButtons = $('#register')

  registerButtons.find('span').text('Account Settings')
  registerButtons.attr('href', null)
  registerButtons.attr('target', null)

  const dialogId = '#account-dialog'

  registerButtons.on('click', e => {
    $('.dialog-backdrop').removeClass('hide')
    $(`.dialog:not(${dialogId})`).addClass('hide')
    $(dialogId).removeClass('hide')
    e.preventDefault()
  })

  $(`${dialogId} button`).on('click', hideDialog)
}

export function initAccountCheck () {
  window.addEventListener('message', receiveMessage, false)
}
