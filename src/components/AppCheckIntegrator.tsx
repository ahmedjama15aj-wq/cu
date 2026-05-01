import React from 'react';
import { useApiIsLoaded } from '@vis.gl/react-google-maps';
import { getToken } from 'firebase/app-check';
import { appCheck } from '../firebase';

export const AppCheckIntegrator: React.FC = () => {
  const apiIsLoaded = useApiIsLoaded();

  React.useEffect(() => {
    if (apiIsLoaded && appCheck && typeof google !== 'undefined') {
      // Initialize App Check integration with Google Maps
      const initAppCheck = async () => {
        try {
          // @ts-ignore - core library might not be in types yet depending on version
          const { Settings } = await google.maps.importLibrary('core');
          Settings.getInstance().fetchAppCheckToken = async () => {
            const result = await getToken(appCheck, false);
            return { token: result.token };
          };
          console.log('Google Maps App Check integration initialized');
        } catch (error) {
          console.error('Error initializing App Check for Maps:', error);
        }
      };
      initAppCheck();
    }
  }, [apiIsLoaded]);

  return null;
};
