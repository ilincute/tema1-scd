import socket
import time
import sys

type_socket = sys.argv[1]

host = "127.0.0.1"
port = 7000
message_count = 0
bytes_count = 0

mechanism = sys.argv[2]
path = sys.argv[3]

f = open(path, "rb")

if type_socket == "UDP" and mechanism == "streaming":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print("Sending messages...")

    start = time.time()
    while True:

        message = f.read(65000)
        s.sendto(message, (host, port))

        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        if len(message) == 0:
            break

elif type_socket == "UDP" and mechanism == "stop-and-wait":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print("Sending messages...")

    start = time.time()
    while True:

        message = f.read(65500)
        s.sendto(message, (host, port))

        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        if len(message) == 0:
            break

        received, address = s.recvfrom(65535)
        if received.decode() != "ready":
            break

elif type_socket == "TCP" and mechanism == "streaming":
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    print("Sending messages...")

    start = time.time()
    while True:

        message = f.read(65535)
        s.send(message)

        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        if len(message) == 0:
            break

elif type_socket == "TCP" and mechanism == "stop-and-wait":
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    print("Sending messages...")

    start = time.time()
    while True:

        message = f.read(65535)
        s.send(message)

        message_count = message_count + 1
        bytes_count = bytes_count + len(message)

        if len(message) == 0:
            break

        received = s.recv(65535)
        if received.decode() != "ready":
            break

end = time.time()
f.close()
print("Time:" + str(end - start))
print("Block count:", message_count)
print("Bytes count:", bytes_count)
print("Message sent")

s.close()

#  python3.6 client.py "/home/ilinca/Downloads/ubuntu-18.04.2-desktop-amd64.iso"
#  python 3.6 client.py "/home/ilinca/PycharmProjects/file-500.txt"
