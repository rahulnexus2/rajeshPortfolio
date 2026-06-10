import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { secretKey } = req.body;
  
  if (!secretKey) {
    return res.status(400).json({ message: 'Secret key is required' });
  }

  const expectedKey = process.env.ADMIN_SECRET_KEY || 'Rajesh@CMS2026!';
  
  if (secretKey !== expectedKey) {
    return res.status(401).json({ message: 'Invalid Admin Secret Key' });
  }

  try {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'rajesh_portfolio_jwt_secret_key_2026_@_sec',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      message: 'Login successful. Admin mode activated!'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
};

export const verifyAdminToken = async (req, res) => {
  // If request passes authMiddleware, it's valid
  return res.status(200).json({ valid: true, role: 'admin' });
};
