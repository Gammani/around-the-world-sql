import { Column, Entity, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryColumn } from 'typeorm';
import { UserAccountDataEntity } from './userAccountData.entity';

@Entity({ name: 'UserEmailData' })
export class UserEmailDataEntity {
  @OneToOne(() => UserAccountDataEntity)
  @JoinColumn()
  userAccountDataEntity: UserAccountDataEntity;
  @PrimaryColumn()
  userId: string;

  @Column({ nullable: false })
  confirmationCode: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDate: Date;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;
}
