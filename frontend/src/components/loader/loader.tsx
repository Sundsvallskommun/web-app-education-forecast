import { Spinner } from '@sk-web-gui/react';
interface Loader {
  size?: number;
}

export default function Loader(props: Loader) {
  const { size = 6 } = props;
  return (
    <span className="inline-flex">
      <Spinner size={size} />
    </span>
  );
}
