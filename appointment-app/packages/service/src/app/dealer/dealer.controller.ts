import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { DealerService } from './dealer.service';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Dealer } from 'interfaces';

@ApiTags('dealers')
@Controller('dealer')
export class DealerController {
    constructor(private dealerService: DealerService) {}

    /**
     * Retrieves all dealers from the service.
     * @returns A promise that resolves to an array of Dealer objects.
     */
    @Get()
    @ApiOperation({ summary: 'Retrieve all dealers', description: 'Fetches all dealers from the database.' })
    @ApiResponse({ status: 200, description: 'A list of all dealers.', type: [Dealer] })
    public async getAllDealers(): Promise<Dealer[]> {
        return this.dealerService.getAllDealers();
    }

    /**
     * Creates a new dealer using the provided dealer data.
     * @param dealerData - The dealer data for creating a new record.
     * @returns A promise that resolves to the created Dealer object.
     * @throws {HttpException} Throws an error if the input data is invalid.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new dealer', description: 'Creates a new dealer record with the provided data.' })
    @ApiResponse({ status: 201, description: 'The dealer has been successfully created.', type: Dealer })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({ description: 'Dealer data required to create a new dealer', type: Dealer })
    public async createDealer(
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        return this.dealerService.createDealer(dealerData);
    }

    /**
     * Updates an existing dealer with the specified ID.
     * @param id - The ID of the dealer to update.
     * @param dealerData - The updated dealer data.
     * @returns A promise that resolves to the updated Dealer object.
     * @throws {HttpException} Throws an error if the dealer with the specified ID is not found.
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing dealer', description: 'Updates an existing dealer based on the provided ID and data.' })
    @ApiParam({ name: 'id', type: 'integer', description: 'The ID of the dealer to update' })
    @ApiResponse({ status: 200, description: 'The dealer has been successfully updated.', type: Dealer })
    @ApiResponse({ status: 404, description: 'Dealer with the specified ID not found.' })
    @ApiBody({ description: 'Updated dealer data', type: Dealer })
    public async updateDealer(
        @Param('id', ParseIntPipe) id: number,
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        return this.dealerService.updateDealer(id, dealerData);
    }

    /**
     * Deletes a dealer with the specified ID.
     * @param id - The ID of the dealer to delete.
     * @returns A promise that resolves to void.
     * @throws {HttpException} Throws an error if the dealer with the specified ID is not found.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a dealer', description: 'Deletes the dealer record associated with the provided ID.' })
    @ApiParam({ name: 'id', type: 'integer', description: 'The ID of the dealer to delete' })
    @ApiResponse({ status: 204, description: 'The dealer has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Dealer with the specified ID not found.' })
    public async deleteDealer(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.dealerService.deleteDealer(id);
    }
}
