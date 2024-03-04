import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply } from 'fastify';
import { REPLY_KEY_STATUS_CODE, Status } from './code.js';

const success = async (server: FastifyInstance) => {
  for (const status in REPLY_KEY_STATUS_CODE) {
    server.decorateReply(
      status,
      function (this: FastifyReply, data?: unknown) {
        this.statusCode = REPLY_KEY_STATUS_CODE[status as Status];
        this.send(data);
        return this;
      },
    );
  }
};

export default fp(success, {
  name: '@bettercareers/fastify-success',
});
