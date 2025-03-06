const User = require('../models/Users'); // Ensure the file path is correct and the file exists

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password, phone, dateOfBirth, address, role } = req.body;
      const newUser = new User({ 
        firstName, 
        lastName, 
        email, 
        password, 
        phone, 
        dateOfBirth, 
        address, 
        role 
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },
  
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login time
      user.lastLogin = Date.now();
      await user.save();
      
      // Remove password from response
      user.password = undefined;
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
  },
  
  logoutUser: async (req, res) => {
    try {
      req.session.destroy();
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out user', error: error.message });
    }
  },
  
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error getting user profile', error: error.message });
    }
  },
  
  updateUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        const { firstName, lastName, phone, address } = req.body;
        // Only update fields that should be updateable by the user
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        
        await user.save();
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  },
};