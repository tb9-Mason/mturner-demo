import { useContext } from 'react';
import { BackendContext } from '../providers/BackendProvider';
import { Button } from './interactivity';

interface BackendToggleProps {
  isSupported: boolean;
}

export const BackendToggle = ({ isSupported }: BackendToggleProps) => {
  const { backend, setBackend } = useContext(BackendContext);
  if (isSupported) {
    return (
      <div>
        You are currently using the {backend} backend. Use the button below to see this feature using a different
        server.
        <div className="mt-2">
          <Button size="sm" onClick={() => (backend === 'express' ? setBackend('laravel') : setBackend('express'))}>
            Toggle Backend
          </Button>
        </div>
      </div>
    );
  } else {
    return <div>This feature does not support backend toggling.</div>;
  }
};
