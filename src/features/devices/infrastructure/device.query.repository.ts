import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../api/models/output/device.output.model';
import { DeviceDbType } from '../../types';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class DeviceQueryRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}

  async findAllActiveSessionFromUserId(
    userId: ObjectId,
  ): Promise<DeviceViewModel[] | undefined> {
    const result = await this.DeviceModel.find({ userId: userId });
    return result.map((i: DeviceDbType) => ({
      ip: i.ip,
      title: i.deviceName,
      lastActiveDate: i.lastActiveDate,
      deviceId: i._id.toString(),
    }));
  }
}
