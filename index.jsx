import React, { Component } from "react"
import { View, Input, Image, Picker, Radio, RadioGroup } from "@tarojs/components"
import { AtInputNumber, AtInput, AtCheckbox } from "taro-ui"
import Assets from "@/assets"
import "./index.scss"

export default class InputItem extends Component {
  constructor(props) {
    super(props)
  }

  /// InputNumber数据变化回调
  onInputNumberChange = (value) => {
    this.props.value = value
    if (this.props.onNumberChange) {
      this.props.onNumberChange(value)
    }
  }

  /// radio状态变化
  onRadioChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }

  /// Input输入变化回调
  onInputValueChange = (e) => {
    const { value } = e.detail
    this.props.value = value
    if (this.props.onValueChange) {
      this.props.onValueChange(value)
    }
  }

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

  render() {
    const title = this.props.title
    const subTitle = this.props.subTitle
    const placeholder = this.props.placeholder || '请输入'
    const type = this.props.type || 'input'
    const borderBottom = this.props.borderBottom/// 是否显示底部border
    const borderTop = this.props.borderTop === false ? false : true
    const editable = this.props.editable  // 是否可以编辑
    const min = this.props.min || 1
    const max = this.props.max || 99999
    const maxlength = this.props.maxlength
    const inputType = this.props.inputType || 'text'
    const pickerItems = this.props.pickerItems || []
    const mode = this.props.mode || 'selector'
    const rangeKey = this.props.rangeKey || 'value'
    const separator = this.props.separator || ''
    const radios = this.props.radios || []
    const step = this.props.step || 1
    const disabledInput = this.props.disabledInput || false

    const { value } = this.props

    const region = ['北京市']

    const arrow = Assets("ic_arrow_right_gray.png")
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
