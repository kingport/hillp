import HeaderNav from '@/components/HeaderNav'
import React from 'react'
import AccountDetails from './AccountDetails'
import CollectionPayment from './CollectionPayment'
import styles from './index.module.scss'

const Wallet = () => {
  const [navKey, setNavKey] = useState(2)

  const NavList = () => {
    return (
      <div className="flex text-color-[#000] items-center">
        <p onClick={() => setNavKey(2)} className={`${navKey === 2 && styles.active} text-sm`}>
          流水明细
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center pt-[48px]">
      <HeaderNav title={<NavList />} renderRight={false} />
      <div className="flex flex-col mt-10 w-[80%]">
        {navKey === 1 && <CollectionPayment />}
        {navKey === 2 && <AccountDetails />}
      </div>
    </div>
  )
}

export default Wallet
