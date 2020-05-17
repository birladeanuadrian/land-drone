import struct
from typing import Dict, List, Union, Tuple
from sys import intern
import time
import numpy as np


HEADER_DATA_OFFSET = 14
REGULAR_DATA_OFFSET = 8
MAX_BUFFER_SIZE = 410


class ImageDescriptor:
    def __init__(self, image_size=0, no_pages=0, timestamp=0):
        # 2-byte unsigned int
        self.image_size = image_size

        # 2-bytes unsigned int
        self.no_pages = no_pages

        # 4-byte, 2-byte unsigned ints
        self.timestamp = timestamp

    def get_seconds(self):
        return self.timestamp // 1000

    def get_ms(self):
        return self.timestamp % 1000


class PacketDescriptor:
    def __init__(self, timestamp=0, page=0):
        self.timestamp = timestamp
        self.page = page

    def get_seconds(self):
        return self.timestamp // 1000

    def get_ms(self):
        return self.timestamp % 1000


class UdpPacketList:
    def __init__(self, image_descriptor: ImageDescriptor = None):
        self.image_descriptor: ImageDescriptor = image_descriptor
        self.packets: np.ndarray = np.array([], dtype=UdpPacket)


class UdpPacket:

    def __init__(self, buffer: bytes):
        self.buffer = buffer

    @staticmethod
    def header_packet(desc: ImageDescriptor, data: bytes):
        buf = struct.pack('<IHHHI', desc.get_seconds(),
                          desc.get_ms(),
                          0,
                          desc.no_pages,
                          desc.image_size)
        return UdpPacket(buf + data)

    @staticmethod
    def data_packet(desc: PacketDescriptor, data: bytes):
        buf = struct.pack('<IHH',
                          desc.get_seconds(),
                          desc.get_ms(),
                          desc.page)
        return UdpPacket(buf + data)

    def get_timestamp(self):
        seconds = struct.unpack('<I', self.buffer[:4])[0]
        ms = struct.unpack('<H', self.buffer[4:6])[0]
        return seconds * 1000 + ms

    def get_page(self):
        return struct.unpack('<H', self.buffer[6:8])[0]

    def is_header_packet(self):
        return self.get_page() == 0

    def get_image_descriptor(self):
        page_no = self.get_page()
        if page_no != 0:
            raise Exception('Not a header packet')  # todo: define new type of error

        timestamp = self.get_timestamp()
        number_of_page = struct.unpack('<H', self.buffer[8:10])[0]
        image_size = struct.unpack('<I', self.buffer[10:14])[0]

        return ImageDescriptor(image_size=image_size, no_pages=number_of_page, timestamp=timestamp)

    def get_data(self):
        current_page = self.get_page()
        if current_page == 0:
            return self.buffer[HEADER_DATA_OFFSET:]
        else:
            return self.buffer[REGULAR_DATA_OFFSET:]


class UdpPacker:

    def __init__(self):
        pass

    def pack(self, image: bytes):
        timestamp = int(time.time() * 1000)
        udp_packets: List[UdpPacket] = []
        jpeg_size = len(image)

        descriptor = ImageDescriptor(jpeg_size, 0, timestamp)
        initial_data_size = MAX_BUFFER_SIZE - HEADER_DATA_OFFSET
        data_buffer = image[:initial_data_size]

        first_packet = UdpPacket.header_packet(descriptor, data_buffer)
        udp_packets.append(first_packet)
        offset = initial_data_size
        page = 1
        write_size = MAX_BUFFER_SIZE - REGULAR_DATA_OFFSET

        while True:
            end = offset + write_size
            if end > jpeg_size:
                end = jpeg_size

            buffer_size = end - offset
            new_buffer = image[offset:end]
            new_desc = PacketDescriptor(timestamp, page)
            packet = UdpPacket.data_packet(new_desc, new_buffer)
            udp_packets.append(packet)
            page += 1

            if end == jpeg_size:
                break
            else:
                offset = end
        # first_packet.



class UdpUnpacker:
    def __init__(self):
        self.udp_map: Dict[str, UdpPacketList] = {}

    def add_packet(self, packet: UdpPacket) -> Union[Tuple[bytes, int]]:
        timestamp = packet.get_timestamp()
        ts = intern(f"{timestamp}")
        if ts not in self.udp_map:
            packet_list = UdpPacketList()
            self.udp_map[ts] = packet_list
        else:
            packet_list = self.udp_map[ts]

        # packet_list.packets.append(packet)
        packet_list.packets = np.insert(packet_list.packets, 0, [packet])
        # print('Packets', packet_list.packets)

        if not packet_list.image_descriptor and packet.is_header_packet():
            packet_list.image_descriptor = packet.get_image_descriptor()

        if packet_list.image_descriptor and len(packet_list.packets) == packet_list.image_descriptor.no_pages:
            # packet_list.packets.sort(key=lambda x: x.get_timestamp())
            sorted(packet_list.packets, key=lambda x: x.get_timestamp())
            image_data = b''.join([x.get_data() for x in packet_list.packets])
            del self.udp_map[ts]
            return image_data, packet_list.image_descriptor.timestamp

        return b'', 0
