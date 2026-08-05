import { UserRepository } from "../repositories/UserRepository.js";
import validator from "validator";
import bycrypt from "bcryptjs";

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create({ name, email, password }) {
    const emailIsValid = this.validateEmail(email);
    const userExist = await this.userRepository.findByEmail(email);
    if (userExist) {
      throw new Error(`Já existe um usuário com o email: ${email}`);
    }

    const hashPassword = await bycrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email: emailIsValid,
      password: hashPassword,
    });

    const { password_, ...userNoPassword } = user;
    return userNoPassword;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findById(id) {
    const userId = await this.userRepository.findById(id);
    if (!userId) {
      throw new Error(`Usuário com id: ${id} não encontrado`);
    }
    return userId;
  }

  async findByEmail(email) {
    const userEmail = await this.userRepository.findByEmail(email);
    if (!userEmail) {
      throw new Error(`Usuário com email: ${email} não encontrado`);
    }
    return userEmail;
  }

  async deleteById(id) {
    await this.findById(id);
    return await this.userRepository.delete(id);
  }

  async deleteByEmail(email) {
    await this.findByEmail(email);
    return await this.userRepository.delete(email);
  }

  async updateUser(id, data) {
    await this.findById(id);
    if (data.password) {
      data.password = await bycrypt.hash(data.password, 10);
    }
    if (data.email) {
      const emailIsValid = await this.validateEmail(data.email);
      data.email = emailIsValid;
    }

    const updatedUser = await this.userRepository.update(id, data);
    const { password, ...userNoPassword } = updatedUser;
    return userNoPassword;
  }

  validateEmail(email) {
    if (!email || !validator.isEmail(email)) {
      throw new Error("Email inválido");
    }

    return validator.normalizeEmail(email);
  }
}
