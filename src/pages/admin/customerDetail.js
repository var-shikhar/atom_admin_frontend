import React from 'react'
import useCustomerDetail from '../../hooks/admin/useCustomerDetail'
import { useParams } from 'react-router-dom'

const CustomerDetail = () => {
    const {id} = useParams();
    const {customerDetails} = useCustomerDetail(id)
    return (
        <div>CustomerDetail</div>
    )
}

export default CustomerDetail