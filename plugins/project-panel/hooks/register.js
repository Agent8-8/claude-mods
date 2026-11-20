const PANE = 'project-instructions'
// EDIT THIS: absolute path to your projects folder (~/Claude/projects)
const BASE = '/Users/YOUR_USERNAME/Claude/projects'
const MAX = 100000
let state = { root: '', original: '', draft: '', message: '', ready: false }
let didOpen = false

async function project($) {
  const cwd = await $.session.root()
  if (!cwd.startsWith(BASE + '/')) return null
  const parts = cwd.slice(BASE.length + 1).split('/')
  if (!parts[0] || parts.some(part => part === '..' || part === '.')) return null
  const root = BASE + '/' + parts[0]
  const dir = await $.fs.stat(root)
  if (!dir || dir.isLink || dir.kind !== 'dir') return null
  const file = await $.fs.stat(root + '/PROJECT.md')
  if (!file || file.isLink || file.kind !== 'file' || file.size > MAX) return null
  return root
}

async function openAutomatically($) {
  if (didOpen) return
  await load($)
  if (!state.ready) return
  didOpen = true
  try { await $.ui.open({ id: PANE, title: 'Project instructions' }) } catch { didOpen = false }
}

async function load($) {
  try {
    const root = await project($)
    if (!root) {
      state = { root: '', original: '', draft: '', ready: false, message: 'Open a local project containing PROJECT.md to edit its instructions.' }
      return
    }
    const text = await $.fs.read(root + '/PROJECT.md')
    state = { root, original: text, draft: text, message: '', ready: true }
  } catch {
    state = { root: '', original: '', draft: '', ready: false, message: 'Could not read project instructions.' }
  }
}

async function save($) {
  try {
    const root = await project($)
    if (!state.ready || root !== state.root) throw new Error('The active project changed. Reopen this panel before saving.')
    if (new TextEncoder().encode(state.draft).length > MAX) throw new Error('Instructions are too long to save here.')
    const current = await $.fs.read(root + '/PROJECT.md')
    if (current !== state.original) throw new Error('This file changed elsewhere. Your draft is still here; copy it before reopening the panel.')
    await $.fs.write(root + '/PROJECT.md', state.draft)
    state.original = state.draft
    state.message = 'Saved. Start a new project chat to load the updated instructions.'
  } catch (error) {
    state.message = error?.message || 'Could not save. Your draft is still here.'
  }
  $.ui.invalidate('ui.render')
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'project-instructions', description: 'Open this project’s custom instructions' })
    const result = await next(e)
    await openAutomatically($)
    return result
  })
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (!e.agentId) await openAutomatically($)
    return result
  })
  on('command.run', { command: 'project-instructions' }, async $ => {
    await load($)
    await $.ui.open({ id: PANE, title: 'Project instructions', focus: true, closeOnEscape: true })
    didOpen = true
    return {}
  })
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const { Box, Text, Input, Button } = $.ui.resolve(e)
    const children = [Text({ children: [state.root ? 'Project: ' + state.root.split('/').pop() : 'Project instructions'] })]
    if (state.ready) {
      children.push(Text({ children: ['These instructions apply to new chats in this project.'] }))
      children.push(Input({ key: 'instructions', label: 'Instructions', rows: 12, value: state.draft, onInput: value => { state.draft = value }, onSubmit: value => { state.draft = value } }))
      children.push(Button({ key: 'save', label: 'Save instructions', onPress: () => save($) }))
    }
    if (state.message) children.push(Text({ children: [state.message] }))
    return Box({ flexDirection: 'column', children })
  })
}
