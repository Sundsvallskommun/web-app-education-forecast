import { useEffect } from 'react';

interface EmptyLayout {
  title: string;
  children: React.ReactNode;
}

export default function EmptyLayout(props: EmptyLayout) {
  const { title, children } = props;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="EmptyLayout">
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
