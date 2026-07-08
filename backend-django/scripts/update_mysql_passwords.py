import mysql.connector

h = "127.0.0.1"
u = "root"
p = "root"
db = "newt_shoes"

admin_hash = "$2b$12$b6XY0HFP7/GS60u3mIJsK.EgqG4uLzzMMfy9AuDpwAWgorHxkt0zS"
curier_hash = "$2b$12$6X1DzsjWK9BvpGY2mYz/7.0ztV3SJ0OKBaD9tNW0rAuLzDNysvnLO"

conn = mysql.connector.connect(host=h, user=u, password=p, database=db)
cur = conn.cursor()
cur.execute("UPDATE users SET password=%s WHERE email=%s", (admin_hash, 'admin@newt.local'))
cur.execute("UPDATE users SET password=%s WHERE email=%s", (curier_hash, 'kurir@newt.local'))
conn.commit()
cur.execute("SELECT email, role, password FROM users WHERE email IN (%s, %s)", ('admin@newt.local','kurir@newt.local'))
rows = cur.fetchall()
print(rows)
cur.close()
conn.close()
