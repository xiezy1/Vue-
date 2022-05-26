export function Watcher(name, vm, node, type, originText) {
    Dep.target = this
    this.name = name
    this.vm = vm;
    this.value = null
    this.node = node
    this.type = type
    this.originText = originText
    this.update()
    Dep.target = null
}

Watcher.prototype.update = function () {
    this.get()
    if (this.type == 'eleText') this.node.innerText = this.originText.replace(/\{\{\s?\w*\s?\}\}/g, this.value)
    if (this.type == 'text') this.node.nodeValue = this.originText.replace(/\{\{\s?\w*\s?\}\}/g, this.value)
    if (this.type == 'input') this.node.value = this.value
}

Watcher.prototype.get = function () {
    this.value = this.vm[this.name]
}

export function Dep() {
    this.subs = []
}

Dep.prototype.notify = function () {
    this.subs.forEach(item => {
        item.update()
    })
}

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
}