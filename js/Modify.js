import { Watcher } from './Watcher.js'

// 修饰符判断
function modifier(modifType, value) {
    switch (modifType) {
        case 'number':
            return Number(value)
        case 'trim':
            return (value || '').trim()
        default: return value
    }
}

// 多个修饰符
function handleModify(modifyName, value) {
    let modify = modifyName.split('.').slice(1) || []
    let result = value
    modify.forEach(modi => {
        result = modifier(modi, result)
    })
    return result
}

// 判断是否写了lazy
function isLazy(modifyName) {
    let modify = modifyName.split('.').slice(1) || []
    if (modify.includes('lazy')) return 300
    else return 0
}

// 节流函数
function throttle(cb, wait) {
    let lastTime = null
    return function () {
        let nowTime = Date.now()
        if (nowTime - lastTime > (wait || 0)) {
            typeof cb == 'function' && cb()
            lastTime = nowTime
        }
    }
}


// 核心
export default function init(item, node, vm, nodeName) {
    let name = item.nodeValue
    // 获取v-model绑定的数据名

    // 给当前node节点添加input事件，根据isLazy函数来做节流效果
    node.addEventListener('input', throttle(() => {
        // node上的结果处理后赋值给vm对应的key
        vm[name] = handleModify(nodeName, node.value)
    }, isLazy(nodeName)))
    new Watcher(name, vm, node, 'input', node.value)
    // 展示data中的数据
    node.value = vm[name]
    // 删除v-model属性
    node.removeAttribute('v-model')
}
