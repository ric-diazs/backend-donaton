import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

/**
* Capa de repository para operaciones CRUD de usuarios.
* 
* Persistencia de datos es manejada por ORM Prisma.
*/
export const createUsuario = async (data: Prisma.UsuarioCreateInput) => {
  /**
   * Crea un usuario en la base de datos
   *
   * @param data - Es el payload en formato 'Prisma.UsuarioCreateInput' que contiene los datos
   *               solicitados para ser registrados en la tabla 'Usuario' de la base de datos.
   *
   * @returns Regresa la entidad 'Usuario' generada por Prisma.
   */
  return await prisma.usuario.create({ data })
}

export const getUsuarios = async () => {
  /**
   * Obtiene todos los usuarios registrados
   *
   * @returns Regresa una lista de entidades 'Usuario' registrados. Si no existen, se regresa una lista vacia ([])
   * 
   */
  return await prisma.usuario.findMany()
}

export const getUsuarioById = async (id: number) => {
  /**
  * Obtiene un usuario filtrado por su identificador o 'id'
  *
  * @param {number} id - Identificador del usuario
  *
  * @returns Regresa la entidad 'Usuario' de Prisma encontrada para ese 'id'. Si el usuario con ese 'id' no existe, se retorna 'null'.
  *
  */
  return await prisma.usuario.findUnique({ where: { id } })
}

export const updateUsuarioById = async (id: number, data: Prisma.UsuarioUpdateInput) => {
  /**
  * Actualiza un usuario segun su identificador o 'id'
  *
  * @param {number} id - Identificador del usuario
  * @param {Prisma.UsuarioUpdateInput} data - Cuerpo con los atributos a modificar de ese registro
  *
  * @returns Regresa entidad 'Usuario' actualizada si es encontrado por su 'id'
  *
  * @throws {PrismaClientKnownRequestError} Si usuario con identificador 'id' no existe, se regresa error generado por Prisma.
  */
  return await prisma.usuario.update({ where: { id }, data })
}

export const deleteUsuario = async (id: number) => {
  /**
  * Elimina un usuario segun su identificador o 'id'
  *
  * @param {number} id - Identificador del usuario
  *
  * @returns Regresa entidad 'Usuario' filtrado por su 'id' que fue eliminada
  *
  * @throws {PrismaClientKnownRequestError} Si usuario con identificador 'id' no existe, se regresa error generado por Prisma.
  */
  return await prisma.usuario.delete({ where: { id } })
}