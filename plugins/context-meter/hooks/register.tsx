const YELLOW_AT = 50
const RED_AT = 75

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return String(Math.round(value))
}

function levelFor(percent: number): { label: string; icon: string; color: string } {
  if (percent >= RED_AT) return { label: 'HIGH', icon: '!', color: 'red' }
  if (percent >= YELLOW_AT) return { label: 'MEDIUM', icon: '−', color: 'yellow' }
  return { label: 'LOW', icon: '✓', color: 'green' }
}

function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, Math.round(percent)))
}

export const register = on => {
  on('turn.complete', async ($, event, next) => {
    $.ui.invalidate('ui.render')
    return next(event)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, event, next) => {
    if (event.props.hasSurvey) return next(event)

    const { context } = await $.session.usage()
    if (context.tokens === undefined || context.percent === undefined || context.window === undefined) {
      return next(event)
    }

    const percent = clampPercent(context.percent)
    const level = levelFor(percent)
    const { Box, Text } = $.ui.resolve(event)

    return (
      <Box>
        <Text dimColor>Chat {percent}% full ({formatTokens(context.tokens)} of {formatTokens(context.window)}) </Text>
        <Text color={level.color}>{level.icon} {level.label}</Text>
      </Box>
    )
  })
}
