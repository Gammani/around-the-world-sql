import { Column, CreateDateColumn, Entity, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEmailDataEntity } from './userEmailData.entity';

@Entity({ name: 'UserAccountData' })
export class UserAccountDataEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  email: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  recoveryCode: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDatePasswordRecovery: Date;

  @OneToOne(() => UserEmailDataEntity)
  @JoinColumn()
  userEmailDataEntity: UserEmailDataEntity;
}
