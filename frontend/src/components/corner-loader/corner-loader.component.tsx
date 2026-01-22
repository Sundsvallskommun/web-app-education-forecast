import { Spinner } from '@sk-web-gui/react';

export const CornerLoader: React.FC = () => {
  return <Spinner className="fixed bottom-32 right-32" aria-busy="true" />;
};
