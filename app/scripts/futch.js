export class ProgressHandler {
  setPromise (promise) {
    this.promise = promise
  }

  call (...args) {
    console.log(args)
    if (this.handler === undefined)
      throw new Error('"progress" not called')
    this.handler(...args)
  }

  progress (handler) {
    this.handler = handler
    return this.promise
  }
}

export function futch (url, opts = {}) {
  const handler = new ProgressHandler()

  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    for (let k in opts.headers || {})
      xhr.setRequestHeader(k, opts.headers[k])
    xhr.addEventListener('load', ({ target: responseText }) => resolve(responseText))
    xhr.addEventListener('error', reject)

    if (xhr.upload)
      xhr.upload.addEventListener('progress', (...args) => handler.call(...args)) // event.loaded / event.total * 100 ; //event.lengthComputable

    xhr.open(opts.method || 'GET', url, true)
    xhr.send(opts.body)
  })

  handler.setPromise(promise)

  return handler
}
