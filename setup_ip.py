import os
import re
import socket


class InvalidIpAddress(Exception):
	pass

def isValidIp(ip):
	return re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", ip)

if __name__ == '__main__':
	try:
		hostname = socket.gethostname()    
		user_ip = socket.gethostbyname(hostname) 
	except:
		user_ip = input('Enter your computer IP: ')
		if not isValidIp(user_ip):
			raise InvalidIpProvided("IP addess provided is not in the correct format or it's not an IP address.")		
	finally:
		py_dotenv = open('server/env.py', 'w')
		py_dotenv.write(f'USER_IP="{user_ip}"')	
		py_dotenv.close()
		js_dotenv = open('app/.env', 'w')
		js_dotenv.write(f'USER_IP={user_ip}')
		js_dotenv.close()


