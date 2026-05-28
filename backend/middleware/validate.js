const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export function validateRegister(req, res, next) {
  const { name, email, password, sport, role, level } = req.body;
  const errors = [];

  if (!name?.trim()) errors.push('Full name is required');
  if (!email?.trim() || !EMAIL_REGEX.test(email)) errors.push('Valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  if (!sport?.trim()) errors.push('Sport is required');
  if (!role?.trim()) errors.push('Role/Position is required');
  if (!level || !LEVELS.includes(level)) {
    errors.push('Experience level must be Beginner, Intermediate, or Advanced');
  }

  if (errors.length) {
    return res.status(400).json({ success: false, error: errors.join('. ') });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  next();
}

export function validateChat(req, res, next) {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  next();
}
