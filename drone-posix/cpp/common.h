//
// Created by birla on 17/08/2019.
//

#ifndef DRONE_POSIX_COMMON_H
#define DRONE_POSIX_COMMON_H

#define QUEUE_NAME "/test_queue"
#define QUEUE_PERMS ((int)(0644))
#define QUEUE_MAXMSG 16
#define QUEUE_MSGSIZE 8192
#define QUEUE_ATTR_INITIALIZER ((struct mq_attr){0, QUEUE_MAXMSG, QUEUE_MSGSIZE, 0, {0}})


#endif //DRONE_POSIX_COMMON_H
