import React, { Component } from "react"
import { View, Input, Image, Picker, Radio, RadioGroup } from "@tarojs/components"
import { AtInputNumber, AtInput, AtCheckbox } from "taro-ui"
import "./index.scss"

export default class InputItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  /// InputNumber数据变化回调
  onInputNumberChange = (value) => {
    if (this.props.onNumberChange) {
      this.props.onNumberChange(value)
    }
  }

  /// radio状态变化
  onRadioChange = (e) => {
    const { value } = e.detail
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }

  /// Input输入变化回调
  onInputValueChange = (e) => {
    const { value } = e.detail
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }

  onPickerItemChange = (e) => {
    const { rangeKey } = this.props
    const data = this.props.pickerItems[e.detail.value]
    const value = data[rangeKey]
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
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value, list)
    }
  }

  onDatePickerItemChange = (e) => {
    const { value } = e.detail
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value)
    }
  }

  onTimePickerItemChange = (e) => {
    const { value } = e.detail
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value)
    }
  }

  onRegionPickerItemChange = (e) => {
    const { value, postcode, code } = e.detail
    if (this.props.onPickerChange) {
      this.props.onPickerChange(value, postcode, code)
    }
  }

  render() {

    const { title, subTitle, placeholder, type, borderBottom, borderTop, editable, min, max, maxlength, inputType, pickerItems, mode, rangeKey, separator, radios, step, disabledInput, value } = this.props
    const region = ['北京市']
    const arrow = 'https://kz-fe.oss-cn-hangzhou.aliyuncs.com/static/kzqipeimall/img/ic_arrow_right_gray.png'

    return (
      <View className="inputItem">
        <View className={`container ${borderBottom ? "borderBottom" : ""} ${borderTop ? "borderTop" : ""}`}>
          <View className="left">
            <View className="title">{title}</View>
            {subTitle && <View className="sub-title">{subTitle}</View>}
          </View>
          <View
            className="right"
          >
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
            ) : type === "input" ? (
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
            ) : type === "text" ? (
              <View className="text">{value}</View>
            ) : type === "radio" ? (
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
            ) : (
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
            )}
            {type === "select" && (
              <Image className="arrow" src={arrow} mode="widthFix"></Image>
            )}
          </View>
        </View>
      </View >
    )
  }
}

/// 设置默认值
InputItem.defaultProps = {
  title: '',           // 左标题
  subTitle: '',        //副标题
  placeholder: '请输入',//默认提示文案
  type: 'input',       //显示类型  input | text | radio | select | number
  borderBottom: false, // 下边线
  borderTop: true,     // 上边线
  editable: true,      // 是否可以编辑
  maxlength: undefined,//输入框最大长度
  inputType: 'text',   //键盘类型
  pickerItems: [],     //select显示内容
  mode: 'selector',    //Pcker类型   selector | multiSelector | time | region
  rangeKey: 'value',   //select子级key
  separator: '',       //多选分隔符
  radios: [],          //radio显示内容
  step: 1,             //inputNumber单步
  disabledInput: false,//inputNumber是否支持输入
  min: 1,              // inputNumber最小值
  max: 99999,          // inputNumber最小值
}
