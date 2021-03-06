/* @flow */

import stream from 'stream'
import { createWriteFunction } from './write'

/**
 * Original RenderStream implmentation by Sasha Aickin (@aickin)
 * Licensed under the Apache License, Version 2.0
 * Modified by Evan You (@yyx990803)
 */
export default class RenderStream extends stream.Readable {
  buffer: string;
  render: Function;
  expectedSize: number;
  stackDepth: number;
  write: Function;
  next: Function;
  end: Function;
  done: boolean;

  constructor (render: Function) {
    super()
    this.buffer = ''
    this.render = render
    this.expectedSize = 0
    this.stackDepth = 0

    this.write = createWriteFunction((text, next) => {
      const n = this.expectedSize
      this.buffer += text
      if (this.buffer.length >= n) {
        this.next = next
        this.pushBySize(n)
        return true // we will decide when to call next
      }
    }, err => {
      this.emit('error', err)
    })

    this.end = () => {
      // the rendering is finished; we should push out the last of the buffer.
      this.done = true
      this.push(this.buffer)
    }
  }

  pushBySize (n: number) {
    const bufferToPush = this.buffer.substring(0, n)
    this.buffer = this.buffer.substring(n)
    this.push(bufferToPush)
  }

  tryRender () {
    try {
      this.render(this.write, this.end)
    } catch (e) {
      this.emit('error', e)
    }
  }

  tryNext () {
    try {
      this.next()
    } catch (e) {
      this.emit('error', e)
    }
  }

  _read (n: number) {
    this.expectedSize = n
    // it's possible that the last chunk added bumped the buffer up to > 2 * n,
    // which means we will need to go through multiple read calls to drain it
    // down to < n.
    if (this.done) {
      this.push(null)
      return
    }
    if (this.buffer.length >= n) {
      this.pushBySize(n)
      return
    }
    if (!this.next) {
      // start the rendering chain.
      this.tryRender()
    } else {
      // continue with the rendering.
      this.tryNext()
    }
  }
}
