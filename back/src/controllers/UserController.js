import { UserService } from "../services/UserService.js";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res) {
    const { name, email, password, role } = req.body;
    try {
      const user = await this.userService.create({
        name,
        email,
        password,
        role,
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const users = await this.userService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      const user = await this.userService.findById(Number(id));
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByEmail(req, res) {
    const { email } = req.params;
    try {
      const user = await this.userService.find(email);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const userUpdated = req.body;
    try {
      await this.userService.updateUser(Number(id), userUpdated);
      return res.status(200).json(userUpdated);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteById(req, res) {
    const { id } = req.params;
    try {
      const userDeleted = await this.userService.deleteById(Number(id));
      return res.status(204).json(userDeleted);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteByEmail(req, res) {
    const { email } = req.params;
    try {
      const userDeleted = await this.userService.deleteByEmail(email);
      return res.status(204).json(userDeleted);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
