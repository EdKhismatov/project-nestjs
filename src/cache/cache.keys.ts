export const cacheRefreshToken = (token: string) => `refresh:${token}`;
export const cacheProductsId = (id: string) => `getProductId:${id}`;
export const cacheProductsAll = (id: string) => `getProductAll:${id}`;
export const cacheProductsMy = (id: string) => `getProductMy:${id}`;
