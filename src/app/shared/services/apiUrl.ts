export const apiUrl = {
    //login
    login: 'auth/adminLogin',


    // Dashboard
    dashboardStats: 'analytics/admin/stats',

    // Integration ***********************
    integration: 'integration',

    // image upload **********************
    upload: 'utility/uploadImage',

    //product varient
    productVarient: 'product/variant',
    product: 'product',
    productMedia: 'product/media',
    productMediaIsDefault: 'product/media/setAsDefault/',
    productDetail: 'detail/',

    // Product List
    productList: 'product/listProducts',


    // Admin Add Catalogue ***************
    addCategory: 'category/addCategory',
    addSubCategory: 'category/addSubCategory',
    addSubSubCategory: 'category/addLevel3SubCategory',

    getCategory: 'category',
    getSubCategory: 'category/getSubCategory',
    getSubSubCategory: 'category/getLevel3SubCategory',



    //Orders 
    getOrders: 'order/list',

    getOrderDetails: 'order/details/',
    orderStatusChange: 'order/changeStatus',

    // Customer
    getCustomers: 'customer/list',

    // Send Notification
    customerSendNotification: 'customer/sendNotification',

    
    //Coupon
    addCoupon: 'promotion/code',

    getCoupon: 'promotion/code/list',
    editCoupon: 'promotion/code/',
    deleteCoupon: 'promotion/code/',
    isActive: 'promotion/code/changeStatus/',

    //App Banner
    bannerList: 'banner/list',
    bannerDelete: 'banner/',
    bannerChangeStatus: 'banner/changeStatus/',
    addBanner: 'banner',
    updateBanner: 'banner/'
};
