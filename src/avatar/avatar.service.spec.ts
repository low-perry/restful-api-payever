import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';

describe('AvatarService', () => {
  let avatarService: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarService],
    }).compile();

    avatarService = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(avatarService).toBeDefined();
  });
});
