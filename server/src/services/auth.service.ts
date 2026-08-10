import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { AuditService } from './audit.service';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  private static isConfiguredAdmin(email: string): boolean {
    if (!env.ADMIN_EMAILS) return false;
    const adminEmails = env.ADMIN_EMAILS.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return adminEmails.includes(email.trim().toLowerCase());
  }

  static async googleAuth(credential: string, ipAddress?: string, userAgent?: string) {
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

    const shouldBeAdmin = this.isConfiguredAdmin(email);

    let user = await User.findOne({ googleId });

    if (!user) {
      // Also check by email in case seeded or created previously
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.googleId = googleId;
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        if (shouldBeAdmin && user.role !== 'ADMIN') {
          user.role = 'ADMIN';
        }
        await user.save();
      } else {
        user = await User.create({
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          avatar: picture || '',
          googleId,
          role: shouldBeAdmin ? 'ADMIN' : 'USER',
        });
      }
    } else {
      // Update profile info from Google on each login
      user.name = name || user.name;
      user.avatar = picture || user.avatar;
      user.email = email.toLowerCase();
      if (shouldBeAdmin && user.role !== 'ADMIN') {
        user.role = 'ADMIN';
      }
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log login
    await AuditService.log({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      action: 'LOGIN',
      resourceType: 'User',
      resourceId: user._id.toString(),
      details: `${user.name} (${user.email}) logged in with role ${user.role}`,
      ipAddress,
      userAgent,
    });

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
