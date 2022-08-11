import { SlotDocumentName } from './../resources/slot/entities/slot.entity';
import mongoose, { Connection, Model } from 'mongoose';
import { CustomLogger } from '../common/logger/custom-logger.service';
import {
  User,
  UserDocument,
  UserDocumentName,
} from '../resources/user/entities/user.entity';
import {
  Doctor,
  DoctorDocument,
  DoctorDocumentName,
} from '../resources/doctor/entities/doctor.entity';
import { Slot, SlotsDocument } from '../resources/slot/entities/slot.entity';

export class DbInitializer {
  constructor(
    private connection: Connection,
    private logger: CustomLogger,
    //
    public usersCollName = `${UserDocumentName.toLocaleLowerCase()}s`,
    public doctorsCollName = `${DoctorDocumentName.toLocaleLowerCase()}s`,
    public slotsCollName = `${SlotDocumentName.toLocaleLowerCase()}s`,
  ) {}

  public async seedManyDocumentsIntoDb() {
    const UserModel = (await this.connection.model(
      UserDocumentName,
    )) as Model<UserDocument>;

    const DoctorsModel = (await this.connection.model(
      DoctorDocumentName,
    )) as Model<DoctorDocument>;

    const SlotsModel = (await this.connection.model(
      SlotDocumentName,
    )) as Model<SlotsDocument>;
    try {
      const initUsers: User[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'User1',
          phone: '+38 097 32 744 93',
          email: 'user1@domain.com',
          slots: [],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'User2',
          phone: '+38 054 53 834 03',
          email: 'user2@domain.com',
          slots: [],
        },
      ];
      const usersFromDb = await UserModel.create(initUsers);

      const initDoctors: Doctor[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Doctor1',
          phone: '+38 097 23 704 93',
          email: 'doctor1@domain.com',
          spec: 'family doctor',
          slots: [],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Doctor2',
          phone: '+38 088 13 534 03',
          email: 'doctor2@domain.com',
          spec: 'surgeon',
          slots: [],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Doctor3',
          phone: '+38 024 85 234 42',
          email: 'doctore@domain.com',
          spec: 'ENT specialist',
          slots: [],
        },
      ];

      const doctorsFromDb = await DoctorsModel.create(initDoctors);

      const initSlots: Slot[] = [
        // ================================== doctor0
        // busy slots for doctor0
        {
          user: usersFromDb[0],
          doctor: doctorsFromDb[0],
          slot_date: new Date('2022-08-12T10:00:00.000Z'),
          free: false,
        },
        //free slots for doctor0
        {
          doctor: doctorsFromDb[0],
          slot_date: new Date('2022-08-12T14:00:00.000Z'),
          free: true,
        },
        {
          doctor: doctorsFromDb[0],
          slot_date: new Date('2022-08-12T16:00:00.000Z'),
          free: true,
        },

        // ================================== doctor1
        // busy slots for doctor1
        {
          user: usersFromDb[1],
          doctor: doctorsFromDb[1],
          slot_date: new Date('2022-08-12T10:00:00.000Z'),
          free: false,
        },
        {
          user: usersFromDb[1],
          doctor: doctorsFromDb[1],
          slot_date: new Date('2022-08-12T12:00:00.000Z'),
          free: false,
        },
        // free slots for doctor1
        {
          doctor: doctorsFromDb[1],
          slot_date: new Date('2022-08-12T16:00:00.000Z'),
          free: true,
        },

        // ================================== doctor2
        //free slots for doctor2
        {
          doctor: doctorsFromDb[2],
          slot_date: new Date('2022-08-12T10:00:00.000Z'),
          free: true,
        },
        {
          doctor: doctorsFromDb[2],
          slot_date: new Date('2022-08-12T12:00:00.000Z'),
          free: true,
        },
        {
          doctor: doctorsFromDb[2],
          slot_date: new Date('2022-08-12T14:00:00.000Z'),
          free: true,
        },
        {
          doctor: doctorsFromDb[2],
          slot_date: new Date('2022-08-12T16:00:00.000Z'),
          free: true,
        },
      ];

      const slotsFromDb = await SlotsModel.create(initSlots);

      for (const slot of slotsFromDb) {
        if (slot.doctor._id) {
          await DoctorsModel.findOneAndUpdate(
            { _id: slot.doctor._id },
            {
              $push: { slots: slot._id },
            },
            { new: true },
          );
        }

        if (slot?.user && slot?.user?._id) {
          await UserModel.findOneAndUpdate(
            { _id: slot.user._id },
            { $push: { slots: slot._id } },
            { new: true },
          );
        }
      }

      return { usersFromDb, doctorsFromDb, slotsFromDb };
    } catch (error) {
      this.logger.error('an error occurred while seeding db', error);
    }
  }
}
