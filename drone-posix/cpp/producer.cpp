//
// Created by birla on 17/08/2019.
//

#include <iostream>
#include <mqueue.h>
#include "common.h"
#include <node.h>

using namespace std;

int main() {
    mqd_t mq;
    char buffer[QUEUE_MSGSIZE + 1];

    cout << "Starting producer\n";

    mq = mq_open(QUEUE_NAME, O_WRONLY);
    if (mq < 0) {
        cout<< "Failed to open queue\n";
        return -1;
    }

    cout << "Queue opened\n";
    snprintf(buffer, sizeof(buffer), "This is a message");
    mq_send(mq, buffer, QUEUE_MSGSIZE, 1);
    mq_close(mq);
}