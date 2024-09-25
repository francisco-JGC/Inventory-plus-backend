export interface IHandleResponseController<T = unknown> {
  message?: string
  data?: T
  success: boolean
}
