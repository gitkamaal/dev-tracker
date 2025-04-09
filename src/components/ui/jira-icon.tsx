import Image from 'next/image';

interface JiraIconProps {
  className?: string;
}

export function JiraIcon({ className = "h-4 w-4" }: JiraIconProps) {
  return (
    <Image 
      src="/jira-1.svg" 
      alt="Jira" 
      width={16} 
      height={16} 
      className={className}
    />
  );
}
