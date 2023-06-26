import React from 'react'
import styles from './index.module.scss'
interface Props {
  leftUnit: string
  rightUnit: string
  valueUnit?: string
  changeConfirm?: (val: string) => void
}

function SelectUnit(props: Props) {
  const { leftUnit = '%', valueUnit, rightUnit = '$', changeConfirm } = props
  const [activetUnit, setActiveUnit] = useState<any>(valueUnit || '')

  const changValue = (val: string) => {
    setActiveUnit(val)
    if (changeConfirm) changeConfirm(val)
  }

  const renderNode = () => {
    return (
      <div className={`${styles.selectUnit} flex h-[2.375rem] w-[5.875rem] items-center`}>
        <div
          onClick={() => changValue(leftUnit)}
          className={`${
            styles.leftUnit
          }  w-[50%] min-h-full flex items-center shadow-sm cursor-pointer justify-center text-sm ${
            activetUnit === leftUnit ? 'text-color-[#ffffff] bg-[#2A4948]' : ''
          } `}
        >
          {leftUnit}
        </div>
        <div
          onClick={() => changValue(rightUnit)}
          className={`${
            styles.rightUnit
          }  w-[50%] min-h-full flex items-center justify-center cursor-pointer text-sm shadow-sm
        ${activetUnit === rightUnit ? 'text-color-[#fff] bg-[#2A4948]' : ''}
         `}
        >
          {rightUnit}
        </div>
      </div>
    )
  }

  useEffect(() => {
    setActiveUnit(valueUnit)
  }, [valueUnit])

  return <>{renderNode()}</>
}

export default SelectUnit
