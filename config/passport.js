const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')

const User = require('../models/userModel')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, cb) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      }
      try {
        let user = await User.findOne({ googleId: profile.id })
        if (user) {
          cb(null, user)
        } else {
          user = await User.create(newUser)
          cb(null, user)
        }
      } catch (err) {
        console.error(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})

module.exports = passport
