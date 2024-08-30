import { Request, Response } from 'express';
import { validateBase64Image, checkMontlhyReading, saveMeasure } from '../services/uploadService.js';
import { customers } from '../models/customersModel.js';
import { measures } from '../models/measuresModel.js';
import { measureTypeEnum } from '../models/Enums/measureTypeEnum.js';
import  processImageWithGemini from '../services/geminiService.js'


export const uploadController = async (req: Request, res: Response) => {
    try {
        const {
            image,
            customer_code,
            measure_datetime,
            measure_type,
        }: {
            image: string,
            customer_code: customers['custumer_code'],
            measure_datetime: measures['measure_datetime'],
            measure_type: measures['measure_type']
        } = req.body;

        const normalizeMeasureType = measure_type.toUpperCase();
        const dbMeasureType = (normalizeMeasureType === 'WATER') ? measureTypeEnum.WATER :
                              (normalizeMeasureType === 'GAS') ? measureTypeEnum.GAS : null;
        

        console.log(customer_code, measure_datetime, dbMeasureType)
        if (!validateBase64Image(image) || !customer_code || !measure_datetime || !dbMeasureType) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_descriptions: 'Os dados fornecidos são inválidos',
            });
        }

        if (await checkMontlhyReading(customer_code, measure_datetime, dbMeasureType)) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_descriptions: 'Leitura do mês já realizada',
            });
        }

       const imageProcess = await processImageWithGemini(image);
       console.log(imageProcess.value, imageProcess.image_url);     
       const wasSaved = await saveMeasure(imageProcess.uuid, customer_code, measure_datetime, dbMeasureType, imageProcess.image_url, imageProcess.value);

        
        if (wasSaved) {
            return res.status(200).json({
                image_url: imageProcess.image_url,
                measure_value: imageProcess.value,
                measure_uuid: imageProcess.uuid
            });
        }

    } catch (error) {
        console.error('Erro no uploadcontroller',error);
    }
}