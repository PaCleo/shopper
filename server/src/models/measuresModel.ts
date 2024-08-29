import { measureType } from "./Enums/measureTypeEnum";

export interface measures {
    id: number
    measuure_uuid: string
    customer_code: number
    measure_datetime: Date
    measure_type: measureType
    measure_value: number
    has_confirmed: boolean
    image_url: string
    created_at: Date
}