import type { ToastVariant } from '@/components/ui'

import {
  BadRequest,
  ConflictError,
  DomainError,
  type ErrorReason,
  ForbiddenError,
  NetworkError,
  NotAuthenticatedError,
  NotFoundError,
  UnexpectedError,
  UnexpectedServerError,
  VALIDATION_ISSUES_MAP,
} from './error'

export async function handleError<T>(context: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action()
  } catch (e: unknown) {
    if (!(e instanceof DomainError)) throw new UnexpectedError(context)
    throw new Error(`${context}: ${e.message}`)
  }
}

export interface UserMessage {
  title: string
  message: string
  variant: ToastVariant
}

export function getReason(e: unknown): ErrorReason | undefined {
  if (!(e instanceof DomainError)) return undefined
  if (!e.reason || typeof e.reason !== 'object') return undefined
  return e.reason as ErrorReason
}

function formatValidationIssues(issues: Record<string, string[]>): string {
  if (Object.keys(issues).length === 0) return ''

  return Object.entries(issues)
    .flatMap(([field, problems]) => {
      return problems.map(
        (p) => `${field}: ${VALIDATION_ISSUES_MAP[p as keyof typeof VALIDATION_ISSUES_MAP] || p}`,
      )
    })
    .join('\n')
}

/**
 * Maps an error to a user-friendly message.
 * @param e The error object.
 * @param contextCustomMessages Optional map of reason codes to custom messages for specific contexts.
 */
export function getUserMessage(
  e: unknown,
  contextCustomMessages?: Record<string, string>,
): UserMessage {
  const defaultTitle = 'Error'
  const defaultVariant: ToastVariant = 'danger'

  const reason = getReason(e)
  console.log('Error reason', reason)

  if (reason && contextCustomMessages && contextCustomMessages[reason.name]) {
    return {
      title: defaultTitle,
      message: contextCustomMessages[reason.name],
      variant: defaultVariant,
    }
  }

  let validationMessage = ''
  if (reason?.issues) {
    validationMessage = formatValidationIssues(reason.issues)
  }

  if (e instanceof NetworkError) {
    return {
      title: 'Connection Issue',
      message: 'Please check your internet connection.',
      variant: 'warning',
    }
  }
  if (e instanceof NotAuthenticatedError) {
    return {
      title: 'Authentication Required',
      message: 'Please login to perform this action.',
      variant: 'warning',
    }
  }
  if (e instanceof ForbiddenError) {
    return {
      title: 'Access Denied',
      message: "You don't have permission to do this.",
      variant: 'danger',
    }
  }
  if (e instanceof NotFoundError) {
    return {
      title: 'Not Found',
      message: "The requested resource couldn't be found.",
      variant: 'warning',
    }
  }
  if (e instanceof ConflictError) {
    return {
      title: 'Conflict',
      message: 'This resource already exists or conflicts with another.',
      variant: 'warning',
    }
  }
  if (e instanceof BadRequest) {
    return {
      title: 'Invalid Request',
      message: validationMessage || e.message || 'Please check your input.',
      variant: 'warning',
    }
  }
  if (e instanceof UnexpectedServerError) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      variant: 'danger',
    }
  }

  if (e instanceof DomainError) {
    return {
      title: defaultTitle,
      message: e.message,
      variant: defaultVariant,
    }
  }

  return {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred.',
    variant: 'danger',
  }
}
