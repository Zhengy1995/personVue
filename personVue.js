class PersonVue {
	constructor({el, data, components}) {
		this.$el = el
		this.$method = data.method
		this.initDataHandler(data.data)
		this.bindVarHandler(data.data)
		this.setDataHandler(this.$data)
		this.bindEventHandler()
		this.analysComponentsHandler(components)
	}
	/*
	** 将初始化的数据灌入类中
	** $datas 初始化的数据
	 */
	setDataHandler($datas) {
		for(let data in $datas) {
			this[data] = $datas[data]
		}
	}
	/*
	 ** 给初始化的变量上监听，实现mvvm模式
	 ** $datas 初始化的数据
	 */
	initDataHandler($datas) {
		let $this = this
		let handler = {
			set(target, key, value, receiver) {
				$this.setHTMLHandler(key, value)
				return Reflect.set(target, key, value, receiver)
			},
			get(target, key, receiver) {
				return Reflect.get(target, key, receiver)
			}
		}
		if(typeof this.$data !== 'object') {
			this.$data = new Proxy({}, handler)
		}
		for(let $data in $datas) {
			this.$data[$data] = $datas[$data]
		}
	}
	/*
	 ** 给初始化的变量上监听，实现mvvm模式
	 ** $datas 初始化的数据
	 */
	bindVarHandler($datas) {
		let getHandler = key => {
			return {
				enumerable: true,
				configurable: true,
				set(val) {
					this.$data[key] = val
				},
				get() {
					return this.$data[key]
				}
			}
		}
		for(let $data in $datas) {
			Object.defineProperty(this, $data, getHandler($data))
			this[$data] = $datas[$data]
		}
	}
	/*
	 ** 实现自定义监听组件
	 */
	bindEventHandler() {
		let $els = document.querySelectorAll(`${this.$el} [p-click]`)
		for (let i = 0, length = $els.length; i < length; i++) {
			let $el = $els[i]
			let $value = $el.getAttribute('p-click')
			if (this.$method[$value]) {
				$el.onclick = (e) => {this.$method[$value].call(this, e)}
			}
		}
	}
	/*
	 ** 实现设置数据自动变更
	 ** key 对应data里的键
	 ** value 对应键的值
	 */
	setHTMLHandler(key, value) {
		let $els = document.querySelectorAll(`${this.$el} [p-bind="${key}"]`)
		for (let i = 0, length = $els.length; i < length; i++) {
			let $el = $els[i]
			let $value = $el.getAttribute('p-bind')
			this[$value] ? $el.innerText = value : $el.innerText = $value
		}
	}
	/*
	 ** 解析模板文件,生成对应HTML元素
	 ** $components 对应模板组件
	 */
	analysComponentsHandler($components) {
		if ($components instanceof Array) {
			$components.map($component => {
				let $el = document.querySelector('sub')
                let $element = this._getHtmlNode($component.template(), $component.id)
				$el.parentNode.replaceChild($element, $el)
			})
		}
	}
	/*
	 ** 生成HTML元素
	 ** $template 对应模板
	 ** $id 对应元素的id
	 */
	_getHtmlNode($template, $id) {
        let $el = document.createElement('div')
		$el.innerHTML = $template 
		return $el.firstElementChild
	}
	/*
	 ** 实现组件注册的方法
	 ** plugin插件
	 */
	static use(plugin) {
	}
}

export default PersonVue