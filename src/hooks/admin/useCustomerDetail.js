import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useCustomerDetail = (id = '') => {
    const { userID } = useAuthContext()
    const navigate = useNavigate()
    const { HandleGetRequest } = useAxioRequests();
    const [loading, setLoading] = useState({
        detail: true,
    })

    const [customerDetails, setCustomerDetails] = useState([])
   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined) navigate('../login')
    }, [userID])

    useEffect(() => {
        loading.detail && id !== '' && handleGetRequest(`${ROUTES.commonCustomerDetailRoute}/${id}`, 'detail')
    }, [loading.detail, id])

 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setCustomerDetails(response.data)
            })
        }
    }

    return {
        customerDetails,  
    }
}

export default useCustomerDetail