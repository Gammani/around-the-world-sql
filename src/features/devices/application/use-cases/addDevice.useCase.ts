import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from '../../domain/devices.entity';
import { InjectModel } from '@nestjs/mongoose';

export class AddDeviceCommand {
  constructor(
    public userId: ObjectId,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(AddDeviceCommand)
export class AddDeviceUseCase implements ICommandHandler<AddDeviceCommand> {
  constructor(
    private devicesRepository: DeviceRepository,
    @InjectModel(Device.name) private DeviceModel: Model<DeviceDocument>,
  ) {}

  async execute(command: AddDeviceCommand) {
    const createdDeviceDtoModel = {
      userId: command.userId,
      ip: command.ip,
      deviceName: command.deviceName,
    };
    const device = new this.DeviceModel(createdDeviceDtoModel);
    device._id = new ObjectId();
    device.lastActiveDate = new Date().toISOString();

    const createdDevice = await this.devicesRepository.createDevice(device);
    return {
      _id: createdDevice._id,
      userId: createdDevice.userId,
      ip: createdDevice.ip,
      deviceName: createdDevice.deviceName,
      lastActiveDate: createdDevice.lastActiveDate,
    };
  }
}
