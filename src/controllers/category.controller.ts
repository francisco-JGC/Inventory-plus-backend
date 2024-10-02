import { AppDataSource } from '../config/database.config'
import { Category } from '../entities/categories/category.entity'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  type IHandleResponseController
} from './types'
import {
  ICreateCategory,
  ICategoryResponse
} from '../entities/categories/types'

export const createCategory = async ({
  name,
  description
}: ICreateCategory): Promise<IHandleResponseController<ICategoryResponse>> => {
  try {
    const category = AppDataSource.getRepository(Category).create({
      name,
      description
    })

    const ifExistCategory = await getCategoryByName(name)

    if (ifExistCategory.success) {
      return handleNotFound('Ya existe una categoria con este mismo nombre')
    }

    await AppDataSource.getRepository(Category).save(category)

    return handleSuccess(category)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getCategories = async (): Promise<
  IHandleResponseController<ICategoryResponse[]>
> => {
  try {
    const categories = await AppDataSource.getRepository(Category).find()

    return handleSuccess(categories)
  } catch (error: any) {
    return handleError(error.message)
  }
}

export const getCategoryByName = async (
  name: string
): Promise<IHandleResponseController<ICategoryResponse>> => {
  try {
    const category = await AppDataSource.getRepository(Category).findOne({
      where: { name }
    })

    if (!category) {
      return handleNotFound('La categoria que esta buscando, no existe')
    }

    return handleSuccess(category)
  } catch (error: any) {
    return handleError(error.message)
  }
}
