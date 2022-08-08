import { JwtAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/jwt-auth-token-generator';
import { AuthorizeUserService } from '../../data/services/authorize-user';
import { AuthorizeUserController } from '../../infra/controllers/authorize-user';

const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();
const authorizeUserService = new AuthorizeUserService(jwtAuthTokenGenerator);
const authorizeUserController = new AuthorizeUserController(
  authorizeUserService,
);

export { authorizeUserController };
