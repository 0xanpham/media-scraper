import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum MediaType {
  VIDEO = "video",
  IMAGE = "image",
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Index()
  @Column({ type: "text" })
  website: string;

  @Column({ type: "text" })
  url: string;

  @Index()
  @Column({
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @CreateDateColumn()
  createdAt: Date;
}
