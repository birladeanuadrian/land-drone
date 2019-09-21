cmake_minimum_required(VERSION 3.7.2)
project(drone_posix)

set(CMAKE_CXX_STANDARD 14)
#find_package(nlohmann_json 3.2.0 REQUIRED)

add_executable(drone_posix main.cpp common.h)
add_executable(queue_producer producer.cpp common.h)
add_executable(queue_consumer consumer.cpp common.h)

find_library(LIBRT rt)
if (LIBRT)
    target_link_libraries(queue_producer ${LIBRT})
    target_link_libraries(queue_consumer ${LIBRT})
    target_link_libraries(drone_posix ${LIBRT})
endif()