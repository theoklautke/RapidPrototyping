import { ApiProperty } from "@nestjs/swagger";

export class Dealer {

  @ApiProperty({ example: 1, description: 'The unique ID of the dealer (optional, usually generated by the system).' })
  id?: number;

  @ApiProperty({
    example: 10115,
    description: "The postal code where the dealership is located.",
    required: true
  })
  postalCode!: number;

  @ApiProperty({
    example: "Unter den Linden",
    description: "The street where the dealership is located.",
    required: true
  })
  street!: string;

  @ApiProperty({
    example: 1,
    description: "The house number of the dealership.",
    required: true
  })
  houseNumber!: number;

  @ApiProperty({
    example: "Berlin",
    description: "The city (Ort) where the dealership is located.",
    required: true
  })
  city!: string;

  @ApiProperty({
    example: "08:00",
    description: "The opening time of the dealership in 24-hour format.",
    required: true
  })
  openingTime!: string;

  @ApiProperty({
    example: "18:00",
    description: "The closing time of the dealership in 24-hour format.",
    required: true
  })
  closingTime!: string;
}


export class User {

  @ApiProperty({ example: 1, description: 'The unique ID of the user (optional, usually generated by the system).' })
  id?: number;

  @ApiProperty({
    example: "John",
    description: "The first name of the user.",
    required: true
  })
  firstname!: string;

  @ApiProperty({
    example: "Doe",
    description: "The last name of the user.",
    required: true
  })
  lastname!: string;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "The email address of the user.",
    required: true
  })
  email!: string;

  @ApiProperty({
    example: true,
    description: "Indicates if the user is a dealer. True for dealers, false otherwise.",
    required: true
  })
  isDealer!: boolean;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "The password for the user account.",
    required: true
  })
  password!: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user.',
    required: true,
  })
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password for the user account.',
    required: true,
  })
  password!: string;
}

export class Appointment {
  @ApiProperty({
    example: 1,
    description: 'The unique ID of the appointment (optional, usually generated by the system).'
  })
  id!: number;

  @ApiProperty({
    example: "Oil Change",
    description: "The type of service or task required for the appointment.",
    required: true
  })
  assignment!: string;

  @ApiProperty({
    example: "Berlin",
    description: "The branch where the appointment will take place.",
    required: true
  })
  branch!: string;

  @ApiProperty({
    type: () => User,
    description: "The user who owns the vehicle and booked the appointment.",
    required: true
  })
  vehicleOwner!: User;

  @ApiProperty({
    example: "B-AB 1234",
    description: "The license plate number of the vehicle for which the appointment is booked.",
    required: true
  })
  vehicleRegNo!: string;

  @ApiProperty({
    example: "Repair",
    description: "The current status of the appointment (e.g., scheduled, completed, canceled).",
    required: true
  })
  status!: string;

  @ApiProperty({
    example: "2024-10-01",
    description: "The date of the appointment in YYYY-MM-DD format.",
    required: true
  })
  date!: string;

  @ApiProperty({
    example: "10:30",
    description: "The time of the appointment in 24-hour format.",
    required: true
  })
  time!: string;
}