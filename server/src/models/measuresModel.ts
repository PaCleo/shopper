import { measureTypeEnum } from "./Enums/measureTypeEnum";

export interface measures {
    id: number
    measuure_uuid: string
    customer_code: string
    measure_datetime: Date
    measure_type: measureTypeEnum
    measure_value: number
    has_confirmed: boolean
    image_url: string
    created_at: Date
}