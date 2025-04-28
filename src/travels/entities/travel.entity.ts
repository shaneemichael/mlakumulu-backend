import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tourist } from '../../tourists/entities/tourist.entity';

@Entity()
export class Travel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'json' })
  destination: any;

  @ManyToOne(() => Tourist, (tourist: Tourist) => tourist.travels, {
    onDelete: 'CASCADE',
  })
  tourist: Tourist;

  @Column()
  touristId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
