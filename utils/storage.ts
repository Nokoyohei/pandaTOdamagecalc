export default class {
  data: any[]
  key: string
  constructor(key: string) {
    this.key = key
    this.data = []
  }

  init() {
    this.data = JSON.parse(localStorage.getItem(this.key)) ?? []
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data))
  }

  regist(payload: any) {
    this.data.push(payload)
    this.save()
  }

  remove(payload: any) {
    this.data = this.data.filter((el) => el !== payload)
    this.save()
  }
}
