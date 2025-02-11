import React from 'react'
import Image from 'next/image'

const AdminLogo: React.FC = () => {
  return (
    <div>
      <Image src='/favicon.svg' alt='SAGW Logo' width='100' height='100' />
    </div>
  )
}

export default AdminLogo
