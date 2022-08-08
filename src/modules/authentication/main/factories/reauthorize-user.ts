import { ReauthorizeUserController } from '../../infra/controllers/reauthorize-user';
import { ReauthorizeUserService } from '../../data/services/reauthorize-user';
import { JwtAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/jwt-auth-token-generator';

const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();
const reauthorizeUserService = new ReauthorizeUserService(
  jwtAuthTokenGenerator,
);
const reauthorizeUserController = new ReauthorizeUserController(
  reauthorizeUserService,
);

export { reauthorizeUserController };
