import Head from 'next/head';

interface EmptyLayout {
  title: string;
  children: React.ReactNode;
}

export default function EmptyLayout(props: EmptyLayout) {
  const { title, children } = props;
  return (
    <div className="EmptyLayout">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="min-h-screen">{children}</div>
    </div>
  );
}
