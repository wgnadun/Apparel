import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';
import { CartService } from '../services/cartService';

export const useCartService = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const cartService = useMemo(() => {
    return new CartService(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return cartService;
};
