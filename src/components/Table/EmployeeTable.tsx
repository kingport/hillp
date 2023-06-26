import { Avatar } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

type Props = {
  data: any[]
  columns: any[]
  onChange?: (val?: any) => void
}

const EmployeeTable = (props: Props) => {
  const { data = [], columns = [], onChange } = props

  const selectRow = (item: any) => {
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={styles.employeeTable}>
      <div className={styles.tableContent}>
        <table>
          <thead className={`${styles.tableThead}`}>
            <tr>
              {columns.map((item: any) => {
                return (
                  <th className="py-4 max-w-[33.33%]" key={item.key}>
                    {item?.title}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className={styles.tableTbody}>
            {data.map((item: any) => {
              return (
                <tr onClick={() => selectRow(item)} className="active:bg-[#f9f9fa]" key={item.id}>
                  {columns.map((c: any) => {
                    return (
                      <td
                        className={`py-2 px-4 align-middle text-left ${c.align === 'right' && 'text-right'} ${
                          c.align === 'center' && 'text-center'
                        }`}
                        key={c.key}
                      >
                        {c.render(item, c.key)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeTable
