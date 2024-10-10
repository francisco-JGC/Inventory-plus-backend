import { backupDatabase } from '../services/backupDB'
import { restoreDatabase } from '../services/restoreDB'
import {
  handleError,
  handleNotFound,
  handleSuccess,
  IHandleResponseController
} from './types'

export const generateBackupDB =
  async (): Promise<IHandleResponseController> => {
    try {
      const backup = await backupDatabase()

      if (!backup) {
        return handleNotFound(
          'Hubo un error al realizar el backup de la base de datos'
        )
      }

      return handleSuccess('Backup realizado')
    } catch (error: any) {
      return handleError(error.message)
    }
  }

export const restoreBackupDB = async (
  fileName: string
): Promise<IHandleResponseController> => {
  try {
    const restore = await restoreDatabase(fileName)

    if (!restore) {
      return handleNotFound('Hubo un error al restaurar la base de datos')
    }

    return handleSuccess('Se ha restaurado la base de datos')
  } catch (error: any) {
    return handleError(error.message)
  }
}
