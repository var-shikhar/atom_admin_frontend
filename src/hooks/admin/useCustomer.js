import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useCustomer = () => {
    const { userID } = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [customerList, setCustomerList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const [searchText, setSearchText] = useState('')
   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined) navigate('../login')
    }, [userID])

    useEffect(() => {
        userID !== '' && loading.list && handleGetRequest(ROUTES.commonCustomerRoute, 'list')
    }, [loading.list, userID])

    // Filter Customer List
    useEffect(() => {
        if(customerList?.length > 0){
            let tempList = customerList;
            if(searchText !== ''){
                tempList = tempList.filter(customer => String(customer.name).toLowerCase().includes(searchText.toLowerCase()))
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [customerList, searchText])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setCustomerList(response.data)
            })
        }
    }

    // Handle Product Status Update
    async function handleCustomerDetail(customerID) {
        navigate(`../customer/${customerID}/detail`)
    }

    return {
        filteredList, 
        searchText, 
        setSearchText, 
        handleCustomerDetail 
    }
}

export default useCustomer