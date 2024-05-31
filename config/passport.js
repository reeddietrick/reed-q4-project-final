import { Strategy as LocalStrategy } from 'passport-local';
import Customer from '../models/Customer.js';
import bcrypt from 'bcrypt';

const hardcodedUsername = 'admin';
const hardcodedPasswordHash = bcrypt.hashSync('password', 10); // Pre-hash the password

export default function(passport) {
  passport.use(new LocalStrategy((username, password, done) => {
    if (username !== hardcodedUsername) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    bcrypt.compare(password, hardcodedPasswordHash, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) {
        return done(null, { id: '1', username: hardcodedUsername }); // Return a dummy user object
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (id === '1') {
      done(null, { id: '1', username: hardcodedUsername }); // Return the dummy user object
    } else {
      done(new Error('Invalid user'));
    }
  });
}