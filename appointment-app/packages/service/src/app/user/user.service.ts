import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from 'interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    /**
     * Retrieves all users from the database.
     * @returns A promise that resolves to an array of User objects.
     */
    public async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    /**
     * Creates a new user and saves it to the database.
     * @param userData - The user data to be created.
     * @returns A promise that resolves to the created User object.
     */
    public async createUser(userData: User): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

    /**
     * Updates an existing user by ID with the provided data.
     * @param id - The ID of the user to be updated.
     * @param userData - The updated user data.
     * @returns A promise that resolves to the updated User object.
     */
    public async updateUser(id: number, userData: User): Promise<User> {
        await this.userRepository.update(id, userData);
        return this.userRepository.findOne({ where: { id } });
    }

    /**
     * Deletes a user by ID from the database.
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to void.
     */
    public async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
