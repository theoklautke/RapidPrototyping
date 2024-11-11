import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto, User } from 'interfaces';
import {isValidEmail, isNotEmpty, isValidPassword} from "shared";

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * Retrieves all users from the service.
     * @returns A promise that resolves to an array of User objects.
     */
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    public async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    /**
     * Creates a new user using the provided user data.
     * @param userData - The user data to be created.
     * @returns A promise that resolves to the created User object.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    public async createUser(@Body() userData: User): Promise<User> {
        // Validate input data
        if (!isNotEmpty(userData.firstname)) {
            throw new HttpException('Firstname cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(userData.lastname)) {
            throw new HttpException('Lastname cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isValidEmail(userData.email)) {
            throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
        }

        if (!isValidPassword(userData.password)) {
            throw new HttpException(
                'Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.userService.createUser(userData);
    }

    /**
     * Updates an existing user with the specified ID using the provided data.
     * @param id - The ID of the user to be updated.
     * @param userData - The updated user data.
     * @returns A promise that resolves to the updated User object.
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
    @ApiResponse({ status: 404, description: 'User not found.' })
    public async updateUser(
        @Param('id') id: number,
        @Body() userData: User,
    ): Promise<User> {
        // Validate input data
        if (!isNotEmpty(userData.firstname)) {
            throw new HttpException('First name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(userData.lastname)) {
            throw new HttpException('Last name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isValidEmail(userData.email)) {
            throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
        }

        if (!isValidPassword(userData.password)) {
            throw new HttpException(
                'Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedUser = await this.userService.updateUser(id, userData);
        if (!updatedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return updatedUser;
    }

    /**
     * Deletes a user with the specified ID.
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to void.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 204, description: 'The user has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    public async deleteUser(@Param('id') id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }

    /**
     * Handles user login.
     * @param loginData - The login data (email and password).
     * @returns A token or error message.
     */
    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    public async login(@Body() loginData: LoginDto): Promise<{ accessToken: string }> {
        return this.userService.login(loginData);
    }
}
