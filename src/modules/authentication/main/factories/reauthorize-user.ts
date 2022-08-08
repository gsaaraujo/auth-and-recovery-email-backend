import { ReauthorizeUserController } from '../../infra/controllers/reauthorize-user';
import { JWTReauthorizeUserService } from '../../data/services/jwt-reauthorize-user';
import { JwtAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/jwt-auth-token-generator';

const tokenGenerator = new JwtAuthTokenGenerator();
const jwtReauthorizeUserService = new JWTReauthorizeUserService(tokenGenerator);
const reauthorizeUserController = new ReauthorizeUserController(
  jwtReauthorizeUserService,
);

export { reauthorizeUserController };
