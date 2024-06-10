import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AvatarService } from 'src/avatar/avatar.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let avatarService: AvatarService;

  const mockUser = {
    _id: '6666d1c947f94e39b1288c9d',
    email: 'd.h@live.com',
    firstName: 'dario',
    lastName: 'haxhiraj',
    avatar: 'avatar.jpeg',
  };
  const mockUserService = {
    findAll: jest.fn().mockResolvedValueOnce([mockUser]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockUser),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AvatarService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    avatarService = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should get all books', async () => {
      const result = await userController.getAllUsers({
        page: '1',
        keyword: 'test',
      });

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });
});
