import { Watcher } from './Watcher.js'

function modifier(modifType, value) {
    switch (modifType) {
        case 'number':
            return Number(value)
        case 'trim':
            return (value || '').trim()
        default: return value
    }
}

function handleModify(modifyName, value) {
    let modify = modifyName.split('.').slice(1) || []
    let result = value
    modify.forEach(modi => {
        result = modifier(modi, result)
    })
    return result
}


function isLazy(modifyName) {
    let modify = modifyName.split('.').slice(1) || []
    if (modify.includes('lazy')) return 300
    else return 0
}

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


export default function init(item, node, vm, nodeName) {
    let name = item.nodeValue
    node.addEventListener('input', throttle(() => {
        vm[name] = handleModify(nodeName, node.value)
    }, isLazy(nodeName)))
    new Watcher(name, vm, node, 'input', node.value)
    node.value = vm[name]
    node.removeAttribute('v-model')
}
