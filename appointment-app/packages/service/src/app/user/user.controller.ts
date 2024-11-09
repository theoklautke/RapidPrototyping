import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {LoginDto, User} from "interfaces";

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
    public async createUser(
        @Body() userData: User
    ): Promise<User> {
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
    public async updateUser(
        @Param('id') id: number,
        @Body() userData: User
    ): Promise<User> {
        return this.userService.updateUser(id, userData);
    }

    /**
     * Deletes a user with the specified ID.
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to void.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 204, description: 'The user has been successfully deleted.' })
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
