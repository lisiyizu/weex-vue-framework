import Vue from 'vue'

describe('Directive v-bind', () => {
  it('normal attr', done => {
    const vm = new Vue({
      template: '<div><span :test="foo">hello</span></div>',
      data: { foo: 'ok' }
    }).$mount()
    expect(vm.$el.firstChild.getAttribute('test')).toBe('ok')
    vm.foo = 'again'
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('again')
      vm.foo = null
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('test')).toBe(false)
      vm.foo = false
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('test')).toBe(false)
      vm.foo = true
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('true')
      vm.foo = 0
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('0')
    }).then(done)
  })

  it('should set property for input value', done => {
    const vm = new Vue({
      template: `
        <div>
          <input type="text" :value="foo">
          <input type="checkbox" :checked="bar">
        </div>
      `,
      data: {
        foo: 'ok',
        bar: false
      }
    }).$mount()
    expect(vm.$el.firstChild.value).toBe('ok')
    expect(vm.$el.lastChild.checked).toBe(false)
    vm.bar = true
    waitForUpdate(() => {
      expect(vm.$el.lastChild.checked).toBe(true)
    }).then(done)
  })

  it('xlink', done => {
    const vm = new Vue({
      template: '<svg><a :xlink:special="foo"></a></svg>',
      data: {
        foo: 'ok'
      }
    }).$mount()
    const xlinkNS = 'http://www.w3.org/1999/xlink'
    expect(vm.$el.firstChild.getAttributeNS(xlinkNS, 'special')).toBe('ok')
    vm.foo = 'again'
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttributeNS(xlinkNS, 'special')).toBe('again')
      vm.foo = null
    }).then(() => {
      expect(vm.$el.firstChild.hasAttributeNS(xlinkNS, 'special')).toBe(false)
      vm.foo = true
    }).then(() => {
      expect(vm.$el.firstChild.getAttributeNS(xlinkNS, 'special')).toBe('true')
    }).then(done)
  })

  it('enumrated attr', done => {
    const vm = new Vue({
      template: '<div><span :draggable="foo">hello</span></div>',
      data: { foo: true }
    }).$mount()
    expect(vm.$el.firstChild.getAttribute('draggable')).toBe('true')
    vm.foo = 'again'
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('true')
      vm.foo = null
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('false')
      vm.foo = ''
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('true')
      vm.foo = false
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('false')
      vm.foo = 'false'
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('false')
    }).then(done)
  })

  it('boolean attr', done => {
    const vm = new Vue({
      template: '<div><span :disabled="foo">hello</span></div>',
      data: { foo: true }
    }).$mount()
    expect(vm.$el.firstChild.getAttribute('disabled')).toBe('disabled')
    vm.foo = 'again'
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('disabled')).toBe('disabled')
      vm.foo = null
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('disabled')).toBe(false)
      vm.foo = ''
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('disabled')).toBe(true)
    }).then(done)
  })

  it('bind as prop', () => {
    const vm = new Vue({
      template: '<div><span v-bind:text-content.prop="foo"></span><span :inner-html.prop="bar"></span></div>',
      data: {
        foo: 'hello',
        bar: '<span>qux</span>'
      }
    }).$mount()
    expect(vm.$el.children[0].textContent).toBe('hello')
    expect(vm.$el.children[1].innerHTML).toBe('<span>qux</span>')
  })

  it('bind object', done => {
    const vm = new Vue({
      template: '<input v-bind="test">',
      data: {
        test: {
          id: 'test',
          class: 'ok',
          value: 'hello'
        }
      }
    }).$mount()
    expect(vm.$el.getAttribute('id')).toBe('test')
    expect(vm.$el.getAttribute('class')).toBe('ok')
    expect(vm.$el.value).toBe('hello')
    vm.test.id = 'hi'
    vm.test.value = 'bye'
    waitForUpdate(() => {
      expect(vm.$el.getAttribute('id')).toBe('hi')
      expect(vm.$el.getAttribute('class')).toBe('ok')
      expect(vm.$el.value).toBe('bye')
    }).then(done)
  })

  it('bind object as prop', done => {
    const vm = new Vue({
      template: '<input v-bind.prop="test">',
      data: {
        test: {
          id: 'test',
          className: 'ok',
          value: 'hello'
        }
      }
    }).$mount()
    expect(vm.$el.id).toBe('test')
    expect(vm.$el.className).toBe('ok')
    expect(vm.$el.value).toBe('hello')
    vm.test.id = 'hi'
    vm.test.className = 'okay'
    vm.test.value = 'bye'
    waitForUpdate(() => {
      expect(vm.$el.id).toBe('hi')
      expect(vm.$el.className).toBe('okay')
      expect(vm.$el.value).toBe('bye')
    }).then(done)
  })

  it('bind array', done => {
    const vm = new Vue({
      template: '<input v-bind="test">',
      data: {
        test: [
          { id: 'test', class: 'ok' },
          { value: 'hello' }
        ]
      }
    }).$mount()
    expect(vm.$el.getAttribute('id')).toBe('test')
    expect(vm.$el.getAttribute('class')).toBe('ok')
    expect(vm.$el.value).toBe('hello')
    vm.test[0].id = 'hi'
    vm.test[1].value = 'bye'
    waitForUpdate(() => {
      expect(vm.$el.getAttribute('id')).toBe('hi')
      expect(vm.$el.getAttribute('class')).toBe('ok')
      expect(vm.$el.value).toBe('bye')
    }).then(done)
  })

  it('warn expect object', () => {
    new Vue({
      template: '<input v-bind="test">',
      data: {
        test: 1
      }
    }).$mount()
    expect('v-bind without argument expects an Object or Array value').toHaveBeenWarned()
  })
})
