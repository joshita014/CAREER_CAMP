const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user,
  });
};

// update user Details
module.exports.updateUser = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { username, password, confirm_password } = req.body;

    if (password != confirm_password) {
      return res.redirect("back");
    }

    if (!user) {
      return res.redirect("back");
    }

    user.username = username;
    user.password = password;

    user.save();
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// render the Sign In page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signin.ejs");
};

// render the Sign Up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signup.ejs");
};

// creating up a new user
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // if password doesn't match
    if (password != confirm_password) {
      return res.redirect("back");
    }

    // check if user already exist
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log("Error in finding user in signing up");
        return;
      }

      if (!user) {
        await User.create(
          {
            email,
            password,
            username,
          },
          (err, user) => {
            if (err) {
              req.flash("error", "Couldn't sign Up");
            }
            return res.redirect("/");
          }
        );
      } else {
        req.flash("error", "Email already registed!");
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// sign in and create a session for the user
module.exports.createSession = (req, res)=> {
  req.flash('success', 'Logged in Successfully')

  return res.redirect("/dashboard");
};

// clears the cookie
module.exports.destroySession = (req, res) => {
  req.logout(req.user, err => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You Have Logged Out!');
    
    return res.redirect("/");
  });
};
