import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DealerService } from './dealer.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Get all dealers' })
    @ApiResponse({ status: 200, description: 'Return all dealers.' })
    public async getAllDealers(): Promise<Dealer[]> {
        return this.dealerService.getAllDealers();
    }

    /**
     * Creates a new dealer using the provided dealer data.
     * @param dealerData - The dealer data to be created.
     * @returns A promise that resolves to the created Dealer object.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new dealer' })
    @ApiResponse({ status: 201, description: 'The dealer has been successfully created.', type: Dealer })
    public async createDealer(
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        return this.dealerService.createDealer(dealerData);
    }

    /**
     * Updates an existing dealer with the specified ID using the provided data.
     * @param id - The ID of the dealer to be updated.
     * @param dealerData - The updated dealer data.
     * @returns A promise that resolves to the updated Dealer object.
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing dealer' })
    @ApiResponse({ status: 200, description: 'The dealer has been successfully updated.', type: Dealer })
    public async updateDealer(
        @Param('id') id: number,
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        return this.dealerService.updateDealer(id, dealerData);
    }

    /**
     * Deletes a dealer with the specified ID.
     * @param id - The ID of the dealer to be deleted.
     * @returns A promise that resolves to void.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a dealer' })
    @ApiResponse({ status: 204, description: 'The dealer has been successfully deleted.' })
    public async deleteDealer(@Param('id') id: number): Promise<void> {
        return this.dealerService.deleteDealer(id);
    }
}
