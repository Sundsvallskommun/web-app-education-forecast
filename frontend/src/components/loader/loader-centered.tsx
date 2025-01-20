import Loader from './loader';

/* Parent should have position relative */
export default function CenteredLoader() {
  return (
    <div className="absolute inset-0 m-auto flex justify-center items-center">
      <Loader size={8} />
    </div>
  );
}
