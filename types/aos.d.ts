declare module "aos" {
  interface AOSOptions {
    duration?: number
    once?: boolean
    offset?: number
    easing?: string
  }
  interface AOS {
    init(options?: AOSOptions): void
  }
  const aos: AOS
  export default aos
}
