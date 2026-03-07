type CBType = (...args: any) => void

export class TimerComponent {
  duration: number = 0
  remaining: number = 0
  callback: CBType
  repeat: boolean = false

  constructor(duration: number, callback: CBType, repeat = false) {
    this.duration = duration
    this.remaining = duration
    this.callback = callback
    this.repeat = repeat
  }
}
