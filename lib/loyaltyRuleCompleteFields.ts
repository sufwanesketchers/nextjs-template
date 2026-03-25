/**
 * Maps loyalty rule types to fields the user must supply for `rules.complete`
 * (aligned with RuleCompleteParams + handleUserLoyaltyRuleCompletion).
 */

export type RuleCompleteInputKey =
  | 'verificationCode'
  | 'contentUrl'
  | 'rangeValue'

export type RuleMetadata = Record<string, unknown>

export type RuleCompleteFieldSpec = {
  key: RuleCompleteInputKey
  required: boolean
  label: string
  placeholder?: string
  minLength?: number
}


export function ruleUsesQuizPollFlow(ruleType: string): boolean {
  return ruleType === 'quiz' || ruleType === 'poll'
}

export function getRuleCompleteFieldSpecs(
  ruleType: string,
  metadata: RuleMetadata | undefined
): RuleCompleteFieldSpec[] {
  const m = metadata ?? {}

  switch (ruleType) {
    case 'code_entry':
      return [
        {
          key: 'verificationCode',
          required: true,
          label: 'Promo code',
          placeholder: 'Enter your code',
        },
      ]
    case 'text_input':
    case 'link_click': {
      const min =
        typeof m.verificationTextMinimumLength === 'number'
          ? Math.max(1, m.verificationTextMinimumLength)
          : 1
      return [
        {
          key: 'verificationCode',
          required: true,
          label:
            typeof m.verifyPlaceHolderText === 'string'
              ? m.verifyPlaceHolderText
              : 'Verification',
          placeholder: 'Enter the required text or proof',
          minLength: min,
        },
      ]
    }
    case 'external_rule': {
      const hasRange = Array.isArray(m.range) && m.range.length > 0
      const trackProgress = Boolean(m.trackProgress)
      if (hasRange && !trackProgress) {
        return [
          {
            key: 'rangeValue',
            required: true,
            label: 'Value for range',
            placeholder: 'e.g. amount or score to verify',
          },
        ]
      }
      return []
    }
    case 'drip_x_tweet':
    case 'drip_x_new_tweet':
    case 'drip_x_text_in_comment':
    case 'post_impressions':
    case 'youtube_comment':
    case 'tiktok_post':
    case 'reddit_comment':
    case 'instagram_post':
      return [
        {
          key: 'contentUrl',
          required: true,
          label: 'Content URL',
          placeholder: 'https://...',
        },
      ]
    case 'quiz':
    case 'poll':
      return []
    default:
      return []
  }
}

export function hasRequiredCompleteFields(specs: RuleCompleteFieldSpec[]): boolean {
  return specs.some((s) => s.required)
}
