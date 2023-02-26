---
title: "RPC"
date: 2023-02-25T22:51:15-06:00
---

# Networks

Network Interface Controllers (NICs) can connect a computer to different physical mediums, such as Ethernet and Wi-Fi. Every NIC in the world has a unique MAC (media access control) address. It consists of 48 bits. Therefore, there are 28 trillion possible MAC addresses. Some devices randomly change their MAC address for privacy.

You can use command `ifconfig` to check you network interface controller and its corresponding MAC address. There exists virtual interfaces as well. For example, `lo`, the loopback device, is a virtual interface. It connects your computer to a mini network containing just your computer.

A network has nodes that send bytes to other nodes by MAC address. Nodes can be computers, switches, etc. The bytes are directed, or forwarded by switches. The whole network uses the same physical tech (Wi-Fi, Ethernet, etc.)

# Internets and the Internet

Routers connect networks together to form internets. The global internet we all use is the Internet. Packets, which are some bytes with an address and other info, can be forwarded along a path from point A to point B. Routers contain forwarding tables that help them decide which direction to send along a packet. Those tables would be too big if a router had to know where every MAC address existed in the internet.

IP addresses are used to send packets across an internet. There are about 4 billion possible IP address (IPv4). Forwarding tables only need to know which way to send for a given network number, which is encoded in the IP address.

The challenge is that we don't have enough IPv4 addresses. We don't want every machine to be able to receive packets from anywhere. Private networks have private ranges. Different private networks can have the same IP address. 

Network address translation (NAT) converts a public IP into a private IP. Only NAT knows the public address of a computer. The network interface of the computer does not know that.

Computers might be running multiple processes using the network. The IP address corresponds to a NIC, and the port number corresponds to a process.

# Transport Protocols

User Datagram Protocol (UDP)
Transmission Controll Protocol (TCP)
These two protocols both build on IP networking and both provide port numbers.

```
sudo lsof -i tcp -P
```

The difference between UDP and TCP is reliability. Packets may be dropped, reordered, and split. TCP saves+resembles packets in order to provide original message (when possible). For packet drop, it retries. UDP does not do this extra work.

# Application Protocols

## HTTP 

Hypertext Transfer Protocol (HTTP): URL (domain/IP + port + resource)

HTTP messages between clients and servers:
A client sends  a request to a server. And the server sends a response back to the client. There are 4 common types of request: POST, PUT, GET, and DELETE.

## RPC

Remote Procedure Calls (RPCs), helps us to call a function on the other computer. For example, a client can call a function on the server. (client application and server application do not need to write in the same programming language).

There are many tools to do RPCs (Thrift, gRPC). `gRPC` builds on HTTP. When every we make a call, we make an HTTP POST request. The return value is returned through an HTTP response.

###  Serialization/Deserialization (Protobufs)

How do we represent arguments and return values as bytes in a request/response body? Serialization is converting various types into bytes. Deserialization converts bytes to various types. The challenge is that every language has different types and we want cross-languages calls. gRPC uses Google's Protocol Buffers provide a uniform type system. The other challenge is that different CPUs order bytes differently. Some CPUs have big-endian, and some have little-endian. Protobufs help us to deal with this.

For computational efficiency, `int32` uses 4 bytes during computation. For space efficiency, smaller numbers in `int32` uses fewer bytes (4 bytes is max). This reduces network traffic. This is called variable-length encoding.

# gRPC

Proto file:
```proto
syntax = "proto3";

service Calc {
  rpc Mult(MultReq) returns (MultResp);
}

message MultReq {
  int32 x = 1;
  int32 y = 2;
}

message MultResp {
  int32 result = 1;
}
```

Generate code
```
python3 -m grpc_tools.protoc -I=. --python_out=. --grpc_python_out=. XXXX.proto
```

Server file
```python
import grpc
from concurrent import futures
import math_pb2_grpc
import math_pb2

class Calc(math_pb2_grpc.CalcServicer):
    def Mult(self, request, context):
        print(request)
        result = request.x * request.y
        return math_pb2.MultResp(result=result)

server = grpc.server(futures.ThreadPoolExecutor(max_workers=10), options=[("grpc.so_reuseport", 0)])

math_pb2_grpc.add_CalcServicer_to_server(Calc(), server)

server.add_insecure_port('localhost:5444')
server.start()
print("Listening to port 5444...")
server.wait_for_termination()
```

Client file
```python
import grpc
import math_pb2
import math_pb2_grpc

channel = grpc.insecure_channel("localhost:5444")
stub = math_pb2_grpc.CalcStub(channel)

response = stub.Mult(math_pb2.MultReq(x=3, y=4))
print(response)
```

