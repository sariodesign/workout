type greeting = 'Good night' | 'Good morning' | 'Good afternoon' | 'Good evening'

export const getGreetingMessage = (hour: number): greeting => {
  const messages = ['Good night', 'Good morning', 'Good afternoon', 'Good evening'] as const;
  const ranges = [21, 5, 12, 17];
  const index = ranges.findIndex((h, i, a) => hour < (a[i + 1] ?? 24));
  return messages[index];
};