import socket
import time
import sys

host = "127.0.0.1"
port = 7000

message_count = 0
bytes_count = 0

type_socket = sys.argv[1]
mechanism = sys.argv[2]

print("Server started")
start = time.time()
if type_socket == "UDP" and mechanism == "streaming":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind((host, port))

    while True:

        message, address = s.recvfrom(65535)
        if len(message) == 0:
            break
        message_count = message_count + 1
        bytes_count = bytes_count + len(message)
    s.close()

elif type_socket == "UDP" and mechanism == "stop-and-wait":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind((host, port))

    while True:

        message, address = s.recvfrom(65535)
        if len(message) == 0:
            break
        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        s.sendto("ready".encode(), address)
    s.close()

elif type_socket == "TCP" and mechanism == "streaming":
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host, port))

    s.listen(1)
    (conn, info) = s.accept()
    while True:

        message = conn.recv(65535)
        if len(message) == 0:
            break
        message_count = message_count + 1
        bytes_count = bytes_count + len(message)
    conn.close()

elif type_socket == "TCP" and mechanism == "stop-and-wait":
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host, port))

    s.listen(1)
    (conn, info) = s.accept()
    while True:

        message = conn.recv(65535)
        if len(message) == 0:
            break
        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        conn.send(b"ready")
    conn.close()

end = time.time()
print("Protocol:", type_socket)
print("Time:", end - start)
print("Block count:", message_count)
print("Bytes count:", bytes_count)

print("Server closed")
