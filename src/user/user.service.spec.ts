import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;

  let model: Model<User>;

  const mockUser = {
    _id: '6666d1c947f94e39b1288c9d',
    email: 'd.h@live.com',
    firstName: 'dario',
    lastName: 'haxhiraj',
    avatar: 'avatar.jpeg',
  };
  const mockUserService = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const query = { page: '1', keyword: 'test' };
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue(mockUser),
            }),
          }) as any,
      );

      const result = await userService.findAll(query);
      expect(model.find).toHaveBeenCalled();
      expect(model.find).toHaveBeenCalledWith({
        name: { $regex: 'test', $options: 'i' },
      });
      expect([result]).toEqual([mockUser]);
    });
  });

  // describe('create', () => {
  //   it('should create and return a  user', async () => {
  //     const newUser = {
  //       email: 'd.h@live.com',
  //       firstName: 'dario',
  //       lastName: 'haxhiraj',
  //       avatar: 'avatar.jpeg',
  //     };
  //     jest
  //       .spyOn(model, 'create')
  //       .mockImplementationOnce(() => Promise.resolve(mockUser));

  //     const result: User = await userService.create(newUser as CreateUserDto);
  //     // expect(model.create).toHaveBeenCalledWith(mockUser);
  //     expect(result).toEqual(mockUser);
  //   });
  // });

  describe('findById', () => {
    it('should find and return a user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser);
      const result = await userService.findbyId('6666d1c947f94e39b1288c9d');
      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if invalid id', async () => {
      const id = 'invalid_id';
      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(userService.findbyId(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(userService.findbyId(mockUser._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
    });
  });

  describe('updateById', () => {
    it('should update and return a user', async () => {
      const updatedUser = { ...mockUser, firstName: 'xhes' };
      const user = { firstName: 'xhes' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

      const result = await userService.updateById(mockUser._id, user as any);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, user, {
        new: true,
        runValidators: true,
      });

      expect(result.firstName).toEqual(user.firstName);
    });
  });
  describe('deleteById', () => {
    it('should delete and return a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockUser);

      const result = await userService.deleteById(mockUser._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);

      expect(result).toEqual(mockUser);
    });
  });
});
