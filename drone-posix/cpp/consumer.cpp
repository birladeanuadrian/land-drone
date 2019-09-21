//
// Created by birla on 17/08/2019.
//

#include <unistd.h>
#include <sys/types.h>
#include <iostream>
#include <mqueue.h>
//#include <sys/rt_syscall>
#include <cstring>
#include "common.h"

//#include <unistd.h>
//#include <sys/types.h>
//#include <cstdio>
//#include <sys/resource.h>
//#include <ctime>
//#include <sched.h>
//#include <sys/mman.h>
//#include <sys/fcntl.h>
//#include <csignal>
//#include <mqueue.h>
//#include <cerrno>

struct mq_attr attr;



using namespace std;

int main() {
    mqd_t mq;
    char buffer[QUEUE_MSGSIZE + 1];
    unsigned int priority;
    ssize_t bytesRead;
    attr.mq_flags = 0;
    attr.mq_maxmsg = 16;
    attr.mq_msgsize = QUEUE_MSGSIZE;
    attr.mq_curmsgs = 0;


    cout << "Starting consumer\n";

    mq = mq_open(QUEUE_NAME, O_CREAT | O_RDONLY, QUEUE_PERMS, attr);
    if (mq < 0) {
        perror("Failed to open queue");
        return -1;
    }

    mq_getattr(mq, &attr);
    cout << "Max message size: " << attr.mq_msgsize << endl;
    cout << "Max message count: " << attr.mq_maxmsg << endl;

    cout << "Queue opened\n";

    while (true) {
        memset(buffer, 0x00, sizeof(buffer));
        bytesRead = mq_receive(mq, buffer, QUEUE_MSGSIZE, &priority);
        if (bytesRead == -1) {
            perror("Failed to receive message");
            break;
        }

        cout << "Bytes read: " << bytesRead << endl;
        cout<< "Message: " << buffer << endl;

    }

    mq_close(mq);
    mq_unlink(QUEUE_NAME);
}