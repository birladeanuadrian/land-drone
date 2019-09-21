#include <iostream>
#include <mqueue.h>
#include "common.h"


int main() {
    mq_unlink(QUEUE_NAME);
    std::cout << "Hello, World!" << std::endl;
    return 0;
}