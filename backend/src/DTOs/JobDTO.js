export function toCreateJobDTO(body) {
  return {
    title: body.title?.trim(),
    company: body.company?.trim(),
    location: body.location?.trim() || null,
    description: body.description?.trim() || null,
    url: body.url?.trim() || null,
    source: body.source?.trim() || 'manual',
  };
}
