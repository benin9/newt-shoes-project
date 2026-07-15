UPDATE users SET password='$2b$12$b6XY0HFP7/GS60u3mIJsK.EgqG4uLzzMMfy9AuDpwAWgorHxkt0zS' WHERE email='admin@newt.local';
UPDATE users SET password='$2b$12$6X1DzsjWK9BvpGY2mYz/7.0ztV3SJ0OKBaD9tNW0rAuLzDNysvnLO' WHERE email='kurir@newt.local';
SELECT email, role, password FROM users WHERE email IN ('admin@newt.local','kurir@newt.local');
