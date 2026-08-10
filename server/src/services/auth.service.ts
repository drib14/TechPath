import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async googleAuth(credential: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw ApiError.unauthorized('Invalid Google token');
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !googleId) {
      throw ApiError.unauthorized('Google account missing required information');
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        avatar: picture || '',
        googleId,
        role: 'USER',
      });
    } else {
      // Update profile info from Google on each login
      user.name = name || user.name;
      user.avatar = picture || user.avatar;
      user.email = email;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return user;
  }
}
