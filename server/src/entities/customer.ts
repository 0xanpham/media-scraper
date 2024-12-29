import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    unique: true,
  })
  username: string;

  @Column({
    length: 200,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
