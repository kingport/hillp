import { Picker } from 'antd-mobile'
import { PickerValue } from 'antd-mobile/es/components/picker-view'
import React from 'react'
import SvgIcon from '../SvgIcon'
import styles from './index.module.scss'

interface option {
  label: string
  value: string
}

interface Props {
  options: option[][]
  initValue?: PickerValue[]
  onChange?: (val: PickerValue[]) => void
}

const Select = (props: Props) => {
  const { options = [], initValue, onChange } = props
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState<(string | null)[]>([`${initValue}`])

  return (
    <div className={`${styles.selectInpt} flex justify-center`} onClick={() => setVisible(true)}>
      <Picker
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onConfirm={(v) => {
          setValue(v)
          if (onChange) return onChange(v)
        }}
        value={value}
        {...props}
        columns={options}
      >
        {(items, { open }) => {
          return (
            <div className="flex py-2 px-4 w-[90%] justify-between items-center rounded-xl bg-[#f4f6f6]" onClick={open}>
              <p className="text-xs">
                {items.every((item) => item === null) ? value : items.map((item) => item?.label ?? value)}
              </p>
              <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
            </div>
          )
        }}
      </Picker>
    </div>
  )
}

export default Select
