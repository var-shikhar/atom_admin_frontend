import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../../../function/axioRequest';
import ROUTES from '../../../util/routes';

const useProductVariationForm = ( id = '', productID = '' ) => {
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const [loading, setLoading] = useState({
        initial: true,
    });

    const [defaultValue, setDefaultValues] = useState({
        id: '',
        productID: productID, 
        variationType: '',
        mrpPrice: 0,
        sellingPrice: 0,
        stock: 0,
        sku: '',
        images: []
    });

    useEffect(() => {
        loading.initial && id !== '' && handleGetRequest(`${ROUTES.commonProductVariationRoute}/${productID}/${id}`, 'initial')
    }, [loading.initial, id]);

    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                setDefaultValues(prev => ({...prev, ...response.data}))
            })

        }
    }


    async function handleFormSubmisstion(values, handleConfirmation){
        const response = await HandlePostRequest({
            route: ROUTES.commonProductVariationRoute,
            type: id === '' ? 'post' : 'put',
            data: values,
            toastDescription: `Variation has ${id === '' ? 'created' : 'updated'} successfully!`
        });
        if (response?.status === 200) handleConfirmation();
    }

    return{
        defaultValue,
        handleFormSubmisstion,
    }
}

export default useProductVariationForm