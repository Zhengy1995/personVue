# personVue
一个模仿vue实现mvvm框架的简单轮子

### 使用方法说明

#### 示例代码

``` bash

#HTML部分
<div id='index'>
    <span p-bind='example'></span> <button p-click='changeText'>点击切换文字</button>
</div>

#js部分
import PersonVue from './personVue'
new PersonVue({
    el: '#index',
    data: {
        data: {
            example: '这是一个示例'
        },
        method: {
            changeText() {
                this.example = '你点击了button标签，触发了该事件'
            }
        }
    }
})
```

---
