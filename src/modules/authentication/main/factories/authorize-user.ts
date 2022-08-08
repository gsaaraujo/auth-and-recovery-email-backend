import { JwtAuthTokenGenerator } from '../../../../app/utils/auth-token-generator/jwt-auth-token-generator';
import { AuthorizeUserMiddleware } from '../../infra/middlewares/authorize-user';

const tokenGenerator = new JwtAuthTokenGenerator();
const authorizeUserMiddleware = new AuthorizeUserMiddleware(tokenGenerator);

export { authorizeUserMiddleware };
