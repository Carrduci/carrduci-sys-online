export class FolioVendedorPublicoRecibir {
  estatus?: 'ABIERTO'
  cliente?: {
    nombre: string
  }
  vendedor?: {
    nombre: string
  }
  createdAt?: Date
  updatedAt?: Date
  numeroDeFolio?: number
  folioLineas?: {
      modeloCompleto: {
        nombreCompleto: string
        sku: string
        descripcionFactura: string
      }
      cantidad: number
      precioUnitarioUsado: number
      numeroDePedido: number
      serviciosAplicados?: {
        servicio: {
          nombre: string
          descripcion: string
        },
        precioUnitario: number
      }[]
  }[]
    
  constructor(params: FolioVendedorRecibirParams) {
    this.estatus = params.estatus
    this.cliente = params.cliente
    this.vendedor = params.vendedor
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
    this.numeroDeFolio = params.numeroDeFolio
    let lineas: FolioVendedorRecibirParams['folioLineas'] = []
    for (const LINEA of params.folioLineas) {
      const NUEVA_LINEA: FolioVendedorRecibirParams['folioLineas'][0] = {
        modeloCompleto: LINEA.modeloCompleto,
        cantidad: LINEA.cantidad,
        precioUnitarioUsado: LINEA.precioUnitarioUsado,
        numeroDePedido: LINEA.numeroDePedido,
        serviciosAplicados: LINEA.serviciosAplicados,
      }
      lineas.push(NUEVA_LINEA)
    }
    this.folioLineas = lineas
  }
}

export interface FolioVendedorRecibirParams {
  estatus: 'ABIERTO',
  cliente: {
    nombre: string,
  },
  vendedor: {
    nombre: string,
  },
  createdAt: Date,
  updatedAt: Date,
  numeroDeFolio: number,
  folioLineas: {
      modeloCompleto: {
        nombreCompleto: string,
        sku: string,
        descripcionFactura: string
      },
      cantidad: number,
      precioUnitarioUsado: number,
      numeroDePedido: number,
      serviciosAplicados: {
        servicio: {
          nombre: string,
          descripcion: string
        },
        precioUnitario: number
      }[]
  }[]
}