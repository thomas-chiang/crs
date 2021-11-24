const pool = require("../db.js");

class User {
    static makePublicUser(user) {
      return {
        id: user.user_id,
        email: user.user_email,
        username: user.user_name
      }
    }
  
    static async savePasswordResetToken(email, resetToken) {
        const result = await pool.query(
            `
            UPDATE users
            SET pw_reset_token     = $1,
                pw_reset_token_exp = $2
            WHERE user_email = $3
            RETURNING user_id, user_email, user_name;
            `,
            [resetToken.token, resetToken.expiresAt, email]
        );
  
        const user = result.rows[0];
  
        if (user) return User.makePublicUser(user)
    }
  

    static async resetPassword(token, newPassword) {

  
    

      const result = await pool.query(
        `
        UPDATE users
        SET user_password  = $1,
            pw_reset_token = NULL,
            pw_reset_token_exp = NULL
        WHERE pw_reset_token = $2
          AND pw_reset_token_exp > NOW()
          RETURNING user_id, user_email, user_name;
        `,
        [newPassword, token]
      ); 
      
  
      const user = result.rows[0]
  
      if (user) return User.makePublicUser(user)
  
      throw new BadRequestError({ message: "That token is either expired or invalid."})
  
    }
  }
  
  module.exports = User