import { ReauthorizeUserController } from '../../adapters/controllers/reauthorize-user';
import { JWTReauthorizeUserService } from '../../data/services/services/jwt-reauthorize-user';

const jwtReauthorizeUserService = new JWTReauthorizeUserService();
const reauthorizeUserController = new ReauthorizeUserController(
  jwtReauthorizeUserService,
);

export { reauthorizeUserController };
