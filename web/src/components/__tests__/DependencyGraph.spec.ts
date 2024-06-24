import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DependencyGraph from '../DependencyGraph.vue'

describe('DependencyGraph', () => {
  it('renders properly', () => {
    const wrapper = mount(DependencyGraph, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
