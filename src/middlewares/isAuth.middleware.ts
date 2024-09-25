import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authorizationHeader = req.header('Authorization')

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'Autorización requerida' })
  }
  const token = authorizationHeader.replace('Bearer ', '')

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No estas autorizado' })
  }

  try {
    const decoded = verify(token, (process.env as any).JWT_SECRET)
    ;(req as any).user = decoded

    next()
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'No estas autorizado' })
  }
}
