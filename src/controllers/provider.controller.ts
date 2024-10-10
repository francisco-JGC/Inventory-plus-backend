import { AppDataSource } from '../config/database.config'
import { Provider } from '../entities/provider/provider.entity'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IPagination,
  type IHandleResponseController
} from './types'
import { ICreateProvider, IProviderResponse } from '../entities/provider/types'
import { ILike } from 'typeorm'
import { Product } from '../entities/products/product.entity'

export const createProvider = async (
  providerObj: ICreateProvider
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const existProvider = await getProviderByName(providerObj.name)

    if (existProvider.success) {
      return handleNotFound('Ya existe un proveedor con ese nombre')
    }

    const createdProvider = AppDataSource.getRepository(Provider).create({
      ...providerObj
    })

    const provider =
      await AppDataSource.getRepository(Provider).save(createdProvider)

    return handleSuccess(provider)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getProviderByName = async (
  name: string
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const providerExist = await AppDataSource.getRepository(Provider).findOne({
      where: { name },
      relations: ['products']
    })

    if (!providerExist) {
      return handleNotFound('No existe un proveedor con ese nombre')
    }

    return handleSuccess(providerExist)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getAllProviders = async (): Promise<
  IHandleResponseController<IProviderResponse[]>
> => {
  try {
    const providers = await AppDataSource.getRepository(Provider).find()

    return handleSuccess(providers)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getPaginationProvider = async ({
  filter,
  page,
  limit
}: IPagination): Promise<IHandleResponseController> => {
  try {
    if (isNaN(page) || isNaN(limit)) {
      return handleNotFound('Numero de pagina o limite son valores invalidos')
    }

    const providers = await AppDataSource.getRepository(Provider).find({
      where: { name: ILike(`%${filter ? filter : ''}%`) },
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    })

    const formatedProvider = providers.map((provider) => {
      return {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        address: provider.address,
        product_length: provider.products.length,
        created_at: provider.created_at,
        phone: provider.phone
      }
    })

    return handleSuccess(formatedProvider)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const deleteProviderById = async (
  id: number
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const provider = await AppDataSource.getRepository(Provider).findOne({
      where: { id },
      relations: ['products']
    })

    if (!provider) {
      return handleNotFound('Proveedor no encontrado')
    }

    if (provider.products.length > 0) {
      await AppDataSource.getRepository(Product)
        .createQueryBuilder()
        .update(Product)
        .set({ provider: null })
        .where('providerId = :providerId', { providerId: provider.id })
        .execute()
    }

    // Ahora eliminar el proveedor
    await AppDataSource.getRepository(Provider).remove(provider)

    return handleSuccess(provider)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getProviderById = async (
  id: number
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const provider = await AppDataSource.getRepository(Provider).findOne({
      where: { id },
      relations: ['products']
    })

    if (!provider) {
      return handleNotFound('Proveedor no encontrado')
    }

    return handleSuccess(provider)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const updateProviderById = async (
  provider: Provider,
  id: number
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const providerExist = await AppDataSource.getRepository(Provider).findOne({
      where: { id }
    })

    if (!providerExist) {
      return handleNotFound('Proveedor no encontrado')
    }

    AppDataSource.getRepository(Provider).merge(providerExist, provider)
    const updatedProvider =
      await AppDataSource.getRepository(Provider).save(providerExist)

    return handleSuccess(updatedProvider)
  } catch (error: any) {
    return handleError(error.message)
  }
}
