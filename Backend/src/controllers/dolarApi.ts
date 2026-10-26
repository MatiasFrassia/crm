import type { Request, Response } from 'express';

export const getCotizacionDolar = async (req: Request, res: Response) => {
  try {
    
    const [resOficial, resBlue] = await Promise.all([
      fetch('https://dolarapi.com/v1/dolares/oficial'),
      fetch('https://dolarapi.com/v1/dolares/blue')
    ]);

    const oficial = await resOficial.json();
    const blue = await resBlue.json();

    return res.json({
      oficial: {
        compra: oficial.compra,
        venta: oficial.venta
      },
      blue: {
        compra: blue.compra,
        venta: blue.venta
      }
    });
  } catch (error) {
    console.error('Error al obtener cotización del dólar:', error);
    return res.status(500).json({ msg: 'Error al consultar la cotización del dólar' });
  }
};