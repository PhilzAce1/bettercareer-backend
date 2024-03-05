import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { Prisma } from '@prisma/client';
import { isDevelopment } from './index.js';

export type HandlerContext = {
  getCurrentUser(): Partial<Prisma.UserGetPayload<{}>>;
};

type HandleOptions = {
  input: {
    body?: {};
    params?: {};
    querystring?: {};
    header?: {};
  };
  context?: HandlerContext;
  resolve(context?: HandlerContext): Promise<void>;
};

export class Handler {
  private context: HandlerContext | undefined;
  private options: Partial<HandleOptions>;

  constructor() {
    this.context = {
      getCurrentUser() {
        return { id: 'dsigagag', name: 'jude' };
      },
    };
    this.options = {};
  }

  private async validate(request: FastifyRequest) {
    if (!this.options.input) throw new Error();

    for (const [part, schema] of Object.entries(this.options.input)) {
      // run validateion
      // const values = request[part];
      throw new Error(
        `invalid ${part}, ${JSON.stringify(schema)}, ${JSON.stringify(request)}`,
      );
    }
  }

  private async verify(request: FastifyRequest) {
    // reply: FastifyReply, // request: FastifyRequest,
    // await guards.authorize.call(this, request, reply);
    // aeait setUser
    // await validate
    console.log(request);
  }

  handle(options: HandleOptions) {
    const that = this;

    return async function (
      this: FastifyInstance,
      request: FastifyRequest,
      _: FastifyReply,
    ) {
      await that.verify(request);
      await that.validate(request);
      that.options = options;

      if (!that.context) throw new Error();

      options.resolve(that.context).catch((error) => {
        if (isDevelopment) this.log.error(error);
        throw new TypeError();
      });
    };
  }
}

export const handler = new Handler();
