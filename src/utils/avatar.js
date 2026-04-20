export function generateAvatarFromName(name = 'User') {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || 'U')}&background=6d5efc&color=ffffff&size=256`;
}
