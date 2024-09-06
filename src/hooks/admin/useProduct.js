import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useProduct = () => {
    const {userID} = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [productList, setProductList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const [ddownToggle, setDDownToggle] = useState({});
    const [searchText, setSearchText] = useState('')
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        mode: 'Single',
        id: '',
        title: '',
        variID: '',
    })

   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined){
            navigate('../login')
        }
    }, [userID])

    useEffect(() => {
        if(userID !== ''){
            loading.list && handleGetRequest(ROUTES.commonProductRoute, 'list')        
        }
    }, [loading.list, userID])

    // Filter Product List
    useEffect(() => {
        if(productList?.length > 0){
            let tempList = productList;
            if(searchText !== ''){
                tempList = tempList.filter(product => String(product.name).toLowerCase().includes(searchText.toLowerCase()))
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [productList, searchText])
 
    // Create Dropdown List
    useEffect(() => {
        if(productList?.length > 0){
            let tempDDown = {};
            productList.forEach(item => {
                tempDDown[item._id] = false;
            })

            startTransition(() => {
                setDDownToggle(tempDDown)
            })
        }
    }, [productList])

    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setProductList(response.data)
            })
        }
    }


    // Handle Product Visit
    function handleProductNavigation(productID){
        navigate(`http://localhost:3001/${productID}`)
    }

    // Handle Product Deletion
    async function handleProductDeletion(productID) {
        const response = await HandlePostRequest({
            data: {productID: productID},
            route: `${ROUTES.commonProductRoute}/${productID}`,
            type: 'delete',
            toastDescription: `Product has deleted successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
                window.location.reload()
            })
        }
    }
    // Handle Variation Deletion
    async function handleProductVariationDeletion(productID, variationID) {
        const response = await HandlePostRequest({
            data: {productID: productID, variationID: variationID},
            route: `${ROUTES.commonProductVariationRoute}/${productID}/${variationID}`,
            type: 'delete',
            toastDescription: `Variation has deleted successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
            })
        }
    }

    // Handle Product Status Update
    async function handleProductStatusUpdate(productID, value) {
        const response = await HandlePostRequest({
            data: {value: value, productID: productID},
            route: `${ROUTES.commonProductRoute}/${productID}`,
            type: 'put',
            toastDescription: `Product has ${value ? 'activated' : 'deactivated'} successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
                window.location.reload()
            })
        }
    }
    // Handle Variation Status Update
    async function handleVariationStatusUpdate(productID, variationID, value) {
        const response = await HandlePostRequest({
            data: {variationID: variationID, value: value, productID: productID},
            route: `${ROUTES.commonProductVariationRoute}/${productID}/${variationID}`,
            type: 'put',
            toastDescription: `Variation has ${value ? 'activated' : 'deactivated'} successfully!`
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
    ddownToggle, 
    modalToggle,
    modalData, 
    setModalToggle,
    setModalData,
    setDDownToggle, 
    setSearchText,
    handleProductNavigation,
    handleProductDeletion,
    handleProductVariationDeletion,
    handleConfirmation,
    handleProductStatusUpdate,
    handleVariationStatusUpdate
  }
}

export default useProduct