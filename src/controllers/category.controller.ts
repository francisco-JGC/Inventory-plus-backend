import { AppDataSource } from '../config/database.config'
import { Category } from '../entities/categories/category.entity'
import type { IHandleResponseController } from './types'
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

    await AppDataSource.getRepository(Category).save(category)

    return {
      data: category,
      success: true
    }
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}

export const getCategories = async (): Promise<
  IHandleResponseController<ICategoryResponse[]>
> => {
  try {
    const categories = await AppDataSource.getRepository(Category).find()

    return {
      data: categories,
      success: true
    }
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
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
      return {
        message: 'Esta categoria no existe',
        success: false
      }
    }

    return {
      data: category,
      success: true
    }
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    }
  }
}
