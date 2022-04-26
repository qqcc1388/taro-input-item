# taro input-item自定义组件

项目中有一个表单提交的需求，表单内容样式较多，如果每个都写在同一个页面，那页面内容将会特别多 于是考虑到可拓展性 于是动手造轮子 
![](https://img2022.cnblogs.com/blog/950551/202204/950551-20220426162151773-1494713079.jpg)

根据相识度，将InputItem分成对应的几种类型 通过传参的方式显示不用的类型
InputItem组件中主要参数定义：
type类型  取值范围：input | text | radio | number | select  几种类型
      input：类型为带输入框的样式 默认类型
      text：类型为值类型 显示在最右边显示一个不可编辑的text
      radio：radio类型 单选
      number：包含inputNumber的样式
      select：选项类型可以点击弹窗选择选项卡
title/subTitle：为显示在最做边的标题
placeholder：没值时input/select类型默认显示文案提示 请输入/请选择
min：inputNumber最小值
max：inputNumber最大值 
maxlength：input类型可输入的最大长度
pickerItems：select类型需要的值列表 跟rangeKey保持绑定 [{value:'北京'},{value:'天津'}]
rangeKey：select类型列表对象中值绑定的属性默认为value 跟pickerItems息息相关 
separator：select如果是多级选项卡选到的结果通过separator分隔 eg: 湖北省-武汉市-洪山区
radios：radio类型选项列表 [{ value: '1', name: '是' },{ value: '0', name: '否' }]
mode：select类型用到了Picker顺带这就把picker的几种类型也加入进来了  对应的取值范围 selector | multiSelector | date | time | region
        selector单列滚轴 选完后返回value值
        multiSelector多列滚轴 选完后返回vlaues值通过separator分隔的value 和 选中的对象列表datas
        dater日期滚轴 点击返回选中的日期
        time时间滚轴 点击返回选中的时间
        region省市区滚轴  点击返回vlaues值通过separator分隔的value 和 选中的对象列表data

对应代码分析
1.input 输入监听和返回
![](https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172644738-505429154.jpg)

```
/// 当类型为input
type === "input" ? (
              <Input
                className="input"
                placeholder={placeholder}
                type={inputType}
                maxlength={maxlength}
                disabled={editable === false}
                value={value}
                onInput={this.onInputValueChange.bind(this)}
              >
              </Input>
            )

  /// Input输入变化回调  通知引用方通过onValueChange保存键盘输入变化
  onInputValueChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }
使用：
          <InputItem
            title="行驶里程数"
            placeholder="必填"
            inputType="number"
            maxlength={7}
            value={form.mileage}
            type="input"
            onValueChange={(val) => {
              form.mileage = val
              this.setState({
                form
              })
            }}
          ></InputItem>
```
2.text 直接显示无需回调
![](https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172701528-129329194.jpg)

```
 type === "text" ? (
              <View className="text">{value}</View>
            )
使用：
<InputItem
  title="品牌"
  value={form.property_brand}
  type="text"
></InputItem>
```
3.radio 通过radios动态创建多个radio并通过onRadioChange接收用户的操作变化
![](https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172719284-2115305062.jpg)

```
 type === "radio" ? (
              <View className="radio">
                <RadioGroup onChange={this.onRadioChange.bind(this)}>
                  {
                    radios.map(item => {
                      return (
                        <Radio key={item.name} className="radio-item" value={item.value} checked={item.value == value} color="#E7242E" disabled={editable === false}>
                          {item.name}
                        </Radio>
                      )
                    })
                  }
                </RadioGroup>
              </View>
            ) 

  /// radio状态变化
  onRadioChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }
使用：
<InputItem
  title="是否运营车辆"
  value={form.is_operate}
  type="radio"
  radios={[
    { value: '1', name: '是' },
    { value: '0', name: '否' }
  ]}
  onValueChange={(val) => {
    form.is_operate = val
    this.setState({
      form
    })
  }}
></InputItem>
```
4.number 用到了taro-ui中的AtInputNumber
![](https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172803528-2118823499.jpg)

```
type === "number" && (
          <View className="inputNumber">
            <AtInputNumber
              type="number"
              value={value}
              disabledInput={disabledInput}
              max={max}
              min={min}
              step={step}
              editable={editable}
              onChange={this.onInputNumberChange.bind(this)}
            ></AtInputNumber>
          </View>
        )

  /// InputNumber数据变化回调
  onInputNumberChange = (value) => {
    this.props.value = value
    if (this.props.onNumberChange) {
      this.props.onNumberChange(value)
    }
  }

使用：
<InputItem
  title="数量"
  placeholder="必填"
  value={form.registration_num}
  type="number"
  disabledInput={true}
  max={numers.length}
  onNumberChange={(val) => {
    form.registration_num = val
    form.production_dates = production_dates
      this.setState({
        form
      })
  }}
></InputItem>

```
5.select  通过传入mode的不同Picker显示不同的mode 包含单选 多选 日期 时间 省市区选择
<div style="text-align:left">
<img src="https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172833839-196607168.jpg" width="19%" height="19%">  
<img src="https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172842890-926404148.jpg" width="19%" height="19%">  
<img src="https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172851861-640308148.jpg" width="19%" height="19%">  
<img src="https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172900082-1819980611.jpg" width="19%" height="19%">
<img src="https://img2022.cnblogs.com/blog/950551/202204/950551-20220426172909206-76820601.jpg" width="19%" height="19%">
</div>

```
 {type === "select" ? (
              <View className={`picker ${value ? "" : "placeholder"}`}>{
                mode === 'selector' ? <Picker mode='selector' range={pickerItems} rangeKey={rangeKey} onChange={this.onPickerItemChange.bind(this)}>
                  {value || placeholder}
                </Picker> :
                  mode === 'multiSelector' ? <Picker mode='multiSelector' range={pickerItems} rangeKey={rangeKey} onChange={this.onMutilPickerItemChange.bind(this)}>
                    {value || placeholder}
                  </Picker> :
                    mode === 'date' ? <Picker mode='date' onChange={this.onDatePickerItemChange.bind(this)}>
                      {value || placeholder}
                    </Picker> :
                      mode === 'time' ? <Picker mode='time' onChange={this.onTimePickerItemChange.bind(this)}>
                        {value || placeholder}
                      </Picker> :
                        mode === 'region' ? <Picker mode='region' level="city" value={region} range={pickerItems} onChange={this.onRegionPickerItemChange.bind(this)}>
                          {value || placeholder}
                        </Picker> : null
              }
              </View>
            )

/// 对应回调方法
  onPickerItemChange = (e) => {
    const { rangeKey } = this.props
    const data = this.props.pickerItems[e.detail.value]
    const value = data[rangeKey]
    this.props.value = value
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value, data)
    }
  }

  onMutilPickerItemChange = (e) => {
    const { rangeKey } = this.props
    const count = e.detail.value.length
    var value = ''
    var list = []
    var values = []
    for (let i = 0; i < count; i++) {
      const data = this.props.pickerItems[i][e.detail.value[i]]
      values.push(data[rangeKey])
      list.push(data)
    }
    value = values.join(this.props.separator)
    this.props.value = value
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value, list)
    }
  }

  onDatePickerItemChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value)
    }
  }

  onTimePickerItemChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value)
    }
  }

  onRegionPickerItemChange = (e) => {
    const { value, postcode, code } = e.detail
    this.props.value = value
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value, postcode, code)
    }
  }
使用：
<InputItem
  title="单选"
  placeholder="请选择"
  value={form.property_brand}
  type="select"
  rangeKey='value'
  pickerItems={brands}
  onPickerChange={(val, data) => {
    form.property_brand = val
    form.property_brand_id = data.id
    this.setState({
      form,
    })
  }}
></InputItem>

<InputItem
  title="多选"
  placeholder="请选择"
  value={form.property_specification}
  type="select"
  mode="multiSelector"
  separator="/"
  rangeKey='value'
  pickerItems={multiArray}
  onPickerChange={(val, datas) => {
    form.property_specification = val
    form.property_specification_id = datas[0].id
    form.property_fineness_ratio_id = datas[1].id
    form.property_thickness_id = datas[2].id
    this.setState({
      form,
    })
  }}
></InputItem>

<InputItem
  title="日期"
  placeholder="请选择"
  value={form.date}
  type="select"
  mode="date"
  onPickerChange={(val) => {
    form.date = val
    this.setState({
      form,
    })
  }}
></InputItem>

<InputItem
  title="时间"
  placeholder="请选择"
  value={form.time}
  type="select"
  mode="time"
  onPickerChange={(val) => {
    form.time = val
    this.setState({
      form,
    })
  }}
></InputItem>

<InputItem
  title="省市区"
  placeholder="请选择"
  value={form.region}
  type="select"
  mode="region"
  onPickerChange={(val) => {
    form.region = val
    this.setState({
      form,
    })
  }}
></InputItem>
```
