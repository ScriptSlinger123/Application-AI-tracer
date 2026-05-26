const VALID_STATUSES = ['applied', 'interview', 'rejected', 'offer'];

export function toCreateApplicationDTO(body, userId) {
  return {
    user_id: userId,
    job_id: body.job_id,
    status: VALID_STATUSES.includes(body.status) ? body.status : 'applied',
    cv_version: body.cv_version || null,
    notes: body.notes || null,
  };
}

export function toUpdateApplicationDTO(body) {
  const dto = {};
  if (body.status && VALID_STATUSES.includes(body.status)) dto.status = body.status;
  if (body.cv_version !== undefined) dto.cv_version = body.cv_version;
  if (body.notes !== undefined) dto.notes = body.notes;
  return dto;
}

export { VALID_STATUSES };
