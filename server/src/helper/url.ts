function getDomain(url: string) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  }
  return hostname;
}

export { getDomain };
