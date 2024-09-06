import axios from 'axios';
import { FireToast } from '../context/toastContext';
import { useLoader } from '../context/loaderContext';


const useAxioRequests = () => {
    const { setLoading } = useLoader()

    const HandlePostRequest = async ({
        route,
        type,
        data,
        toastDescription = 'Data Submitted',
    }) => {
      
        try {
            setLoading(true)
            let response;
            const config = { withCredentials: true };
    
            switch (type) {
                case 'post':
                    response = await axios.post(route, data, config);
                    break;
                case 'put':
                    response = await axios.put(route, data, config);
                    break;
                case 'delete':
                    response = await axios.delete(route, { data, ...config });
                    break;
                default:
                    response = await axios.post(route, data, config);
                    break;
            }
    
            if (response?.status === 200) {
                FireToast({ title: 'Success', subTitle: toastDescription });
            } else {
                FireToast({ subTitle: response?.data?.message });
            }
            return response;
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "An error occurred";
            console.error(errorMessage);
            FireToast({ title: 'Error', subTitle: err?.response?.data?.message });
        } finally {
            setLoading(false);
        }
    };

    
    const HandleGetRequest = async (route) => {
        try {
            setLoading(true)
            const response = await axios.get(route, { withCredentials: true });
            if (response?.status !== 200) {
                FireToast({ subTitle: response?.data?.message });
            }
            return response;
        } catch (err) {
            console.error(err);
            FireToast({ title: 'Error', subTitle: err?.response?.data?.message });
        } finally {
            setLoading(false)
        }
    }

    return {
        HandlePostRequest,
        HandleGetRequest
    }
}

export default useAxioRequests
