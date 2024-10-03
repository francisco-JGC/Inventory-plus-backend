import { AppDataSource } from '../config/database.config'
import { Provider } from '../entities/provider/provider.entity'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import { ICreateProvider, IProviderResponse } from '../entities/provider/types'

export const createProvider = async (
  providerObj: ICreateProvider
): Promise<IHandleResponseController<IProviderResponse>> => {
  try {
    const existProvider = await getProviderByName(providerObj.name)

    if (existProvider.success) {
      return handleNotFound('Ya existe un proveedor con ese nombre')
    }

    const createdProvider =
      AppDataSource.getRepository(Provider).create(providerObj)

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
      where: { name }
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

export const getPaginationProvider = async () => {}
