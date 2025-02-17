import React from 'react'
import Image from 'next/image'

const AdminLogo: React.FC = () => {
  return (
    <div>
      <Image src='/favicon-alt.svg' alt='SAGW Logo' width='300' height='100' />
    </div>
  )
}

export default AdminLogo
