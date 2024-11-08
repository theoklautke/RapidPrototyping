import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'interfaces';

/**
 * Represents a user entity in the database.
 * This entity is mapped to the 'user' table in the 'public' schema.
 */
@Entity({
    name: 'user',
    schema: 'public',
})
export class UserEntity implements User {
    /**
     * The unique identifier for the user.
     * This column is auto-generated and serves as the primary key for the entity.
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The first name of the user.
     * For example, 'John' or 'Alice'.
     */
    @Column({ name: 'firstname' })
    firstname: string;

    /**
     * The last name of the user.
     * For example, 'Doe' or 'Smith'.
     */
    @Column({ name: 'lastname' })
    lastname: string;

    /**
     * The email address of the user.
     * For example, 'john.doe@example.com'.
     */
    @Column({ name: 'email', unique: true })
    email: string;

    /**
     * Indicates if the user is a dealer.
     * True for dealers, false otherwise.
     */
    @Column({ name: 'isdealer' })
    isDealer: boolean;

    /**
     * The password for the user account.
     * The password will be stored securely, typically hashed.
     */
    @Column({ name: 'password' })
    password: string;
}
