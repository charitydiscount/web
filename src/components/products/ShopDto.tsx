export interface ShopDtoWrapper {
    batch: ShopDto[]
}

export interface ShopDto {
    category: string,
    defaultLeadCommissionAmount: string,
    defaultSaleCommissionRate: number,
    logoPath: string,
    mainUrl: string,
    id: number,
    name: string,
    status: string,
    uniqueCode: string
}

export var ShopDtoMap = {
    category: "category",
        defaultLeadCommissionAmount: "defaultLeadCommissionAmount",
        defaultSaleCommissionRate: "defaultSaleCommissionRate",
        logoPath: "logoPath",
        mainUrl: "mainUrl",
        id: "id",
        name: "name",
        status: "status",
        uniqueCode: "uniqueCode"
};

