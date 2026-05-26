export function toRegisterDTO(body) {
  return {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    password: body.password,
  };
}

export function toLoginDTO(body) {
  return {
    email: body.email?.trim().toLowerCase(),
    password: body.password,
  };
}
