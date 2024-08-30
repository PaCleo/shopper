import { Request, Response } from 'express';
import { measureTypeEnum } from '../models/Enums/measureTypeEnum.js';
import { getList } from '../services/getListService.js';


export const getListController = async (req: Request, res: Response) => {
    
    const { customer_code } = req.params
    const measureTypeQuery = req.query.measure_type

    const measure_type = typeof measureTypeQuery === 'string' ? measureTypeQuery.toUpperCase() : undefined

    const dbMeasureType = (measure_type === 'WATER') ? measureTypeEnum.WATER :
                          (measure_type === 'GAS') ? measureTypeEnum.GAS : undefined;

    const customerList = await getList(customer_code, dbMeasureType);

    if (!dbMeasureType && measureTypeQuery) {
        return res.status(400).json({
            error_code: 'INVALID_TYPE',
            error_descriptions: 'Tipo de medição não permitida',
        })
    }

    if (!customerList) {
        return res.status(404).json({
            error_code: 'MEASURES_NOT_FOUND',
            error_descriptions: 'Nenhuma Leitura encontrada',
        })
    }

    if (customerList) {
        return res.status(200).json(customerList)
    }
}