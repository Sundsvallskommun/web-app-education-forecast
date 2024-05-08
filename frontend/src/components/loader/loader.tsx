import { Spinner } from '@sk-web-gui/react';

export default function Loader(props) {
  const { size = 'md', ...rest } = props;
  return (
    <span className="inline-flex">
      <Spinner size={size} {...rest} />
    </span>
  );
}
