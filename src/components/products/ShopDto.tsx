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

