import { Request, Response } from 'express';
import { measureCorrections } from '../models/measureCorrectionsModel.js';
import { findMeasure, saveNewValue, hasConfirmed } from '../services/confirmService.js';

export const confirmController = async (req: Request, res: Response) => {
    const {
        measure_uuid,
        confirmed_value,
    }: {
        measure_uuid: measureCorrections['measure_uuid'],
        confirmed_value: measureCorrections['confirmed_value'],
    } = req.body;

    if (typeof measure_uuid !== 'string' || !Number.isInteger(confirmed_value)) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_descriptions: 'Os dados fornecidos são inválidos',
        });
    }
    
    const measure = await findMeasure(measure_uuid)

    if (!measure) {
        return res.status(404).json({
            error_code: 'MEASURE_NOT_FOUND',
            error_descriptions: 'Leitura do mês não encontrada',
        });
    }

    if (measure.has_confirmed === true ) {
        return res.status(409).json({
            error_code: 'CONFIRMATION_DUPLICATE',
            error_descriptions: 'Leitura ja foi realizada',
        })
    }

    if (measure && measure.has_confirmed === false && measure.measure_value === confirmed_value) { 
        await hasConfirmed(measure_uuid);
        return res.status(200).json({
            sucess: 'True',
        });
    } else if (measure && measure.has_confirmed === false && measure.measure_value !== confirmed_value) {
        await saveNewValue(measure_uuid, confirmed_value);
        return res.status(200).json({
            sucess: 'True',
        })
    }
}