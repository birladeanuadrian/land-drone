import struct
from typing import Dict, List, Union, Tuple
from sys import intern


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


class PacketDescriptor:
    def __init__(self, timestamp=0, page=0):
        self.timestamp = timestamp
        self.page = page


class UdpPacketList:
    def __init__(self, image_descriptor: ImageDescriptor = None):
        self.image_descriptor: ImageDescriptor = image_descriptor
        self.packets: List[UdpPacket] = []


class UdpPacket:

    def __init__(self, buffer: bytes):
        self.buffer = buffer

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

        packet_list.packets.append(packet)
        if not packet_list.image_descriptor and packet.is_header_packet():
            packet_list.image_descriptor = packet.get_image_descriptor()

        if packet_list.image_descriptor and len(packet_list.packets) == packet_list.image_descriptor.no_pages:
            packet_list.packets.sort(key=lambda x: x.get_timestamp())
            image_data = b''.join([x.get_data() for x in packet_list.packets])
            del self.udp_map[ts]
            return image_data, packet_list.image_descriptor.timestamp

        return b'', 0



