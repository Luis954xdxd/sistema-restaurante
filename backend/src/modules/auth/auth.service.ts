import prisma from '../../config/prisma';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import { generateAccessToken } from '../../utils/jwt';
import { LoginInput, RegisterAdminInput } from './auth.types';

export const registerAdminService = async (input: RegisterAdminInput) => {
  const { firstName, lastName, email, password, phone } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese correo electrónico');
  }

  const adminRole = await prisma.role.findUnique({
    where: {
      name: 'ADMIN',
    },
  });

  if (!adminRole) {
    throw new Error('El rol ADMIN no existe en la base de datos');
  }

  const passwordHash = await hashPassword(password);

  const newAdmin = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      roleId: adminRole.id,
    },
    include: {
      role: true,
    },
  });

  return {
    message: 'Administrador registrado correctamente',
    user: {
      id: newAdmin.id,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      email: newAdmin.email,
      phone: newAdmin.phone,
      status: newAdmin.status,
      role: newAdmin.role.name,
      createdAt: newAdmin.createdAt,
    },
  };
};

export const loginService = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('El usuario no está activo');
  }

  const isPasswordCorrect = await comparePassword(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new Error('Credenciales inválidas');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    message: 'Inicio de sesión correcto',
    accessToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role.name,
      createdAt: user.createdAt,
    },
  };
};