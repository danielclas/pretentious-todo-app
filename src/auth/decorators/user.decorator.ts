import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const handler = (_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
};

export const User = createParamDecorator(handler);
