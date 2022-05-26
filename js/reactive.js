import VModel from './Modify.js'
import { Watcher, Dep } from './Watcher.js'

// Vue构造函数
export default function Vue({ el, data }) {
    // 根元素 #app
    this.$dom = document.querySelector(el)
    // 把data中的数据拿出来
    this._data = data && typeof data == 'function' && data()
    // 数据劫持，添加get set函数
    Observer(this._data, this)
    // 这里简单的解析了一下模板语法
    let dom = nodeToFragment(this.$dom, this)
    // 把解析后的元素挂载到根元素上
    this.$dom.appendChild(dom)
}

// 这里没有递归data数据
function Observer(data, vm) {
    // 循环data数据，添加get，set，并收集依赖
    Object.keys(data).forEach(key => {
        let value = data[key]
        let dep = new Dep()
        Object.defineProperty(vm, key, {
            get() {
                // 记录需要响应式数据node节点（收集依赖）
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                value = newValue
                // 通知更新视图
                dep.notify()
            }
        })
    })
}

// 递归遍历所有的子元素
function nodeToFragment(node, vm) {
    let aFragm = document.createDocumentFragment()
    // 深度递归
    deepCompile(node, vm)

    function deepCompile(node, vm) {
        let child = null
        while (child = node.firstChild) {

            // nodeType == 1 是dom元素需要看子元素是否存在，这里只做了nodeType == 1 dom元素和3的文字节点
            if (child.nodeType == 1) {
                if (child.children.length) deepCompile(child, vm)
                compile(child, vm)
                aFragm.appendChild(child)
            } else {
                // 这里认为剩下的都是文字节点，直接进行模板解析
                compile(child, vm)
                aFragm.appendChild(child)
            }
        }
    }
    return aFragm
}

// 模板解析
function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/;
    if (node.nodeType == 1) {
        // 获取元素的属性attribute并遍历，这里只处理了v-model
        Array.from(node.attributes).forEach(item => {
            let nodeName = item.nodeName
            // VModel 是处理v-model的函数
            if (nodeName.includes('v-model')) VModel(item, node, vm, nodeName)
        })
        // 这里认为是普通的dom元素如div p
        if (reg.test(node.innerText)) {
            // 正则获取data中的数据key（模板中的数据 如‘name’ {{ name }}）
            let name = RegExp.$1;
            name = name.trim();
            // 把node节点数据，保存到一个实例中，为set中的依赖收集做铺垫
            new Watcher(name, vm, node, 'eleText', node.innerText)
        }
    }
    if (node.nodeType == 3) {
        // 文字节点
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1;
            name = name.trim();
            new Watcher(name, vm, node, 'text', node.nodeValue)
        }
    }
}





