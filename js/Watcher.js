// 视图更新时需要的数据
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

// 视图更新函数，这里来更新最新的数据到页面
Watcher.prototype.update = function () {
    this.get()
    // 这里赋值没考虑多个模板
    if (this.type == 'eleText') this.node.innerText = this.originText.replace(/\{\{\s?\w*\s?\}\}/g, this.value)
    if (this.type == 'text') this.node.nodeValue = this.originText.replace(/\{\{\s?\w*\s?\}\}/g, this.value)
    if (this.type == 'input') this.node.value = this.value
}

// 触发 get 收集依赖
Watcher.prototype.get = function () {
    this.value = this.vm[this.name]
}

// 依赖仓库
export function Dep() {
    this.subs = []
}

// 通知更新视图
Dep.prototype.notify = function () {
    this.subs.forEach(item => {
        item.update()
    })
}

// 添加依赖
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
}