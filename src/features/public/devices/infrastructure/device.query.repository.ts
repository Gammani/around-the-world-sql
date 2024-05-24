import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../api/models/output/device.output.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DeviceQueryRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findAllActiveSessionFromUserId(
    userId: ObjectId | string,
  ): Promise<DeviceViewModel[] | undefined> {
    const result = await this.dataSource.query(
      `SELECT id, ip, "deviceName", "lastActiveDate", "userId"
FROM public."Device"
WHERE "Device"."userId" = $1`,
      [userId],
    );
    return result.map((i) => ({
      ip: i.ip,
      title: i.deviceName,
      lastActiveDate: i.lastActiveDate,
      deviceId: i.id,
    }));
  }
}
