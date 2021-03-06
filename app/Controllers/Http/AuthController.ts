import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Validation from "App/Service/Validation";
//import { DateTime } from "luxon";
import Profile from "App/Models/Profile";

export default class AuthController {
  //REGISTER

  public async register({ request, logger, response }: HttpContextContract) {
    
    try {
      const data = await Validation.rValidate(request) ;
      const user = await User.create(data);
      await Profile.create({ user_id: user.id });
      logger.info(`User Registered---->${JSON.stringify(user)}`);
      return response.status(200).send(`User Registered!`);
    } catch (error) {
      logger.error(`ERROR==>${error}`);
      return response.status(404).send({ error: { message: "Failure!" } });
    }
  }

  //LOGIN

  public async login({ request, logger, auth, response }: HttpContextContract) {
    const data = await Validation.lValidate(request) ;
    const {email,password} = data;
    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "24hours",
      });
      logger.info(`Logged In Successfully with ${JSON.stringify(token)}`);
      return token.toJSON();
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(400).send({
        error: {
          message: "Incorrect Email or Password!",
        },
      });
    }
  }

  //LOGOUT

  public async logout({ auth, logger, response }: HttpContextContract) {
    try {
      await auth.logout();
      logger.info(`Logged Out ${JSON.stringify({ revoke: true })}`);
      return response.status(200).send("Logged Out Successfully!");
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  }

/*   //RESET PASSWORD

  public async resetPassword({
    request,
    logger,
    response,
  }: HttpContextContract) {
    try {
      const email = request.input("email");
      const newPassword = request.input("newPassword");
      const payload = { password: newPassword };
      const user = await User.findBy("email", email);
      let result = await user?.merge(payload).save();
      logger.info(
        `Password Reset on ${result?.updatedAt.toLocaleString(
          DateTime.DATETIME_SHORT
        )}`
      );
      return response
        .status(200)
        .send(
          `Password Reset : ${result?.updatedAt.toLocaleString(
            DateTime.DATETIME_SHORT
          )}`
        );
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  } */

}
