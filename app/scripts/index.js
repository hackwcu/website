import $ from 'cash-dom'

import '../styles/main.scss'
import { draw, setup } from './confetti'
import { futch } from './futch'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

function setScrollState (scroll) {
  const state = scroll ? null : 'hidden'
  $('body').css('overflow', state)
  $('html').css('overflow', state)
}

function resetForm () {
  $('#register-form button').removeClass('hide')
  const progress = $('#register-form .progress')
  progress.addClass('hide')
  progress.find('.bar').css('width', null)
  $('#resume-dialog').removeClass('hide')
  $('#welcome-dialog').addClass('hide')
}

function hideDialog () {
  const dialog = $('.dialog-backdrop')
  dialog.css('opacity', 0)
  setTimeout(() => {
    dialog.css('opacity', null)
    dialog.addClass('hide')
    resetForm()
    setScrollState(true)
  }, 100)
}

function toNextDialog () {
  $('#resume-dialog').addClass('hide')
  $('#welcome-dialog').removeClass('hide')

  const ctx = setup()
  setInterval(() => draw(ctx), 1000 / 60)
}

const parseHash = hash => hash.split(/#|&/g)
  .reduce((accum, rawValue) => {
    if (rawValue.length <= 0)
      return accum

    const [ key, value ] = rawValue.split('=')
    accum[key] = value
    return accum
  }, {})

$(() => {
  const hash = window.location.hash
  const form = $('#register-form')

  if (hash.length > 0) {
    $('.dialog-backdrop').removeClass('hide')
    setScrollState(false)

    history.replaceState(null, null, ' ')
    const { access_token: accessToken } = parseHash(hash)
    futch(`https://hackwcu-resume.herokuapp.com/subscribe/${accessToken}`)
    form.find('input[type="text"]').val(accessToken)
  }

  const dropzoneId = 'file-drop'

  // LIMIT DRAGGING TO SPECIFIC INPUT
  $(window).on('dragenter', e => {
    const { target: { id }, dataTransfer } = e
    if (id !== dropzoneId) {
      e.preventDefault()
      dataTransfer.effectAllowed = 'none'
      dataTransfer.dropEffect = 'none'
    }
  }, false)

  $(window).on('dragover', e => {
    const { target: { id }, dataTransfer } = e
    if (id !== dropzoneId) {
      e.preventDefault()
      dataTransfer.effectAllowed = 'none'
      dataTransfer.dropEffect = 'none'
    }
  })

  $(window).on('drop', e => {
    const { target: { id }, dataTransfer } = e
    if (id !== dropzoneId) {
      e.preventDefault()
      dataTransfer.effectAllowed = 'none'
      dataTransfer.dropEffect = 'none'
    }
  })

  // ON FILE CHANGE
  $(`#register-form input[type=file]`).on('change', e => {
    const file = e.target.files[0]
    const filename = file.name.split(/(\\|\/)/g).pop()

    if (file.size > Math.pow(2, 23)) {
      alert('Files cannot be larger than 8MB!')
      e.preventDefault()
      return
    }
    if (filename.length <= 0) {
      e.preventDefault()
      return
    }

    $('.file-drop .title').text('You have attached a file...')
    $('.file-drop .subtitle').text(filename)
  })

  form.on('submit', e => {
    e.preventDefault()
    if (form.find('input[type=file]').val().length <= 0) {
      alert('No file attached!')
      return
    }

    const progressBar = form.find('.progress .bar')
    form.find('.progress').removeClass('hide')
    form.find('button').addClass('hide')

    futch('https://hackwcu-resume.herokuapp.com/submit', {
      method: 'POST',
      body: new FormData(form[0])
    })
      .progress(e => progressBar.css('width', `${e.loaded / e.total * 90}%`))
      .then(() => {
        progressBar.css('width', '100%')
        setTimeout(toNextDialog, 500)
      })
      .catch(() => {
        alert('Failed to submit!')
        resetForm()
      })
  })

  $('#welcome-dialog button').on('click', hideDialog)
})
