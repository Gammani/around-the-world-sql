import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  CreatedDeviceDtoModelType,
  DeviceDbViewModelType,
  DeviceDtoModelType,
  DeviceSqlDbType,
} from '../../../types';
import { v1 as uuidv1, validate as validateUUID } from 'uuid';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async createDevice(
    createdDeviceDtoModel: CreatedDeviceDtoModelType,
  ): Promise<DeviceDtoModelType> {
    const newDevice = {
      id: uuidv1(),
      ip: createdDeviceDtoModel.ip,
      deviceName: createdDeviceDtoModel.deviceName,
      lastActiveDate: new Date(),
      userId: createdDeviceDtoModel.userId,
    };

    await this.dataSource.query(
      `INSERT INTO public."Device"(
id, ip, "deviceName", "lastActiveDate", "userId")
VALUES ($1, $2, $3, $4, $5);`,
      [
        newDevice.id,
        newDevice.ip,
        newDevice.deviceName,
        newDevice.lastActiveDate,
        newDevice.userId,
      ],
    );
    return {
      id: newDevice.id,
      userId: newDevice.userId,
      ip: newDevice.ip,
      deviceName: newDevice.deviceName,
      lastActiveDate: newDevice.lastActiveDate.toISOString(),
    };
  }
  // async findDeviceByDeviceId(deviceId: ObjectId): Promise<DeviceDbType | null> {
  //   return this.DeviceModel.findOne({ _id: deviceId });
  // }
  async findUserIdByDeviceId(
    deviceId: ObjectId | string,
  ): Promise<ObjectId | string | null> {
    debugger;
    console.log(deviceId);
    if (validateUUID(deviceId.toString())) {
      const foundDevice: DeviceSqlDbType[] = await this.dataSource.query(
        `SELECT id, ip, "deviceName", "lastActiveDate", "userId"
FROM public."Device"
WHERE id = $1;`,
        [deviceId],
      );
      if (foundDevice.length > 0) {
        console.log(foundDevice);
        return foundDevice[0].userId;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async findAndUpdateDeviceAfterRefresh(deviceId: string | ObjectId) {
    const newDate = new Date();
    return this.dataSource.query(
      `UPDATE public."Device"
SET "lastActiveDate" = $1
WHERE id = $2;`,
      [newDate, deviceId.toString()],
    );
  }

  async findDeviceFromUserId(
    deviceId: string,
    userId: ObjectId,
  ): Promise<boolean> {
    const result = await this.DeviceModel.findOne({
      _id: deviceId,
      userId: userId,
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }
  async findDeviceByDeviceId(
    deviceId: string,
  ): Promise<DeviceDbViewModelType | null> {
    if (validateUUID(deviceId)) {
      const foundDevice: DeviceSqlDbType[] = await this.dataSource.query(
        `SELECT id, ip, "deviceName", "lastActiveDate", "userId"
FROM public."Device"
WHERE id = $1;`,
        [deviceId],
      );
      if (foundDevice.length > 0) {
        return {
          id: foundDevice[0].id,
          userId: foundDevice[0].userId,
          ip: foundDevice[0].ip,
          deviceName: foundDevice[0].deviceName,
          lastActiveDate: foundDevice[0].lastActiveDate,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
    if (validateUUID(deviceId)) {
      await this.dataSource.query(
        `DELETE FROM public."Device"
WHERE id = $1;`,
        [deviceId],
      );
      return true;
    } else {
      return false;
    }
  }
  async deleteAllSessionExcludeCurrent(deviceId: ObjectId | string) {
    await this.DeviceModel.deleteMany({
      _id: { $ne: deviceId },
    });
    return;
  }
  async deleteAll() {
    await this.DeviceModel.deleteMany({});
  }
  // для своего теста
  async findDeviceTestByUserId(userId: string) {
    return this.DeviceModel.findOne({ userId: userId });
  }
}
