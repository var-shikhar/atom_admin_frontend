// const BACKEND_ROUTES = 'https://traffic-jam.onrender.com';
const BACKEND_ROUTES = 'http://localhost:8081';


const loginRoute = `${BACKEND_ROUTES}/auth/login`;
const logoutRoute = `${BACKEND_ROUTES}/auth/logout`;

const commonCategoryRoute = `${BACKEND_ROUTES}/admin/category`;
const commonSubCategoryRoute = `${BACKEND_ROUTES}/admin/subCategory`;

const commonProductRoute = `${BACKEND_ROUTES}/admin/product`;
const commonProductVariationRoute = `${BACKEND_ROUTES}/admin/product/variation`;

const commonOrderRoute = `${BACKEND_ROUTES}/admin/order`;

const commonCustomerRoute = `${BACKEND_ROUTES}/admin/customer`;
const commonCustomerDetailRoute = `${BACKEND_ROUTES}/admin/customer/detail`;







const getAPIDocRoute = `${BACKEND_ROUTES}/api/doc`;
const commonMemberRoute = `${BACKEND_ROUTES}/auth/member`;
const commonMemberDocumentRoute = `${BACKEND_ROUTES}/auth/member/doc`;
const commonServiceRoute = `${BACKEND_ROUTES}/admin/service`;

const commonDocumentRoute = `${BACKEND_ROUTES}/admin/setting/document`;
const commonUserRoleRoute = `${BACKEND_ROUTES}/admin/setting/user-role`;

const getUserDetails = `${BACKEND_ROUTES}/admin/attendence/userDetails`;
const commonAttendanceRoute = `${BACKEND_ROUTES}/admin/attendence/attendenceList`;
const getMonthsList = `${BACKEND_ROUTES}/admin/attendance/month`;

const postGrantImpress = `${BACKEND_ROUTES}/admin/impress/grant`;
const postReceiveImpress = `${BACKEND_ROUTES}/admin/impress/receive`;
const getTransactionList = `${BACKEND_ROUTES}/admin/transaction`;

const getReservationList = `${BACKEND_ROUTES}/admin/booking/reservation`;
const getBookingList = `${BACKEND_ROUTES}/admin/booking/service-booking`;
const putUpdateStatus = `${BACKEND_ROUTES}/admin/booking/status-update`;

const putPaymentAcknowledgement = `${BACKEND_ROUTES}/employee/payment-acknowledgement`;
const getEmployeeDetail = `${BACKEND_ROUTES}/employee/userDetails`;



const ROUTES = {
    loginRoute, logoutRoute, 
    // Category Route
    commonCategoryRoute, commonSubCategoryRoute,
    commonProductRoute, commonProductVariationRoute,
    commonOrderRoute,
    commonCustomerRoute, commonCustomerDetailRoute,
    
    commonMemberRoute, commonServiceRoute, getAPIDocRoute, commonMemberDocumentRoute,
    // Setting Routes
    commonDocumentRoute, commonUserRoleRoute,
    // Attendence Routes
    getUserDetails, getMonthsList, commonAttendanceRoute,
    // Impress
    postGrantImpress, postReceiveImpress, getTransactionList,
    getReservationList, getBookingList, putUpdateStatus,
    putPaymentAcknowledgement, getEmployeeDetail,
}

export default ROUTES