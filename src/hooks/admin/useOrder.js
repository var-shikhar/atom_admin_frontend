import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

// userId.firstName + userId.lastName,
// products [{
//     sku: '',
//     id: '',
//     variationID: '',
//     isVariation: false,
//     name: '',
//     quantity: '',
//     price: '',
// }]
// totalAmount,
// discount,
// finalAmount,
// orderDate,
// shippingAddress
//     addressLine1,
//     addressLine2,
//     city,
//     stateId.name,
//     zipCode,
//     countryId.name,
// status,
// note

const useOrder = () => {
    const { userID } = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [orderList, setOrderList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const [searchText, setSearchText] = useState('')
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        size: '',
        orderID: '',
        mode: '',
    });

   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined) navigate('../login')
    }, [userID])

    useEffect(() => {
        userID !== '' && loading.list && handleGetRequest(ROUTES.commonOrderRoute, 'list')
    }, [loading.list, userID])

    // Filter Product List
    useEffect(() => {
        if(orderList?.length > 0){
            let tempList = orderList;
            if(searchText !== ''){
                tempList = tempList.filter(order => String(order.name).toLowerCase().includes(searchText.toLowerCase()))
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [orderList, searchText])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setOrderList(response.data)
            })
        }
    }

    // Handle Product Status Update
    async function handleOrderStatus(orderID, note) {
        const response = await HandlePostRequest({
            data: {orderID: orderID, note: note},
            route: ROUTES.commonOrderRoute,
            type: 'put',
            toastDescription: 'Order status has updated successfully!'
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
                window.location.reload()
            })
        }
    }

    // Handle Request Confirmation
    function handleConfirmation() {
        startTransition(() => {
            setLoading(prev => ({...prev, list: true}))
            setModalToggle(!modalToggle);
        })
    }

  return {
    filteredList,
    searchText,
    modalToggle,
    modalData, 
    setModalToggle,
    setModalData,
    setSearchText,
    handleConfirmation,
    handleOrderStatus,
  }
}

export default useOrder